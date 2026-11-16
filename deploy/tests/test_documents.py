"""Verify the package boundary and served legal artifacts, including rollback checks."""
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

from deploy import release

PUBLIC = Path(__file__).resolve().parents[2] / "public"
MANIFEST = json.loads((PUBLIC / "legal-manifest.json").read_text())


class LegalReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.entries = {"index.html": b'<script src="/landing-assets/i.js"></script><link href="/landing-assets/i.css"><img src="/landing-assets/i.svg">',
                        "landing-assets/i.js": b"js", "landing-assets/i.css": b"css", "landing-assets/i.svg": b"svg",
                        "legal-manifest.json": json.dumps(MANIFEST).encode()}
        for doc in MANIFEST["documents"]:
            self.entries[doc["href"][1:]] = (PUBLIC / doc["href"][1:]).read_bytes()
            self.entries[doc["asset"][1:]] = self.entries[doc["href"][1:]]

    def prepare(self):
        archive = self.root / "archive.tgz"
        with tarfile.open(archive, "w:gz") as package:
            for name, data in self.entries.items():
                info = tarfile.TarInfo(name)
                info.size = len(data)
                package.addfile(info, io.BytesIO(data))
        staging = self.root / "staging"
        staging.mkdir()
        return release.prepare(self.root, staging, archive, "a" * 40, release.digest(archive))

    def test_accepts_pdf_package_and_checks_all_public_urls(self):
        target = self.prepare()
        release.switch(self.root, target)
        def request(path):
            if path in ("/offer", "/offer-author", "/rules", "/privacy_policy", "/consent-feedback", "/requisites"):
                path += ".pdf"
            return self.entries[path[1:]]
        with patch.object(release, "request", side_effect=request) as get:
            release.check_documents(self.root)
            self.assertEqual(get.call_count, 18)
        with patch.object(release, "request", return_value=b"wrong"):
            with self.assertRaisesRegex(ValueError, "served PDF"):
                release.check_documents(self.root)

    def test_corrupted_pdf_cannot_activate(self):
        self.entries["offer.pdf"] += b"tampered"
        with self.assertRaisesRegex(ValueError, "digest mismatch"):
            self.prepare()
        self.assertFalse((self.root / "current").exists())

    def test_unexpected_document_cannot_enter_archive(self):
        self.entries["private.docx"] = b"private"
        with self.assertRaisesRegex(ValueError, "unexpected archive"):
            self.prepare()

    def test_pdf_cannot_ship_without_manifest(self):
        del self.entries["legal-manifest.json"]
        with self.assertRaisesRegex(ValueError, "require a manifest"):
            self.prepare()

    def test_manifest_cannot_reference_arbitrary_file(self):
        manifest = json.loads(self.entries["legal-manifest.json"])
        manifest["documents"][0]["asset"] = "/../../private.pdf"
        self.entries["legal-manifest.json"] = json.dumps(manifest).encode()
        with self.assertRaisesRegex(ValueError, "invalid document path"):
            self.prepare()
