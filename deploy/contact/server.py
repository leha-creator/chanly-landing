#!/usr/bin/env python3
"""Same-origin contact endpoint. The recipient is fixed; SMTP credentials stay here."""
from collections import deque
from dataclasses import dataclass
from email.message import EmailMessage
from email.utils import formatdate, make_msgid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import ipaddress
import json
import logging
import os
import re
import smtplib
import ssl
import threading
import time
from urllib.parse import urlsplit

RECIPIENT = "info@chanly.ru"
ENDPOINT = "/api/landing/contact"
MAX_BODY = 32_768
LOG = logging.getLogger("chanly.contact")


@dataclass(frozen=True)
class Settings:
    host: str
    port: int
    user: str
    password: str
    sender: str
    origins: frozenset[str]

    @classmethod
    def from_env(cls):
        required = ("SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_ALLOWED_ORIGINS")
        for key in required:
            if not os.environ.get(key, "").strip():
                raise ValueError(f"Required setting: {key}")
        origins = frozenset(os.environ["CONTACT_ALLOWED_ORIGINS"].split())
        for origin in origins:
            parts = urlsplit(origin)
            if parts.scheme not in ("https", "http") or not parts.netloc or parts.path or parts.query or parts.fragment:
                raise ValueError("CONTACT_ALLOWED_ORIGINS must contain exact origins without paths")
        sender = os.environ.get("SMTP_FROM", RECIPIENT)
        if not valid_email(sender):
            raise ValueError("SMTP_FROM must be an email address")
        return cls(os.environ["SMTP_HOST"], int(os.environ.get("SMTP_PORT", "465")),
                   os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"], sender, origins)


def valid_email(value):
    return (isinstance(value, str) and len(value) <= 254
            and re.fullmatch(r"[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+", value) is not None)


def validate(data):
    if not isinstance(data, dict) or data.get("consent") is not True:
        raise ValueError("consent")
    fields = {}
    for field, limit in (("name", 100), ("email", 254), ("question", 5000)):
        value = data.get(field)
        if not isinstance(value, str) or not 1 <= len(value.strip()) <= limit:
            raise ValueError(field)
        fields[field] = value.strip()
    if not valid_email(fields["email"]):
        raise ValueError("email")
    return fields


class RateLimiter:
    """Five requests per IP and 100 in total per hour; bounded storage."""
    def __init__(self, clock=time.monotonic):
        self.clock = clock
        self.clients = {}
        self.total = deque()
        self.lock = threading.Lock()

    def allow(self, client):
        with self.lock:
            cutoff = self.clock() - 3600
            self.clients = {ip: times for ip, times in self.clients.items() if times[-1] > cutoff}
            while self.total and self.total[0] <= cutoff:
                self.total.popleft()
            times = self.clients.get(client, deque())
            while times and times[0] <= cutoff:
                times.popleft()
            if len(times) >= 5 or len(self.total) >= 100:
                return False
            now = self.clock()
            times.append(now)
            self.clients[client] = times
            self.total.append(now)
            return True


def send_email(settings, fields):
    message = EmailMessage()
    message["From"] = settings.sender
    message["To"] = RECIPIENT
    message["Reply-To"] = fields["email"]
    message["Subject"] = "Заявка с лендинга Chanly"
    message["Date"] = formatdate(localtime=False)
    message["Message-ID"] = make_msgid(domain="chanly.ru")
    message.set_content(f"Имя: {fields['name']}\nПочта: {fields['email']}\n\n"
                        f"Вопрос:\n{fields['question']}\n\nСогласие на обработку данных: дано.\n")
    with smtplib.SMTP_SSL(settings.host, settings.port, timeout=8,
                          context=ssl.create_default_context()) as smtp:
        smtp.login(settings.user, settings.password)
        refused = smtp.send_message(message, from_addr=settings.sender, to_addrs=[RECIPIENT])
        if refused:
            raise smtplib.SMTPRecipientsRefused(refused)


class ContactService:
    def __init__(self, settings, sender=send_email, limiter=None):
        self.settings = settings
        self.sender = sender
        self.limiter = limiter or RateLimiter()
        self.slots = threading.BoundedSemaphore(4)

    def submit(self, headers, raw, client):
        if headers.get("Origin") not in self.settings.origins:
            return 403, {"error": "origin_not_allowed"}
        if headers.get("Content-Type", "").split(";", 1)[0].strip().lower() != "application/json":
            return 415, {"error": "json_required"}
        if not self.limiter.allow(client):
            return 429, {"error": "rate_limited"}
        if len(raw) > MAX_BODY:
            return 413, {"error": "body_too_large"}
        try:
            fields = validate(json.loads(raw))
        except (ValueError, UnicodeError, RecursionError):
            return 400, {"error": "invalid_fields"}
        if not self.slots.acquire(blocking=False):
            return 503, {"error": "busy"}
        try:
            self.sender(self.settings, fields)
        except Exception:
            # SMTP exceptions may contain addresses or the message. Do not log them.
            LOG.warning("SMTP delivery failed")
            return 502, {"error": "delivery_failed"}
        finally:
            self.slots.release()
        return 200, {"delivered": True}


class Handler(BaseHTTPRequestHandler):
    service: ContactService
    server_version = "ChanlyContact"

    def setup(self):
        super().setup()
        self.connection.settimeout(5)

    def reply(self, status, body):
        encoded = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Connection", "close")
        if status == 429:
            self.send_header("Retry-After", "3600")
        self.end_headers()
        self.close_connection = True
        try:
            self.wfile.write(encoded)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        if self.path != ENDPOINT:
            self.reply(404, {"error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "-1"))
            if self.headers.get("Transfer-Encoding") or length < 0 or length > MAX_BODY:
                self.reply(413, {"error": "body_too_large"})
                return
            # Caddy overwrites this header. The service has no public port.
            client = str(ipaddress.ip_address(self.headers.get("X-Real-IP", self.client_address[0])))
            raw = self.rfile.read(length)
        except (ValueError, TimeoutError):
            self.reply(400, {"error": "invalid_request"})
            return
        status, body = self.service.submit(self.headers, raw, client)
        self.reply(status, body)

    def do_GET(self):
        if self.path == "/healthz":
            self.reply(200, {"ok": True})
        else:
            self.reply(404, {"error": "not_found"})

    def log_message(self, _format, *_args):
        # No request bodies, query strings or email addresses in access logs.
        pass


def main():
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    Handler.service = ContactService(Settings.from_env())
    server = ThreadingHTTPServer((os.environ.get("CONTACT_BIND", "127.0.0.1"), 8091), Handler)
    server.daemon_threads = True
    LOG.info("Contact endpoint ready")
    server.serve_forever()


if __name__ == "__main__":
    main()
