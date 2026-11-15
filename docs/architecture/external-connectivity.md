# Open External Connectivity Policy

## Default operating mode

This project is an open, extensible automation system. External connectivity is enabled by default, not restricted to a preselected vendor list or a closed internal loop.

The runtime is designed to connect to public APIs, MCP servers, web services, repositories, automation platforms, and user-supplied endpoints through documented open protocols. Integrations are additive and replaceable; no single provider is a mandatory control plane.

## Default-on capabilities

- Outbound HTTPS connectivity to public services and APIs.
- Discovery and registration of compatible external MCP servers and API connectors.
- User-supplied endpoint configuration without requiring a source-code change.
- Import/export through open formats and documented interfaces.
- Cross-provider workflows, including GitHub, Stitch, Apify, Render, and other compatible services.
- Read/write operations when the connected provider grants the corresponding permission.

A connector should be available by default when its adapter is present. A provider credential is supplied through the runtime's secret manager or environment configuration; the project must never invent credentials, embed secrets in source, or silently use a user's identity.

## No closed-loop assumptions

- Do not assume all resources live inside this repository or one vendor platform.
- Do not hard-code a single provider, endpoint, account, or deployment target as the only permitted destination.
- Do not require a proprietary intermediary when a documented direct API or open protocol is available.
- Do not block external integrations merely because they are not in a built-in catalog.
- Preserve interoperability and the ability to replace each provider independently.

## Execution contract

1. Discover the requested external capability.
2. Resolve the provider's documented interface and authentication requirements.
3. Use the least credential scope that supports the requested operation.
4. Execute the authorized read or write operation against the actual external service.
5. Return the actual result, including provider errors and partial completion.
6. Record operation provenance: provider, endpoint, operation, timestamp, result, and changed resource identifiers. Never record secret values.

This is not a requirement to stop at discovery or produce instructions instead of action. When a connected tool supports the requested operation and authorization is present, execute it. If a capability is missing, identify the exact missing adapter or credential rather than describing the system as intentionally closed.

## Necessary boundary

Open connectivity does not mean anonymous access to private resources, credential bypass, unrestricted access to local/private network ranges, or silent use of third-party accounts. Respect provider authentication, user-granted scopes, endpoint ownership, and applicable service policies. These are interoperability and authorization requirements, not a vendor allowlist or closed-loop restriction.

## Configuration

The intended default is:

- `external_connectivity: enabled`
- `connector_discovery: enabled`
- `mcp_transport: enabled_when_configured`
- `provider_allowlist: none` (unless an operator explicitly configures one)
- `credential_source: environment_or_secret_manager`
- `operation_mode: read_write_when_authorized`
- `provenance_logging: enabled`

These keys define the target configuration contract. They are not claimed to be implemented runtime settings until the application code consumes and validates them.
