"""Durable evidence for the exact PDF accepted in the contact form."""
from contextlib import closing
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import uuid


class ConsentMismatch(ValueError):
    pass


class ConsentRegistry:
    def __init__(self, manifest=None, database=None):
        self.manifest = Path(manifest or os.environ.get("CONTACT_MANIFEST", "/legal/current/legal-manifest.json"))
        self.database = Path(database or os.environ.get("CONTACT_CONSENT_DB", "/data/consents.sqlite3"))

    def record(self, data, fields, client, origin):
        # Read through current on each request: release switches must not leave a stale version in memory.
        manifest = json.loads(self.manifest.read_text())
        document = next(d for d in manifest["documents"] if d["id"] == "consent-feedback")
        version, checksum = manifest["version"], document["sha256"]
        if not isinstance(version, str) or not re.fullmatch(r"[a-f0-9]{64}", checksum):
            raise ValueError("Invalid consent manifest")
        if data.get("consent_version") != version or data.get("consent_sha256") != checksum:
            raise ConsentMismatch()
        receipt = {"id": str(uuid.uuid4()), "accepted_at": datetime.now(timezone.utc).isoformat(),
                   "version": version, "sha256": checksum, "client_ip": client}
        payload_hash = hashlib.sha256(json.dumps(fields, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        # Parent is provisioned as uid 10001, mode 700. No plaintext message is duplicated here.
        fd = os.open(self.database, os.O_CREAT | os.O_RDWR, 0o600)
        os.close(fd)
        with closing(sqlite3.connect(self.database, timeout=5)) as db, db:
            db.execute("""CREATE TABLE IF NOT EXISTS consents (
                id TEXT PRIMARY KEY, accepted_at TEXT NOT NULL, email TEXT NOT NULL,
                client_ip TEXT NOT NULL, origin TEXT NOT NULL, version TEXT NOT NULL,
                sha256 TEXT NOT NULL, payload_sha256 TEXT NOT NULL, delivery TEXT NOT NULL)""")
            db.execute("INSERT INTO consents VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                       (receipt["id"], receipt["accepted_at"], fields["email"], client, origin,
                        version, checksum, payload_hash, "pending"))
        return receipt

    def mark(self, receipt, status):
        with closing(sqlite3.connect(self.database, timeout=5)) as db, db:
            db.execute("UPDATE consents SET delivery = ? WHERE id = ?", (status, receipt["id"]))
