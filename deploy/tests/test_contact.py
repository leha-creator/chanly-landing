import http.client
import json
import smtplib
import threading
import unittest
from http.server import ThreadingHTTPServer
from unittest.mock import Mock, patch

from deploy.contact.server import (
    ContactService, Handler, MAX_BODY, RateLimiter, RECIPIENT, Settings, send_email,
)

SETTINGS = Settings("smtp.example.org", 465, "info@chanly.ru", "test-password",
                    "info@chanly.ru", frozenset({"https://chanly.ru"}))
HEADERS = {"Origin": "https://chanly.ru", "Content-Type": "application/json"}
FIELDS = {"name": " Анна ", "email": "anna@example.org",
          "question": " Как подключить канал? ", "consent": True}


class ContactServiceTests(unittest.TestCase):
    def submit(self, data, headers=None):
        return self.service.submit(headers or HEADERS, json.dumps(data).encode(), "127.0.0.1")

    def setUp(self):
        self.sender = Mock()
        self.service = ContactService(SETTINGS, sender=self.sender)

    def test_success_after_smtp_accepts_and_trims_fields(self):
        self.assertEqual(self.submit(FIELDS), (200, {"delivered": True}))
        self.sender.assert_called_once_with(SETTINGS, {
            "name": "Анна", "email": "anna@example.org", "question": "Как подключить канал?"})

    def test_smtp_failure_never_reports_delivery(self):
        self.sender.side_effect = smtplib.SMTPException("private SMTP details")
        status, body = self.submit(FIELDS)
        self.assertEqual(status, 502)
        self.assertNotIn("delivered", body)
        self.assertNotIn("private", json.dumps(body))

    def test_rejects_missing_consent_header_injection_and_oversized_fields(self):
        for changes in ({"consent": False}, {"consent": "true"}, {"email": "a@b.ru\r\nBcc:x@y.ru"},
                        {"name": "x" * 101}, {"question": "x" * 5001}, {"email": 123}):
            with self.subTest(changes=changes):
                self.service = ContactService(SETTINGS, sender=self.sender)
                self.assertEqual(self.submit(FIELDS | changes)[0], 400)
        self.sender.assert_not_called()

    def test_rejects_cross_origin_and_non_json_without_sending(self):
        self.assertEqual(self.submit(FIELDS, HEADERS | {"Origin": "https://other.example"})[0], 403)
        self.assertEqual(self.submit(FIELDS, {"Content-Type": "application/json"})[0], 403)
        self.assertEqual(self.submit(FIELDS, HEADERS | {"Content-Type": "text/plain"})[0], 415)
        self.sender.assert_not_called()

    def test_limits_attempts_and_recovers_after_window(self):
        now = [1000]
        self.service.limiter = RateLimiter(clock=lambda: now[0])
        for _ in range(5):
            self.assertEqual(self.submit(FIELDS)[0], 200)
        self.assertEqual(self.submit(FIELDS)[0], 429)
        now[0] += 3601
        self.assertEqual(self.submit(FIELDS)[0], 200)

    def test_global_limit_bounds_smtp_load(self):
        raw = json.dumps(FIELDS).encode()
        for index in range(100):
            self.assertEqual(self.service.submit(HEADERS, raw, str(index))[0], 200)
        self.assertEqual(self.service.submit(HEADERS, raw, "new-client")[0], 429)

    def test_malformed_and_oversized_body(self):
        self.assertEqual(self.service.submit(HEADERS, b"{", "ip")[0], 400)
        self.assertEqual(self.service.submit(HEADERS, b"x" * (MAX_BODY + 1), "ip")[0], 413)
        self.sender.assert_not_called()

    def test_recipient_is_fixed_and_email_is_reply_to(self):
        with patch("deploy.contact.server.smtplib.SMTP_SSL") as smtp:
            connection = smtp.return_value.__enter__.return_value
            connection.send_message.return_value = {}
            send_email(SETTINGS, {key: value.strip() for key, value in FIELDS.items() if key != "consent"})
            message = connection.send_message.call_args.args[0]
            self.assertEqual(str(message["To"]), RECIPIENT)
            self.assertEqual(str(message["Reply-To"]), FIELDS["email"])
            self.assertEqual(connection.send_message.call_args.kwargs["to_addrs"], [RECIPIENT])
            connection.send_message.return_value = {RECIPIENT: (550, b"refused")}
            with self.assertRaises(smtplib.SMTPRecipientsRefused):
                send_email(SETTINGS, {"name": "Анна", "email": FIELDS["email"], "question": "Вопрос"})


class ContactHTTPTests(unittest.TestCase):
    def setUp(self):
        self.sender = Mock()
        handler = type("TestHandler", (Handler,), {"service": ContactService(SETTINGS, sender=self.sender)})
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        self.worker = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.worker.start()
        self.client = http.client.HTTPConnection(*self.server.server_address, timeout=5)

    def tearDown(self):
        self.client.close()
        self.server.shutdown()
        self.server.server_close()
        self.worker.join()

    def test_real_http_success_and_no_cache(self):
        self.client.request("POST", "/api/landing/contact", json.dumps(FIELDS), HEADERS | {"X-Real-IP": "192.0.2.1"})
        response = self.client.getresponse()
        self.assertEqual(response.status, 200)
        self.assertEqual(response.getheader("Cache-Control"), "no-store")
        self.assertEqual(json.loads(response.read()), {"delivered": True})
        self.sender.assert_called_once()

    def test_missing_origin_does_not_send(self):
        self.client.request("POST", "/api/landing/contact", json.dumps(FIELDS), {"Content-Type": "application/json"})
        response = self.client.getresponse()
        self.assertEqual(response.status, 403)
        response.read()
        self.sender.assert_not_called()

    def test_large_request_is_rejected_before_reading(self):
        self.client.request("POST", "/api/landing/contact", b"", HEADERS | {"Content-Length": str(MAX_BODY + 1)})
        response = self.client.getresponse()
        self.assertEqual(response.status, 413)
        response.read()
        self.sender.assert_not_called()
