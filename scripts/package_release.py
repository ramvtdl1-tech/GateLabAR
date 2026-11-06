#!/usr/bin/env python3
"""Package a verified Lens source release, using checkpoint privacy/integrity guards."""

import hashlib
import json
from pathlib import Path
import tempfile
import zipfile

from checkpoint import ROOT, collect, inspect


def main():
    evidence_path = ROOT / "devpost/build-verification.json"
    if not evidence_path.is_file():
        raise ValueError("Native build verification is missing; use checkpoint.py for incomplete work.")
    evidence = json.loads(evidence_path.read_text())
    for field in ("native_compilation_passed", "preview_journey_passed", "clean_reopen_passed"):
        if evidence.get(field) is not True:
            raise ValueError("Native verification gate has not passed: " + field)
    brief = ROOT / "devpost/design-brief.md"
    if not brief.is_file() or "status: approved" not in brief.read_text().split("---", 2)[1]:
        raise ValueError("Approved design brief is missing")
    if not any((ROOT / "Assets").rglob("*.ts")):
        raise ValueError("Native TypeScript implementation is missing")
    files = collect(ROOT)
    errors = inspect(ROOT, files)
    if errors:
        raise ValueError("Source integrity check failed: " + "; ".join(errors))
    manifest = {
        "kind": "verified-lens-source-release",
        "lens_ready": True,
        "hackathon_submitted": False,
        "scope": "Native Lens source release. Public repository, public YouTube video and Devpost submission are separate deliverables.",
        "verification": "devpost/build-verification.json",
        "files": [
            {"path": p.relative_to(ROOT).as_posix(), "bytes": p.stat().st_size,
             "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
            for p in files
        ],
    }
    destination = ROOT / "dist/gatelab-ar-source-release.zip"
    destination.parent.mkdir(exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=destination.parent, suffix=".zip") as temporary:
        with zipfile.ZipFile(temporary.name, "w", zipfile.ZIP_DEFLATED) as archive:
            for path in files:
                archive.write(path, "GateLabAR/" + path.relative_to(ROOT).as_posix())
            archive.writestr("GateLabAR/RELEASE_MANIFEST.json", json.dumps(manifest, indent=2) + "\n")
        with zipfile.ZipFile(temporary.name) as archive:
            if archive.testzip():
                raise ValueError("Release archive failed CRC validation")
            for entry in manifest["files"]:
                content = archive.read("GateLabAR/" + entry["path"])
                if hashlib.sha256(content).hexdigest() != entry["sha256"]:
                    raise ValueError("Release hash mismatch: " + entry["path"])
        destination.write_bytes(Path(temporary.name).read_bytes())
    print(json.dumps({"archive": str(destination), "source_files": len(files),
                      "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
                      "lens_ready": True, "hackathon_submitted": False}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, IndexError, OSError, zipfile.BadZipFile) as error:
        print(json.dumps({"lens_ready": False, "error": str(error)}, indent=2))
        raise SystemExit(1)
