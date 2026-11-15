# Google Stitch Skills Integration

## Purpose

Use the upstream Google Stitch Skills marketplace as the design-to-implementation layer for this automation project. Keep the upstream repository authoritative; do not copy or vendor its plugin source into this repository.

Upstream: https://github.com/google-labs-code/stitch-skills
Upstream branch: `main`

## Install in a Codex environment

Register the upstream marketplace:

```bash
codex plugin marketplace add google-labs-code/stitch-skills --ref main --sparse .agents/plugins --sparse plugins/stitch-design --sparse plugins/stitch-build --sparse plugins/stitch-utilities
```

Then install the three marketplace plugins:

- `stitch-design`
- `stitch-build`
- `stitch-utilities`

The Codex installation is an environment-level operation. Committing this document does not install the plugins into a running Codex environment.

## Required external dependency

Configure the Google Stitch MCP server and its authentication in the Codex environment. Without a working Stitch MCP connection, the skills may be present but live Stitch operations cannot run.

## Highest-value workflow for this repository

1. Generate or refine application screens and design systems in Stitch.
2. Extract the design specification and reusable design tokens.
3. Generate implementation components using the Stitch build skills.
4. Integrate generated components into this project's application code.
5. Run the existing browser automation against the implementation.
6. Capture screenshots and test results; fix visual and functional defects.
7. Review and commit only verified changes.

## Execution boundaries

- Treat `google-labs-code/stitch-skills` as the upstream source of truth.
- Do not deploy the skills repository as a standalone web service; it is an agent plugin/skills marketplace, not the application runtime.
- Do not add Stitch API credentials, MCP tokens, or other secrets to Git.
- Keep generated application code, tests, screenshots, and provenance in this repository.
- Verify upstream changes before updating the marketplace ref from `main` to a pinned commit.

## Acceptance criteria

- All three Stitch plugins are installed in the target Codex environment.
- Stitch MCP connectivity is verified with a real design read/write operation.
- At least one generated component is integrated into the application.
- Browser automation produces a passing functional check and a reviewable screenshot.
- The resulting application—not the skills marketplace—is deployed through the project's existing deployment target.
