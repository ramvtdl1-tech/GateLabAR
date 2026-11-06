# GateLab AR native build report

Verified on 7 November 2026 (IST) in Lens Studio 5.23.2. The existing `SpecsBaseTemplate.esproj` build is saved and ready for parent packaging.

## Result

- Native TypeScript compilation: **PASS**.
- Genuine SIK Preview pinches and learning journey: **PASS**.
- Saved native project clean reopen: **PASS**.
- Final normal startup: **no logged errors**.
- Four LEAF scenarios: **PASS**, rerun after reopening the final layout.

Machine-readable evidence: [build-verification.json](build-verification.json). The older `verification.json` describes the earlier starter checkpoint and is superseded for native GateLab behavior.

## Changes to the existing build

- Fixed the composite node interaction hierarchy so native SIK pinches reach the buttons.
- Retained mode panes instead of destroying an active SIK target. Required a fresh press after mode changes and guarded duplicate release cycles; repeated journeys still toggle each input once.
- Increased the authored typography scale to 1.3. Raised the fixed anchor 8 cm to **(0, -10, -110) cm** after the actual SPECS Preview showed the lower labels outside its text camera field of view. Final perspective screenshots show Start, prediction choices, Next and Reset.
- Populated the existing LEAF registry with four focused native scenarios and shared helpers. Updated the scene contract to the final anchor.

Source and scene changes were saved through native Lens Studio tools. No scene YAML edits or raw HTTP were used.

## Verification

| Scenario | Final result | Coverage |
| --- | --- | --- |
| `gatelab-truth-table` | PASS, 18.671 s | All 12 AND/OR/XOR cases; numeric labels; signal bead visibility and animation; fixed anchor |
| `gatelab-challenge` | PASS, 11.901 s | Exact three questions; hidden output; locked exploration controls; one score per answer; feedback and Next; final 3/3 |
| `gatelab-recovery` | PASS, 26.418 s | Wrong answers produce 0/3; fresh Replay; Reset to Welcome; Explore restores AND/00; no stale feedback or duplicate input handler |
| `gatelab-ik-reach` | PASS, 10.012 s | Start operated through IK with `fail-fast` diagnostics; indirect targeting |

The JSON includes the Lens-side scenario-manager PASSED lines, native compiler result, source hashes and the manually pinched twelve-case table.

For clean reopen, the editor saved the project, switched to an empty project, then opened the saved `SpecsBaseTemplate.esproj`. Preview 3 compiled and ran. Fresh Start/InputA pinches produced AND(1,0)=0. All four scenarios then passed on that reopened final layout.

A separate camera translation of 12 cm left preserved the final root at (0, -10, -110) cm. The editor was returned to its starting camera pose and the Lens to Welcome.

## Screenshots inspected

- [Explore after a genuine input pinch](screenshots/20-final-explore.png)
- [Hidden answer and visible prediction controls](screenshots/21-final-challenge.png)
- [Feedback and visible Next control](screenshots/22-final-feedback.png)
- [Camera moved left; fixed world content](screenshots/23-final-world-anchor.png)
- [Final clean Welcome](screenshots/24-final-welcome.png)

The camera-offset screenshot intentionally shows the circuit shifted toward the viewport edge. The Welcome screenshot is the final resting view.

## Limits and remaining parent work

Logic and native Preview behavior are proven by the checks above. Feel on real glasses remains unproven: no hardware was available for real hand tracking, additive-display readability or comfort over time. IK used far-field targeting at 110 cm; direct-touch reach was not established.

The optional LEAF avatar logged `CC_CHARACTER_CONTROLLER_ANIMATION_IDLE` download failure (`Cannot fetch config data`). The IK interaction passed with fail-fast diagnostics; normal GateLab startup and the other final scenarios had no logged errors. This warning belongs to the optional test avatar.

The saved native project reopen passed. The design brief's **packaged clean-copy reopen** criterion remains untested here and is explicitly false in the JSON. Archive packaging, README/scripts, signing, publication and submission remain with the parent. No publication or new agreement was performed.

## Packaged source follow-up

The parent tested the frozen release ZIP in a separate extracted folder. Native compilation, genuine Start/InputA pinches, expected Explore AND/10→0 state and restoration of the original Welcome all passed. See [archive-verification.json](archive-verification.json) for the exact tested archive SHA-256. Nine logic and four packaging tests also passed from an extracted release. The ZIP is intentionally retained unchanged; post-package evidence is stored alongside it in this workspace.
