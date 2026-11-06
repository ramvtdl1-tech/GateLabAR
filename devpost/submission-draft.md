# GateLab AR — Devpost description draft

Status: native Lens verified in Preview; public repository, YouTube video and final submission links are pending. This description reflects implemented behavior.

## Inspiration

GateLab AR is designed for introductory computing students who can read a truth table but want to see how changing an input affects a circuit. The learning goal is to connect inputs, gate rules and outputs through a spatial experiment, then check a prediction.

## What it does

A compact world-anchored circuit puts A/B inputs on the left, the logic gate in the middle and output Y on the right. Pinching an input changes its bit and animated signal paths. Pinching the gate cycles AND, OR and XOR. Numeric labels accompany color.

Prediction check asks three questions with the output hidden. One answer is accepted per question, an explanation reveals the result, and Next advances. Results show the score, with Replay, Explore and Reset. Mode changes display only the relevant actions.

## Why glasses

The circuit occupies a fixed location in the room. The student can change viewpoint and relate the separated inputs, connections, gate and output while acting directly on their controls. Controls belong beside the circuit, with no head-locked dashboard. This is a design rationale, not a claim of measured learning outcomes.

## How it was built

The official Devpost Learn plan-lens skill, design references and template informed the brief. The entrant explicitly delegated design choices to the coding agent; no learner interview or user research is claimed. CLAD and native Lens Studio MCP built the project in Lens Studio 5.23.2, using SIK/UI Kit, modular TypeScript, procedural signal geometry and locally generated SFX. Snap's pre-existing Base Template and bundled package notices are retained.

## Challenges and improvements

Real Preview testing caught composite colliders obstructing buttons, duplicate SIK events, and a release activating a newly shown control. Retained panes and interaction guards corrected those failures. Perspective review also exposed obscured labels; typography and depth were corrected and the anchor raised 8 cm. The final layout was reopened and retested.

## Validation

All twelve truth-table cases passed through actual simulated SIK pinches. Four native LEAF scenarios passed after the final layout reopened, covering truth tables/signals, challenge/scoring, recovery and IK targeting. Nine Node tests exercise the actual pure Lens state source. Four packaging guard tests pass. See build-report.md and build-verification.json for evidence and limits.

## Limits and next steps

Real-device hand tracking, comfort over time and additive-display readability remain untested without glasses. An optional LEAF avatar animation download timed out while the IK scenario passed; normal startup had no errors. A future extension could allow learners to connect multiple gates, after the current compact experience is tested on hardware.

## Final links

- Public source repository: pending.
- Public YouTube demo under three minutes: pending.
- Submission commit and Devpost receipt: pending.

Reconcile final URLs and footage with the release before submitting. Do not present the local release as a published Lens or a completed hackathon entry.
