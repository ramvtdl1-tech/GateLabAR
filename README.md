# GateLab AR

A native SPECS Lens for students learning binary logic. Pinch A/B inputs on a
world-anchored circuit, watch signals pass through AND/OR/XOR, then predict three outputs.

## Run

Open `SpecsBaseTemplate.esproj` in Lens Studio **5.23.2**. Use Sunlit Room with the
SPECS 27 device and Interactive Preview. Click a visible control to simulate a pinch.
Use WASD/Q/E and mouse look to change viewpoint. No glasses or API key is needed.

- Start opens Explore. Pinch A/B to toggle; pinch the gate to cycle AND → OR → XOR.
- Prediction check starts three questions. Pick Y=0 or Y=1, read the explanation,
  then Next. One answer is scored per question; outputs stay hidden until answering.
- Replay starts a fresh challenge. Explore restores AND/00. Reset returns to Welcome.
- Release a pinch before pressing a newly displayed control.

## Verified behavior

Native compilation, real simulated SIK pinches, all twelve truth-table cases,
challenge/replay/reset, fixed world anchoring and saved-project reopen passed.
All four LEAF scenarios passed after reopening the final layout. See
[the native report](devpost/build-report.md) and [evidence](devpost/build-verification.json).
The final anchor is (0, -10, -110) cm; typography scale is 1.3 after visual QA.

## Tests and source package

With Node 22.18+ (tested on Node 26), test the actual pure Lens state source:

```sh
node --test tests/gatelab.test.mjs
```

With Python 3.9+:

```sh
python3 -m unittest discover -s scripts -p 'test_*.py' -v
python3 scripts/package_release.py
```

The release packager checks native evidence, approved planning, source integrity,
package contents and selected credential patterns. The allowlisted archive excludes
MCP config, signing keys, caches, backups and unrelated projects. It contains source,
packages and retained license notices; this is not a signed/published Lens bundle.

## Planning and attribution

[Design brief](devpost/design-brief.md) uses the official Devpost Learn skill,
references and template. The user explicitly delegated design choices; no learner
interview or research is claimed. CLAD and native Lens Studio MCP built the Lens.
[Template provenance](TEMPLATE_SOURCE.md) and [upstream license](UPSTREAM_LICENSE.md)
disclose Snap's existing starter. New logic, UIKit views, procedural signal geometry,
SFX and tests are AI-assisted additions. Bundled packages retain their own notices.

## Limits and submission

Real-device hand tracking, comfort and additive-display readability are untested.
An optional LEAF avatar idle-animation download timed out; the IK scenario passed,
and normal startup had no errors. See the report for exact scope.

Public GitHub/GitLab/Bitbucket source, a public YouTube demo under three minutes,
and final Devpost submission remain separate actions. No public URLs or receipt
are claimed. [Demo script](devpost/demo-script.md) · [Checklist](devpost/submission-checklist.md).
