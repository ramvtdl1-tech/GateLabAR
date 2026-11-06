---
status: approved
approval_basis: explicit-user-delegation
---

# Design brief: GateLab AR

Planning provenance: prepared with the official Devpost Learn plan-lens skill, its AR design/Preview references and template. On November 7, 2026 (IST), the user explicitly delegated design choices: "apne hisab se jo accha lage bo use kar skte hain taki project winning ho jaye". This delegation authorizes the agent-selected defaults below and proceeding with implementation. No learner interview or user research is claimed. Success in judging is a goal, not a guarantee. The interview/sign-off preference was adapted to this explicit user instruction.

## The one spatial moment
An introductory computing student pinches an input node on a compact circuit in their room and watches a signal travel through the selected logic gate to its output. They then predict the output before it is revealed (default learning goal).

## Why it belongs on glasses
- Uses: draws in the world; leaves the student's view and body free (default).
- Input, gate and output have distinct spatial positions linked by visible 3D signal paths. Controls live beside the circuit parts they change. The student can change viewpoint while the circuit stays in the room. This is the proposed spatial benefit, not a measured educational advantage.

## Product or overlay
- Type: product: the virtual circuit is the experience (default).
- Real sensing: nothing; no recognition or recording.
- Preview stand-in: none needed. All functionality uses standard mouse-driven simulated SIK pinches.

## Where things live
- Look toward the circuit, slightly below initial eye level.
- World anchor: approximately 110 cm ahead of the starting camera and 18 cm lower, set once at startup (default); never head-locked.
- Main circuit: approximately 45 cm wide by 28 cm high, inputs left, gate middle, output right (default). Adjust spacing modestly if real UIKit bounds require it; keep the full primary task comfortably visible.
- Context controls: small groups beside/below relevant nodes; large forgiving pinch targets and generous gaps (default). Light text, cyan active signals, lavender inactive outlines, numeric 0/1 labels as well as color.

## Hands and input
- Start opens Explore.
- Pinch InputA/InputB to toggle bits; GateSelector cycles AND, OR, XOR.
- StartChallenge opens three prediction questions; PredictZero/PredictOne accept one answer per question.
- NextQuestion advances only after feedback. Replay starts a fresh round; Explore returns to a clean circuit; Reset restores Welcome, AND, A=0, B=0, score=0.
- Targets are big and highlight when aimed at.
- Voice: none (default).

## When things show
- Welcome shows a brief purpose and one Start control.
- Explore shows circuit, gate rule, relevant inputs and challenge/reset controls.
- Challenge hides/disables exploratory input/gate controls, shows question progress and only prediction choices; output is unknown until answering.
- Feedback reveals the result, explanatory rule and Next; prediction controls no longer accept input.
- Finish shows score out of three, Replay, Explore and Reset. Stale feedback clears between modes.
- Out-of-view attention: none required; everything for the current task stays in the same compact space.

## Done criteria
Each one can be checked in Lens Studio's preview.
1. Start opens a readable world-anchored circuit. Moving in Interactive Preview preserves its world position.
2. Input pinches and gate selection reproduce all twelve AND/OR/XOR truth-table cases with matching numeric and signal feedback, without runtime errors.
3. The challenge asks AND(1,0), OR(0,1), XOR(1,1); hides output before prediction; accepts/scorers one answer; explains each result; requires Next; finishes after exactly three questions with the correct score.
4. Replay, Explore and Reset restore their specified state without stale explanations or duplicate input handlers.
5. A clean packaged project reopens, compiles, and runs the same interaction journey using simulated pinches.

## Out of scope
- Recognition, cloud AI, voice, network services, accounts in the Lens, persistence, multiplayer, custom hand poses, and educational-outcome claims (defaults).
- A browser/website implementation is not a substitute for the native Lens.

## Risks and open questions
- Comfort over time and real-device tracking are feel unproven without SPECS hardware.
- World scale, field of view, target size and additive-display readability need actual Preview inspection and correction.
- Existing logic/gatelab.mts is Node-only preparation. Adapt its contract to verified Lens TypeScript; do not assume direct import compatibility.
- Respect included Snap template/package licenses and disclose pre-existing work. Use original primitives for circuit geometry rather than unrelated decorative generated meshes.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
