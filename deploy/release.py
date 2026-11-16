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

PRODUCTION = os.environ.get("CHANLY_LANDING_ENV", "dev") == "production"
ROOT = Path("/opt/maxim-production/frontend/landing" if PRODUCTION else "/opt/maxim-dev/frontend/landing")
LOCK = Path("/opt/edge/.release.lock")
SITE = "https://chanly.ru" if PRODUCTION else "https://dev.chanly.ru"
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
            if not member.isfile() or not re.fullmatch(r"index\.html|legal-manifest\.json|(?:offer|offer-author|rules|privacy_policy|consent-feedback|requisites)\.pdf|landing-assets/[\w.-]+", name):
                raise ValueError("unexpected archive entry")
            total += member.size
            if total > 128 * 1024 * 1024:
                raise ValueError("archive exceeds release limit")
            dest = files / name
            dest.parent.mkdir(exist_ok=True)
            with dest.open("xb") as out, package.extractfile(member) as src:
                shutil.copyfileobj(src, out)
    validate_documents(files)
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


def validate_documents(files):
    manifest = files / "legal-manifest.json"
    if not manifest.exists():
        if list(files.glob("*.pdf")):
            raise ValueError("legal documents require a manifest")
        return
    data = json.loads(manifest.read_text())
    documents = data["documents"]
    expected = {"offer", "offer-author", "rules", "privacy_policy", "consent-feedback", "requisites"}
    if {d["id"] for d in documents} != expected or len(documents) != len(expected):
        raise ValueError("unexpected legal document set")
    for document in documents:
        name, checksum = document["id"], document["sha256"]
        if not re.fullmatch(r"[a-f0-9]{64}", checksum):
            raise ValueError("invalid document digest")
        expected_asset = f"/landing-assets/{name}-{checksum}.pdf"
        if document["asset"] != expected_asset or document["href"] != f"/{name}.pdf":
            raise ValueError("invalid document path")
        pdf = files / (name + ".pdf")
        if not pdf.read_bytes().startswith(b"%PDF-") or digest(pdf) != checksum:
            raise ValueError("document digest mismatch")
        if (files / expected_asset[1:]).read_bytes() != pdf.read_bytes():
            raise ValueError("versioned PDF differs")


def check_documents(root):
    manifest = root / "current/legal-manifest.json"
    if not manifest.exists():
        return
    for document in json.loads(manifest.read_text())["documents"]:
        expected = (root / "current" / (document["id"] + ".pdf")).read_bytes()
        for path in [document["href"], "/" + document["id"], document["asset"]]:
            if request(path) != expected:
                raise ValueError("served PDF mismatch")


def request(path, session=False):
    args = ["curl", "--disable", "--fail", "--silent", "--show-error", "--max-time", "20"]
    if not PRODUCTION:
        args += ["--config", BASIC]
    if session and not PRODUCTION:
        args += ["--config", SESSION]
    return subprocess.check_output([*args, SITE + path])


def smoke(root, target):
    if PRODUCTION:
        if target is None:
            # Recovery of an interrupted first release has no active site to verify.
            return
        expected = (root / "current/index.html").read_bytes()
        if request("/") != expected:
            raise ValueError("production root HTML mismatch")
        check_assets(root, expected)
        return
    app = (root.parent / "current/index.html").read_bytes()
    expected = (root / "current/index.html").read_bytes() if target else app
    if not json.loads(request("/api/v1/me", session=True)).get("user"):
        raise ValueError("smoke account has no valid session")
    if request("/") != expected or request("/", session=True) != app:
        raise ValueError("root HTML mismatch")
    if target:
        check_assets(root, expected)


def check_assets(root, expected):
    check_documents(root)
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
    if PRODUCTION and operation == "rollback" and not state["previous"]:
        raise ValueError("production rollback requires a previous landing release")
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
            if not PRODUCTION and not json.loads(request("/api/v1/me", session=True)).get("user"):
                raise ValueError("refresh the smoke session before switching")
            target = prepare(ROOT, staging, archive, sha, checksum) if operation == "release" else None
            release(ROOT, operation, int(run), target)


if __name__ == "__main__":
    main()
