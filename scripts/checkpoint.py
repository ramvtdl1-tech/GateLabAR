#!/usr/bin/env python3
"""Check and package an allowlisted source checkpoint; never certifies a release."""

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parents[1]
ROOT_FILES = {
    ".gitignore", ".gitattributes", "AGENTS.md", "README.md",
    "TEMPLATE_SOURCE.md", "UPSTREAM_LICENSE.md",
}
SOURCE_DIRS = {"Assets", "Packages", "devpost", "logic", "tests", "scripts"}
FORBIDDEN_DIRS = {
    ".git", ".agents", ".codex", ".claude", ".cursor", ".vscode",
    "__pycache__", "node_modules", "Cache", "Support", "BackUp", "Workspaces",
    "PluginsUserPreferences", "dist",
}
FORBIDDEN_NAMES = {".mcp.json", "mcp.json", ".DS_Store", "spk_debug_key.pem"}
PRIVATE_KEY = re.compile(rb"-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----")
BEARER = re.compile(rb"[Bb]earer[ \t]+[A-Za-z0-9._~+/-]{24,}=*")


def forbidden(path):
    return (
        bool(set(path.parts) & FORBIDDEN_DIRS)
        or path.name in FORBIDDEN_NAMES
        or path.name == ".env" or path.name.startswith(".env.")
        or path.suffix.lower() in {".pem", ".key", ".lock", ".log", ".pyc"}
    )


def collect(root):
    """Return source paths, refusing symlinks instead of following private paths."""
    files = []
    for child in sorted(root.iterdir()):
        if child.name in SOURCE_DIRS:
            if child.is_symlink():
                raise ValueError("Source directory must not be a symlink: " + child.name)
            candidates = sorted(child.rglob("*")) if child.is_dir() else []
        elif child.name in ROOT_FILES or child.suffix == ".esproj":
            candidates = [child]
        else:
            continue
        for path in candidates:
            relative = path.relative_to(root)
            if forbidden(relative):
                continue
            if path.is_symlink():
                raise ValueError("Source symlink needs review: " + str(relative))
            if path.is_file():
                files.append(path)
    return files


def inspect(root, files):
    errors = []
    manifests = [p for p in files if p.parent == root and p.suffix == ".esproj"]
    if len(manifests) != 1:
        errors.append("Expected exactly one root .esproj file")
    elif not re.search(r"(?m)^targetPlatform:\s*Spectacles\s*$", manifests[0].read_text()):
        errors.append("Project must target Spectacles (SPECS)")
    for required in ("Assets/Scene.scene", "Assets/Scene.scene.meta",
                     "Packages/SpectaclesInteractionKit.lspkg",
                     "Packages/SpectaclesUIKit.lspkg", "UPSTREAM_LICENSE.md"):
        if not (root / required).is_file():
            errors.append("Missing required starter source: " + required)
    for path in files:
        relative = str(path.relative_to(root))
        data = path.read_bytes()
        if data.startswith(b"version https://git-lfs.github.com/spec/v1"):
            errors.append("Unresolved Git LFS pointer: " + relative)
        if PRIVATE_KEY.search(data) or BEARER.search(data):
            errors.append("Potential credential content requires review: " + relative)
        if path.suffix == ".lspkg":
            try:
                with zipfile.ZipFile(path) as archive:
                    bad = archive.testzip()
                    if bad:
                        errors.append("Corrupt package: " + relative)
                    for member in archive.namelist():
                        name = PurePosixPath(member.replace("\\", "/"))
                        if name.is_absolute() or ".." in name.parts:
                            errors.append("Unsafe package member: " + relative)
                            break
                        if forbidden(name):
                            errors.append("Private/local file inside package: " + relative)
                            break
                        member_data = archive.read(member)
                        if PRIVATE_KEY.search(member_data) or BEARER.search(member_data):
                            errors.append("Potential credential inside package: " + relative)
                            break
            except zipfile.BadZipFile:
                errors.append("Invalid package archive: " + relative)
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Write dist/gatelab-source-checkpoint.zip")
    args = parser.parse_args()
    try:
        files = collect(ROOT)
        errors = inspect(ROOT, files)
    except (ValueError, OSError) as error:
        print(json.dumps({"source_integrity": "FAIL", "errors": [str(error)]}, indent=2))
        return 1
    if errors:
        print(json.dumps({"source_integrity": "FAIL", "errors": errors}, indent=2))
        return 1
    manifest = {
        "kind": "source-checkpoint",
        "deployment_ready": False,
        "scope": "File integrity only; not Lens behavior, required workflow, or submission validation.",
        "files": [
            {"path": p.relative_to(ROOT).as_posix(), "bytes": p.stat().st_size,
             "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
            for p in files
        ],
    }
    if args.write:
        destination = ROOT / "dist" / "gatelab-source-checkpoint.zip"
        destination.parent.mkdir(exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=destination.parent, suffix=".zip") as temp:
            with zipfile.ZipFile(temp.name, "w", zipfile.ZIP_DEFLATED) as archive:
                for path in files:
                    archive.write(path, "GateLabAR/" + path.relative_to(ROOT).as_posix())
                archive.writestr("GateLabAR/CHECKPOINT_MANIFEST.json", json.dumps(manifest, indent=2) + "\n")
            with zipfile.ZipFile(temp.name) as archive:
                if archive.testzip():
                    raise ValueError("Checkpoint zip failed CRC validation")
            destination.write_bytes(Path(temp.name).read_bytes())
        print(json.dumps({"source_integrity": "PASS", "file_count": len(files),
                          "deployment_ready": False, "archive": str(destination),
                          "sha256": hashlib.sha256(destination.read_bytes()).hexdigest()}, indent=2))
    else:
        print(json.dumps({"source_integrity": "PASS", "file_count": len(files),
                          "deployment_ready": False,
                          "next": "Use --write for an explicitly incomplete source checkpoint."}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
