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
