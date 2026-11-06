The behavioral test command now exercises `Assets/Scripts/GateLabState.ts` using Node type stripping. `gatelab.mts` is retained as the original standalone reference.

# GateLab domain logic preparation

`gatelab.mts` is a standalone, dependency-free TypeScript model. It has no Lens
APIs, rendering, hand interactions or network access. It is outside `Assets/`
and is **not connected to the Lens Studio scene**. Passing these tests does not
establish Lens compilation, Preview functionality, on-device behavior, or the
hackathon's required CLAD/MCP build workflow.

From the `GateLabAR` directory, with Node.js 22.18+ (native TypeScript stripping):

```sh
node --test tests/gatelab.test.mjs
```

No npm installation or generated build files are needed. Node strips erasable
TypeScript syntax at execution; this command is behavioral testing, not a
TypeScript static type check. The supplied environment has Node.js 26.

`new GateLabModel()` starts in `welcome`. Call `dispatch(action)` and render the
returned frozen `state`. Accepted actions return `{ ok: true, state }`; rejected
actions return `{ ok: false, error, state }` without changing the session.

| Phase | Accepted actions (in addition to Reset) |
| --- | --- |
| Welcome | `start` |
| Explore | `toggleInput` (A/B), `cycleGate`, `startChallenge` |
| Challenge | `predict` (0/1) |
| Feedback | `next` |
| Finish | `replay`, `explore` |

`reset` returns to Welcome with AND, A=0, B=0 and zero score. Returning to Explore
from Finish also starts a clean circuit. Replay starts question one with zero
score. During Challenge, `circuit.output` is `null`; the UI must display an
unknown output and avoid independently calculating/revealing it. A prediction
reveals the output and explanation in Feedback. Only explicit Next advances.

Future native integration should adapt this domain contract through verified
Lens APIs and supported SIK/UI Kit events, then test every journey in Lens
Studio Preview. The `.mts` extension and native Node execution are development
choices, not a claim that this module is directly importable in Lens Studio.
