#!/usr/bin/env python3
"""Forced SSH command for the Chanly landing GitHub environment."""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile

ROOT = Path("/opt/maxim-dev/frontend/landing")
LOCK = Path("/opt/edge/.release.lock")
SITE = "https://dev.chanly.ru"
BASIC = "/opt/maxim-dev/basic-auth.curl"
SESSION = "/opt/maxim-dev/landing-session.curl"


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def save(root, state):
    tmp = root / ".state.next"
    tmp.write_text(json.dumps(state))
    tmp.replace(root / "state.json")


def switch(root, target):
    current = root / "current"
    if target is None:
        current.unlink(missing_ok=True)
        return
    tmp = root / ".current.next"
    tmp.unlink(missing_ok=True)
    tmp.symlink_to(Path("releases") / target)
    tmp.replace(current)


def prepare(root, staging, archive, sha, checksum):
    if digest(archive) != checksum:
        raise ValueError("archive digest mismatch")
    files = staging / "files"
    files.mkdir()
    with tarfile.open(archive, "r:gz") as package:
        total = 0
        for member in package:
            name = member.name.removeprefix("./")
            if member.isdir() and name in (".", "", "landing-assets"):
                continue
            if not member.isfile() or not re.fullmatch(r"index\.html|landing-assets/[\w.-]+", name):
                raise ValueError("unexpected archive entry")
            total += member.size
            if total > 128 * 1024 * 1024:
                raise ValueError("archive exceeds release limit")
            dest = files / name
            dest.parent.mkdir(exist_ok=True)
            with dest.open("xb") as out, package.extractfile(member) as src:
                shutil.copyfileobj(src, out)
    html = (files / "index.html").read_text()
    assets = list((files / "landing-assets").iterdir())
    refs = re.findall(r'(?:src|href)="(/landing-assets/[^"]+)"', html)
    if not {".js", ".css", ".svg"} <= {Path(ref).suffix for ref in refs}:
        raise ValueError("missing entry assets")
    for ref in refs:
        if not (files / ref[1:]).stat().st_size:
            raise ValueError("empty entry asset")
    shared = root / "shared/landing-assets"
    shared.mkdir(parents=True, exist_ok=True)
    for asset in assets:
        dest = shared / asset.name
        if dest.exists():
            if digest(dest) != digest(asset):
                raise ValueError("immutable asset collision")
        else:
            os.link(asset, dest)
    target = sha + "-" + checksum
    release = root / "releases" / target
    release.parent.mkdir(exist_ok=True)
    if release.exists():
        if digest(release / "index.html") != digest(files / "index.html"):
            raise ValueError("existing release differs")
    else:
        files.rename(release)
    return target


def request(path, session=False):
    args = ["curl", "--disable", "--config", BASIC, "--fail", "--silent",
            "--show-error", "--max-time", "20"]
    if session:
        args += ["--config", SESSION]
    return subprocess.check_output([*args, SITE + path])


def smoke(root, target):
    app = (root.parent / "current/index.html").read_bytes()
    expected = (root / "current/index.html").read_bytes() if target else app
    if not json.loads(request("/api/v1/me", session=True)).get("user"):
        raise ValueError("smoke account has no valid session")
    if request("/") != expected or request("/", session=True) != app:
        raise ValueError("root HTML mismatch")
    if target:
        for ref in re.findall(rb'(?:src|href)="(/landing-assets/[^"]+)"', expected):
            path = ref.decode()
            if request(path) != (root / "current" / path[1:]).read_bytes():
                raise ValueError("served asset mismatch")


def release(root, operation, run, target, check=smoke):
    statefile = root / "state.json"
    state = json.loads(statefile.read_text()) if statefile.exists() else {
        "run": 0, "current": None, "previous": None
    }
    if state.pop("switching", False):
        switch(root, state["current"])
        check(root, state["current"])
        save(root, state)
    if run < state["run"]:
        raise ValueError("stale run")
    if run == state["run"] and state.get("done"):
        check(root, state["current"])
        return
    before = state["current"]
    if operation == "rollback":
        if not before and not state["previous"]:
            raise ValueError("no release to roll back")
        target = state["previous"]
    state.update(run=run, done=False, switching=True)
    save(root, state)
    print(f"run={run} operation={operation} target={target} previous={before}", flush=True)
    try:
        switch(root, target)
        check(root, target)
    except Exception:
        switch(root, before)
        check(root, before)
        state["switching"] = False
        save(root, state)
        print(f"restored={before}", file=sys.stderr)
        raise
    if target != before:
        state.update(previous=before, current=target)
    state.update(done=True, switching=False)
    save(root, state)


def main():
    match = re.fullmatch(r"(release|rollback) ([1-9][0-9]*) ([a-f0-9]{40}) ([a-f0-9]{64})",
                         os.environ.get("SSH_ORIGINAL_COMMAND", ""))
    if not match:
        raise ValueError("invalid release command")
    operation, run, sha, checksum = match.groups()
    ROOT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=ROOT) as directory:
        staging = Path(directory)
        archive = staging / "package"
        if operation == "release":
            with archive.open("xb") as out:
                while chunk := sys.stdin.buffer.read(1024 * 1024):
                    out.write(chunk)
                    if out.tell() > 64 * 1024 * 1024:
                        raise ValueError("upload exceeds release limit")
        with LOCK.open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            if not json.loads(request("/api/v1/me", session=True)).get("user"):
                raise ValueError("refresh the smoke session before switching")
            target = prepare(ROOT, staging, archive, sha, checksum) if operation == "release" else None
            release(ROOT, operation, int(run), target)


if __name__ == "__main__":
    main()
