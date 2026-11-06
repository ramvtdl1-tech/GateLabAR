# GateLab AR — proposed product

Status: implementation plan, not a completed `plan-lens` run or verified Lens.

The user delegated project choices on November 6, 2026. All design decisions below are agent-selected defaults. They are not quoted interview answers. The official planning skill remains gated on a real Lens Studio project and native MCP connection.

## Purpose

Help an introductory computing student understand how two binary inputs produce an output. A compact circuit sits in the student's room at real scale. Pinching an input changes its value, illuminates its signal path, and updates the output. A short prediction challenge checks understanding.

## Spatial design

- The circuit is the virtual product; no recognition of real objects is required.
- Anchor the circuit in world space at startup, about 110 cm in front of the initial camera and 18 cm below eye level. Do not attach it to the user's head.
- Keep the main assembly within about 45 cm wide by 28 cm high. Inputs A and B are left, the gate is in the middle, output Y is right. Signals have visible depth and connect the physical positions of those objects.
- Use light cyan for active signals and subdued lavender outlines for inactive signals. Always also show `0` or `1`; color alone must not carry the state.
- Use original primitive geometry, emissive accents, and readable light text. Avoid relying on a black background on an additive display.
- Use a small number of generously sized SIK/UI Kit targets with clear hover and press states. Leave the student's surrounding view open.

## Complete interaction flow

1. Welcome: title, one-sentence purpose, pinch instructions, and a Start target.
2. Explore: default AND gate, A=0, B=0. Pinch either input to toggle it. Output and signal paths update together. Gate selector cycles AND → OR → XOR with an explicit text label and short rule.
3. Challenge: a dedicated control starts three deterministic questions. Input controls and gate selection are locked while a question is active; prediction targets `Y=0` and `Y=1` replace them.
4. Feedback: one prediction is accepted per question. Reveal the output, show Correct/Try the rule and the explanation, then enable Next. Do not silently advance or allow duplicate scoring.
5. Finish: show score out of three, replay challenge, and return to Explore. Reset clears session progress and restores the initial inputs and gate.

No voice commands, cloud AI, accounts, cameras, external data, persistent anchors, multiplayer, or custom hand poses are needed. The app works offline after packages are available.

## Logic contract

| Gate | A=0 B=0 | A=0 B=1 | A=1 B=0 | A=1 B=1 |
| --- | --- | --- | --- | --- |
| AND | 0 | 0 | 0 | 1 |
| OR | 0 | 1 | 1 | 1 |
| XOR | 0 | 1 | 1 | 0 |

Challenge fixtures: AND(1,0) → 0; OR(0,1) → 1; XOR(1,1) → 0. Explain both successful and unsuccessful predictions using the gate rule. Score increments once per correct question. Replay starts at question one with zero score.

## Native implementation boundaries

- Use a real SPECS Base Template and its camera/render setup.
- Install and inspect supported SIK and UI Kit packages through CLAD/MCP before authoring interactions.
- Keep gate evaluation and challenge state separate from scene rendering so their behavior can be checked independently.
- Bind UI Kit/SIK events to explicit controller methods. Do not invent Lens Studio APIs or replace gesture handling with browser controls.
- Build scene objects, assets, references, and scripts through the native Lens Studio workflow; preserve the `.esproj`, scene, asset metadata, and package references.
- Give interactables stable semantic names for LEAF discovery: Start, InputA, InputB, GateSelector, StartChallenge, PredictZero, PredictOne, NextQuestion, Replay, Explore, Reset.

## Done criteria to carry into the planning brief

1. Start opens the world-anchored circuit; moving around in Interactive Preview preserves its world position and text is readable from the intended distance.
2. Input pinches and gate selection reproduce all twelve truth-table cases with matching labels and signal visuals, without runtime errors.
3. Challenge accepts one prediction per question, reveals an explanation, advances through exactly three questions, and displays the correct score.
4. Replay and Reset restore the specified state; switching modes does not preserve stale feedback or duplicate event handlers.
5. The packaged project reopens in Lens Studio with all references intact, runs again, and supports the same journey using mouse-driven simulated pinch.

Each criterion needs an actual Preview check and, where possible, a LEAF scenario. These checks have not run. Real-device comfort and hand tracking remain unproven without glasses.

## Demonstration plan

Target 2 minutes 30 seconds: introduce the student problem (15 s), show the circuit anchored in the room (20 s), demonstrate gate/input changes (40 s), complete the three-question challenge (45 s), show replay/reset and build evidence (20 s), close with the learning benefit (10 s). Record actual Lens Studio Preview only after it works. Publish the final video publicly on YouTube and include the real repository URL in Devpost.
