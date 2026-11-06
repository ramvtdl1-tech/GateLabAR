# Hackathon requirements

This document maps the supplied Learn AR with SPECS rules and setup guidance to verifiable deliverables. It does not certify eligibility, successful tool use, a working Lens, or a completed submission. Runtime, required planning/build workflow, and submission readiness remain outstanding; see the project `devpost/verification.json` for observed setup and standalone checks.

## Sources and timing

- [Official rules](https://learn-specs.devpost.com/rules), particularly sections 1, 3–7, and 11.
- [Hackathon resources](https://learn-specs.devpost.com/resources).
- User-provided rules attachment: `b3588f21-4b89-4814-ac51-c55b0211c904/Pasted text.txt`, received November 6, 2026.
- User-provided setup/resources attachment: `0cd9050c-5c5e-4dee-afa1-ccb4b0b3fb1d/Pasted text.txt`, received November 6, 2026.

Registration and submission both close **November 9, 2026, at 5:00 p.m. EST (UTC−05:00)**: **November 9, 22:00 UTC / November 10, 2026, at 3:30 a.m. IST (UTC+05:30)**. The submission period starts October 15, 2026, at 10:00 a.m. Eastern Time. The project must be newly created within that period.

Judging access must remain available through **November 17, 2026, at 5:00 p.m. EST / November 18, 2026, at 3:30 a.m. IST**. Recheck the official rules before submission because the organizers may amend them; official rules take precedence over other hackathon materials.

## Entrant requirements

| ID | Requirement | Evidence to verify |
| --- | --- | --- |
| E1 | Individual entrants and every team member meet the age of majority where they reside at entry. | Private confirmation by each entrant; do not commit identity documents. |
| E2 | Residence or organizational domicile permits participation and receiving a prize under applicable US and local law. | Section 3 eligibility check for every entrant. Listed exclusions include Brazil, Quebec, Russia, Crimea, Cuba, Iran, and North Korea; the list is not exhaustive. |
| E3 | No specified sponsor, administrator, organizer, judge, judge-employer, affiliate, immediate-family, household, or other conflict-of-interest exclusion applies. | Entrant confirmation against section 3; organizer clarification if ambiguous. |
| E4 | An entering organization legally exists at entry. A team or organization appoints an authorized eligible representative. | Representative and team/organization information on the entry. |

Individuals, teams, and eligible existing organizations can enter. An individual can enter solo and participate in multiple teams. Multiple submissions must be unique and substantially different. There is no purchase requirement.

## Required workflow and project

| ID | Requirement | Evidence to verify |
| --- | --- | --- |
| T1 | Use a coding agent and the official Devpost Learn skill pack to plan the Lens. | Actual `plan-lens` execution and resulting planning artifacts; installation alone is insufficient. |
| T2 | Build through the official CLAD plugin, Lens Studio, and Lens Studio MCP. | Actual successful tool calls/build records tied to this project. Do not invent a tool-use log or infer use from installed files. |
| T3 | Use a SPECS project in Lens Studio, saved as a real project. | Project file, scene, scripts, assets, and required package metadata present and reopenable. |
| T4 | Deliver a new SPECS AR Lens that runs consistently in Lens Studio Preview. | Successful Preview run and functional verification matching the description and demo. A website or source-only scaffold does not meet this requirement. |
| T5 | Build the submitted work during the submission period. Disclose other incorporated pre-existing code/work. | Project history and a third-party/pre-existing-work disclosure. Standard frameworks, libraries, starter templates, Lens Studio templates/assets, and AI assistants are permitted by the rules. |
| T6 | Be authorized to use third-party SDKs, APIs, data, code, and assets. | Applicable licenses, attribution, permissions, and required notices. |
| T7 | Do not submit a project developed from prohibited financial or preferential support from Snap or Devpost. | Entrant confirmation against the rules' Financial or Preferential Support provision. |

The supplied setup guidance specifies Lens Studio **5.22 or later** on Windows 11 or macOS 12+. It recommends **5.23.2** if CLAD developer-platform sign-in is blocked. Start from **SPECS → Base Template**, save the project, keep it open in Lens Studio, and connect the agent from the project folder. Consult the [official Lens Studio setup](https://developers.specs.com/docs/clad/setup/setup-lens-studio), [Codex CLAD setup](https://developers.specs.com/docs/clad/setup/setup-ai/codex-setup), and [MCP troubleshooting](https://developers.specs.com/docs/clad/troubleshooting/troubleshoot-lens-studio-mcp) instructions.

SPECS glasses are not required: the supplied guidance explicitly permits building, testing, and recording the Lens in Preview. Hardware-dependent features still need appropriate testing, and the rules reserve the right to request hardware access in applicable cases.

## Submission deliverables

| ID | Requirement | Evidence to verify |
| --- | --- | --- |
| S1 | Register with Devpost and complete every required submission field before the deadline. | Registration and final submission confirmation. A saved draft is not a submitted entry. |
| S2 | Provide a **public GitHub, GitLab, or Bitbucket repository** containing the Lens Studio project files. | Working anonymous-access URL and a clean checkout that reopens in Lens Studio. |
| S3 | Provide a text description of the Lens's features and functionality. | English description accurately matching the implemented project. |
| S4 | Provide a demonstration showing the project working. | Recording of the actual running Lens; Lens Studio Preview recording is the recommended approach. |
| S5 | Upload the demonstration to **YouTube with Public visibility**, and provide its URL in Devpost. | Public video accessible while signed out. Do not treat an unlisted, private, local, or placeholder URL as verified compliance. |
| S6 | Keep the demonstration under three minutes. | Final duration check. Formal rules say it should be under three minutes and judges need not watch beyond three; the supplied guidance also directs entrants to keep it under three. |
| S7 | Use English, or provide English translations for all submitted materials. | Description, video/translation, testing instructions, and other materials reviewed. |
| S8 | Provide free, unrestricted project access for judging through the judging deadline. | Public repo and video remain accessible; testing does not require payment or undisclosed access approval. |
| S9 | Retain planning documents in `devpost/`. | Generated planning artifacts committed. The setup guidance recommends this; formal rules make including them optional. The November 6 live-review update directs entrants to include this folder and says organizers check it. Its presence alone does not prove required tool use. |

The demo must not contain third-party trademarks, copyrighted music, or other material without permission. Showing planning documents and the agent workflow is encouraged, but does not replace a working-project demonstration.

## Ownership and disclosure

The entrant must own the original submission and satisfy the rules' intellectual-property provisions. Open-source components are allowed when their licenses are followed and the new work enhances/builds on the underlying product. Public repository access does not, by itself, establish permission to reuse every included asset.

Maintain a disclosure that lists each incorporated pre-existing component, its source/version, license or permission, required notices, and what new work was added. Record templates, assets, libraries, fonts, samples, and external integrations as applicable. State that AI assistance was used accurately. Do not claim that third-party components are entrant-created. Do not commit credentials, private account data, identity documents, or private unrelated project files.

The rules retain entrant ownership while granting the specified judging and promotional rights. Do not promise that submission materials will remain confidential. Verify the final rules before accepting them.

## Judging and readiness

Stage one is pass/fail on required tools, project requirements, and submission requirements. Eligible projects are then scored equally on **Design**, **Technical Implementation**, **Innovation/Idea**, and **Presentation**. A coherent end-to-end experience and an accurate working demonstration are therefore essential.

Use `submission-checklist.md` to collect evidence. Mark a requirement verified only after the corresponding action or check actually succeeds. Documentation, installed tools, or successful standalone unit tests cannot substitute for a running Lens Studio Preview.
