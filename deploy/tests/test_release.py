"""Run on Linux: python3 -m unittest discover -s deploy/tests."""
from concurrent.futures import ProcessPoolExecutor
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import release

ASSETS = {"index.js": b"JS", "index.css": b"CSS", "logo.svg": b"SVG"}


def package(directory, version):
    archive = directory / "input.tar.gz"
    html = version + "".join(f'<link href="/landing-assets/{name}">' for name in ASSETS)
    with tarfile.open(archive, "w:gz") as out:
        for name, data in {"index.html": html.encode(), **{
                "landing-assets/" + n: v for n, v in ASSETS.items()}}.items():
            info = tarfile.TarInfo(name)
            info.size = len(data)
            out.addfile(info, io.BytesIO(data))
    return archive


def locked_switch(root, run, target):
    with (root / ".lock").open("a") as lock:
        release.fcntl.flock(lock, release.fcntl.LOCK_EX)
        try:
            release.release(root, "release", run, target, verify)
        except ValueError as error:
            if str(error) != "stale run":
                raise


def verify(root, target):
    expected = Path("releases") / target if target else None
    actual = (root / "current").readlink() if (root / "current").is_symlink() else None
    if actual != expected:
        raise AssertionError((actual, expected))


class Deployment(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.targets = []
        for label in ("first", "second"):
            directory = self.root / label
            directory.mkdir()
            archive = package(directory, label)
            checksum = release.digest(archive)
            with self.assertRaisesRegex(ValueError, "digest"):
                release.prepare(self.root, directory, archive, "a" * 40, "0" * 64)
            self.targets.append(release.prepare(self.root, directory, archive, "a"*40, checksum))

    def test_retry_failure_and_rollback(self):
        first, second = self.targets
        release.release(self.root, "release", 1, first, verify)
        release.release(self.root, "release", 1, first, verify)

        def unhealthy(root, target):
            verify(root, target)
            if target == second:
                raise RuntimeError("unhealthy")

        with self.assertRaisesRegex(RuntimeError, "unhealthy"):
            release.release(self.root, "release", 2, second, unhealthy)
        verify(self.root, first)
        release.release(self.root, "release", 2, second, verify)
        release.release(self.root, "rollback", 3, None, verify)
        verify(self.root, first)
        release.release(self.root, "rollback", 4, None, verify)
        verify(self.root, second)
        with self.assertRaisesRegex(ValueError, "stale"):
            release.release(self.root, "release", 2, first, verify)

    def test_first_rollback_and_interrupted_switch(self):
        first, second = self.targets
        release.release(self.root, "release", 1, first, verify)
        release.release(self.root, "rollback", 2, None, verify)
        verify(self.root, None)
        state = json.loads((self.root / "state.json").read_text())
        release.save(self.root, dict(state, switching=True, done=False))
        release.switch(self.root, second)
        release.release(self.root, "release", 3, first, verify)
        verify(self.root, first)

    def test_concurrency(self):
        first, second = self.targets
        with ProcessPoolExecutor(2) as pool:
            futures = [pool.submit(locked_switch, self.root, n, t)
                       for n, t in [(1, first), (2, second)]]
            for future in futures:
                future.result()
        verify(self.root, second)

    def test_forced_command_rejects_shell(self):
        result = subprocess.run([sys.executable, release.__file__],
                                env=dict(os.environ, SSH_ORIGINAL_COMMAND="sh"),
                                capture_output=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(b"invalid release command", result.stderr)


class ProductionSmoke(unittest.TestCase):
    def test_public_landing_without_application_or_session(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            directory = root / "releases" / "version"
            directory.mkdir(parents=True)
            html = b'<script src="/landing-assets/index.js"></script>'
            (directory / "index.html").write_bytes(html)
            (directory / "landing-assets").mkdir()
            (directory / "landing-assets/index.js").write_bytes(b"JS")
            release.switch(root, "version")
            def request(path):
                return {"/": html, "/landing-assets/index.js": b"JS"}[path]
            with patch.object(release, "PRODUCTION", True), patch.object(release, "request", side_effect=request):
                release.smoke(root, "version")
            with patch.object(release, "PRODUCTION", True), patch.object(release, "request", return_value=b"wrong"):
                with self.assertRaisesRegex(ValueError, "HTML mismatch"):
                    release.smoke(root, "version")

    def test_first_production_release_cannot_rollback_to_empty_site(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            release.release(root, "release", 1, "first", verify)
            with patch.object(release, "PRODUCTION", True):
                with self.assertRaisesRegex(ValueError, "previous landing"):
                    release.release(root, "rollback", 2, None, verify)
            verify(root, "first")
            self.assertEqual(json.loads((root / "state.json").read_text())["run"], 1)

    def test_recovery_before_first_production_activation_needs_no_site(self):
        with patch.object(release, "PRODUCTION", True), patch.object(release, "request") as request:
            release.smoke(Path("/unused"), None)
            request.assert_not_called()
