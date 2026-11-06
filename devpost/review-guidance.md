# GateLab AR: review guidance and release gates

Prepared November 7, 2026. **Preparation only: the proposed GateLab interaction flow is not implemented or verified by this document.** The proposed product is described in `product-plan.md`; its choices are agent-selected defaults, not completed learner interview answers.

## What the organizers say

The [official rules](https://learn-specs.devpost.com/rules) require a new SPECS Lens planned with the Devpost Learn skill pack and built through CLAD, Lens Studio, and Lens Studio MCP. It must run reliably in Preview. Submit a public repository containing the Lens Studio project, an accurate description, and a public YouTube working demonstration. The stated video target is below three minutes; judges need not watch beyond three. Disclose incorporated pre-existing work and meet eligibility, ownership, permission, and English-language requirements. Judging weighs design, implementation, innovation, and presentation equally.

Deadline: **November 9, 2026, 5:00 PM EST = November 10, 2026, 3:30 AM IST.** Keep judging access available until November 17, 2026, 5:00 PM EST. Formal rules make inclusion of planning documents optional, although the planning workflow itself is required.

The [latest organizer review update](https://learn-specs.devpost.com/updates/47523-4-projects-reviewed-live-what-to-fix-before-you-submit) adds practical submission directions: include `devpost/` because organizers check it; begin the working Preview demonstration within ten seconds; show an uninterrupted portion of the complete journey. It also asks for an explanation of the intended user, learning, and the planning skill’s contribution. Keep these directions alongside the formal rules rather than treating them as amendments to the legal wording.

The review’s design advice favors restrained contextual content, information revealed when needed, a small set of large controls, and purposeful use of the room and hands-free interaction. These are judging recommendations, not separate pass/fail provisions in the official rules.

## Proposed response in GateLab

These are implementation targets derived from the product plan, not observations of a working Lens.

| Review concern | Proposed GateLab decision | Evidence still needed |
| --- | --- | --- |
| Clear audience and purpose | Introductory computing students explore two-input logic gates, then predict an output. | Confirm this audience and learning goal in the actual planning process. |
| Content belongs in space | A small circuit stays at a world position; input nodes, gate, output, and connecting signals occupy distinct positions. | Walk around it in Interactive Preview and confirm anchoring, scale, and readability. |
| Small amount of visible UI | Explore shows the gate rule and current inputs; Challenge replaces input controls with prediction controls; feedback follows an answer. | Capture each mode and check that inactive controls and stale explanations disappear. |
| Few forgiving controls | SIK/UI Kit targets for input toggles, gate cycling, predictions, progression, replay, and reset appear only in the relevant mode. | Simulated pinches, hover/press feedback, and reachability checks. |
| Complete coherent experience | Welcome → Explore → three questions → feedback → results → replay or Explore. | An actual uninterrupted run; repeat run with reset. |
| Strong reason to use glasses | The student can view a circuit from different positions and manipulate its spatially connected parts while keeping eyes on it. | Evaluate this honestly: the visual/spatial benefit must be apparent in the finished demo. Do not claim a real-world sensing capability. |

## Evidence to collect before calling it ready

- Actual `plan-lens` planning output after its setup requirements and consequential design questions are satisfied. This folder is not evidence that the skill ran.
- Successful native CLAD/MCP build records, final project files, and resolved package references.
- Preview checks and meaningful LEAF scenarios for all twelve gate cases, single scoring per question, progression, replay/reset, and consistent reopening. Record failures and criteria without tests.
- Final description reconciled to implemented behavior; actual demo footage; anonymous access to the public repository and YouTube video; Devpost submission receipt.

No Preview result, automated test pass, public URL, or completed submission is asserted here. Hardware comfort and tracking require separate evidence.

## Setup sources

[Hackathon resources](https://learn-specs.devpost.com/resources) · [Official Devpost Learn pack](https://github.com/challengepost/learn-specs) · [Codex CLAD setup](https://developers.specs.com/docs/clad/setup/setup-ai/codex-setup) · [MCP troubleshooting](https://developers.specs.com/docs/clad/troubleshooting/troubleshoot-lens-studio-mcp)
