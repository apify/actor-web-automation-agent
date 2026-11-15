# Codex CLI Mission — Close the Apify Data-Ingestion Loop

## Objective
Complete and verify the existing Apify web-automation Actor as a reliable live data-entrypoint. Do not redesign the repository or create a parallel architecture. Preserve existing behavior unless a change is required for end-to-end correctness.

## Required outcome
1. Accept configured start URL and instructions.
2. Execute the existing browser automation.
3. Persist extracted records to the Apify default Dataset in a documented machine-readable schema.
4. Persist exactly one run-completion record per successful run, with run ID, Actor ID, source URL, completion time, result summary, and cost when available.
5. Preserve the existing OUTPUT key-value result and recording artifact.
6. Expose Dataset/run identifiers and a stable downstream handoff contract.
7. Pass automated build and test validation.
8. Verify a real Apify run and retrieve its Dataset record. Never call the integration live without this evidence.

## Phase 1 — Inspect actual state
- Read AGENTS.md and all repository guidance files.
- Inspect the actual working tree, git status, branch, history, and existing pull requests before editing.
- Trace src/widow_protocol.ts, src/agent_actions.ts, src/main.ts, src/input.ts, .actor/actor.json, .actor/input_schema.json, .actor/Dockerfile, package scripts, lockfile, TypeScript configuration, tests, and CI.
- Detect whether earlier Dataset-completion changes are already merged. Do not duplicate them.
- Verify all paths referenced by Actor configuration against the actual repository tree.

## Phase 2 — Complete the data contract
- Trace the real execution path from Actor.getInput() through browser execution and the agent action registry.
- Ensure extracted records are deterministically published with the installed Apify SDK to the default Dataset. Core output must not depend on the agent remembering to call a tool.
- Publish one completion event per successful run with eventType=agent.run.completed, actorRunId, actorId, startUrl, result or bounded summary, costUSD when available, and completedAt in ISO-8601 UTC.
- Distinguish extraction records from the run-completion event. Avoid duplicate records.
- Preserve OUTPUT and recording.mp4 behavior.
- Handle empty results, partial failures, cleanup, and Dataset write failures explicitly. Never silently report a failed publish as success.
- Redact API keys, cookies, authorization headers, credentials, and secrets from records, logs, and artifacts.
- Use only supported Actor SDK APIs for the installed version.

## Phase 3 — Downstream handoff
- Document how a consumer retrieves the default Dataset using the Actor run metadata and defaultDatasetId.
- Add a tested integration boundary for downstream ingestion. Keep credentials in secure environment/secret storage; never commit tokens.
- If controller.db or LiteRT-LM integration code or a reachable configured service exists, inspect and use its real interface. Otherwise define the adapter contract and mark that leg BLOCKED. Do not fabricate a connection.
- Make retries idempotent where practical using run ID and stable record identity.

## Phase 4 — Build and test
- Install dependencies reproducibly with npm ci.
- Run npm run build, npm test -- --runInBand, and lint if configured.
- Add tests for record schema, successful publication, empty output, publish failure, secret redaction, and preservation of existing output behavior.
- Fix failures caused by this change. Do not weaken tests to obtain a green result.
- Verify CI workflow configuration and Actor Dockerfile paths against the real repository layout.

## Phase 5 — Deploy and prove
- Check for Apify credentials through the secure execution environment. Never request, print, or commit a token.
- If credentials and deployment access exist, deploy using the supported Apify CLI/API, run a bounded safe test, retrieve run metadata and default Dataset items, and verify both extraction records and the completion event.
- If credentials are unavailable, complete all repository work, CI validation, and documentation. Mark only live deployment/run verification BLOCKED by the missing external authorization.
- Do not trigger unbounded crawling or costly production runs.

## Acceptance criteria
- Build, tests, and CI pass.
- Actor configuration references real files and starts correctly.
- Successful runs publish extracted records and exactly one completion event to the default Dataset.
- Existing OUTPUT and recording artifacts remain intact.
- Dataset schema and downstream retrieval contract are documented.
- No secrets are exposed.
- A real Apify run and Dataset retrieval are evidenced, or the live step is explicitly BLOCKED with the exact missing prerequisite.

## Deliverables
- Source changes and tests.
- Updated Actor and Dataset documentation.
- CI results.
- Pull request with concise change summary.
- Verification report separating PASS, FAIL, and BLOCKED.
- No simulated logs, invented IDs, or unsupported claims.

## Operating constraints
- Work autonomously through all repository tasks authorized by the available environment.
- Do not stop after describing blockers; complete all independent work first.
- Do not ask the user to perform coding or repository inspection.
- Do not overwrite unrelated user changes.
- Do not commit credentials or personal data.
- Do not claim deployment, runtime execution, or live ingestion without returned evidence.