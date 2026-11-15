# Google Stitch Skills Integration

## Purpose

Use Google's Stitch Skills marketplace as the design-to-implementation capability within this automation project. Keep the upstream repository authoritative and connect to it externally; do not copy or vendor its plugin source into this repository.

Upstream: https://github.com/google-labs-code/stitch-skills
Upstream branch: `main`

## Open integration model

Stitch is one external capability in an open connector architecture. It must not become a closed or exclusive execution loop. The same workflow should accept other compatible design tools, MCP servers, APIs, and user-supplied endpoints.

- External connectivity is enabled by default.
- Connector discovery is enabled by default.
- No provider allowlist is imposed by this integration.
- Read/write operations run when the connected provider grants the required scope.
- Credentials stay in the target runtime's environment or secret manager, never in Git.

See [Open External Connectivity Policy](../architecture/external-connectivity.md).

## Install in a Codex environment

Register the upstream marketplace:

```bash
codex plugin marketplace add google-labs-code/stitch-skills --ref main --sparse .agents/plugins --sparse plugins/stitch-design --sparse plugins/stitch-build --sparse plugins/stitch-utilities
```

Then install the three marketplace plugins:

- `stitch-design`
- `stitch-build`
- `stitch-utilities`

This is an environment-level installation. Committing this document does not itself install plugins in a running Codex environment.

## Required external dependency

Configure the Google Stitch MCP server and its authentication in the Codex environment. The integration is externally connectable by design; live Stitch operations require a reachable MCP endpoint and valid provider authorization.

## Highest-value workflow

1. Generate or refine application screens and design systems in Stitch.
2. Extract design specifications and reusable design tokens.
3. Generate implementation components using Stitch build skills.
4. Integrate generated components into this project's application code.
5. Run browser automation against the implementation.
6. Capture screenshots and test results; correct functional and visual defects.
7. Preserve operation provenance and actual verification results.

## Interoperability

- Treat `google-labs-code/stitch-skills` as the upstream source of truth for these skills.
- Keep the marketplace source independently updateable.
- Permit additional design/build providers through compatible adapters or MCP servers.
- Prefer open protocols and direct documented APIs over proprietary intermediaries.
- Do not deploy the skills marketplace as a standalone web service; deploy the application runtime that consumes the skills.

## Acceptance criteria

- The three Stitch plugins are installed in the target Codex environment.
- Stitch MCP connectivity is verified with a real design read/write operation.
- At least one generated component is integrated into the application.
- Browser automation runs against the integrated component and produces a reviewable result.
- Other compatible external providers can be added without rewriting the core workflow.
- The application—not the skills marketplace—is deployed through the selected deployment provider.
