"""Regression checks for keeping private local state out of the source archive."""

from pathlib import Path
import tempfile
import unittest
import zipfile

from checkpoint import collect, inspect


class CheckpointTests(unittest.TestCase):
    def test_allowlist_excludes_local_state_even_inside_source_folders(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ["README.md", "Assets/Scene.scene", "Assets/.env",
                         "Assets/local.key", "Assets/.codex/config.toml",
                         "Cache/generated.ts", ".mcp.json", "spk_debug_key.pem",
                         "devpost/demo-script.md", "private-notes.txt"]:
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("sample")
            self.assertEqual(
                {str(path.relative_to(root)) for path in collect(root)},
                {"README.md", "Assets/Scene.scene", "devpost/demo-script.md"},
            )

    def test_symlink_to_external_source_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "Assets").mkdir()
            (root / "external.txt").write_text("private content")
            (root / "Assets/linked.txt").symlink_to(root / "external.txt")
            with self.assertRaisesRegex(ValueError, "symlink"):
                collect(root)

    def test_unresolved_lfs_and_private_key_are_reported_without_content(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "Assets").mkdir()
            pointer = root / "Assets/unresolved.bin"
            pointer.write_bytes(b"version https://git-lfs.github.com/spec/v1\n")
            secret = root / "Assets/accidental.txt"
            secret.write_bytes(b"-----BEGIN " + b"PRIVATE KEY-----\nexample\n")
            errors = inspect(root, [pointer, secret])
            self.assertIn("Unresolved Git LFS pointer: Assets/unresolved.bin", errors)
            self.assertIn("Potential credential content requires review: Assets/accidental.txt", errors)
            self.assertNotIn("example", "\n".join(errors))

    def test_compressed_package_members_are_checked_before_distribution(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package = root / "sample.lspkg"
            cases = [
                ("private/.env", b"example", "Private/local file inside package"),
                ("safe.txt", b"-----BEGIN " + b"PRIVATE KEY-----", "Potential credential inside package"),
                ("..\\outside.txt", b"example", "Unsafe package member"),
            ]
            for member, content, expected in cases:
                with self.subTest(member=member):
                    with zipfile.ZipFile(package, "w", zipfile.ZIP_DEFLATED) as archive:
                        archive.writestr(member, content)
                    self.assertIn(expected + ": sample.lspkg", inspect(root, [package]))


if __name__ == "__main__":
    unittest.main()
