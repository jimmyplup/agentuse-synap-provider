# AgentUse Synap provider

Community provider plugin that adds [Synap](https://synap402.com) to
[AgentUse](https://github.com/agentuse/agentuse).

## Install

```bash
agentuse plugins install jimmyplup/agentuse-synap-provider
agentuse provider login synap
```

You can also set `SYNAP_API_KEY` directly. Create a key at
<https://synap402.com>.

## Use

```bash
agentuse run my-agent.agentuse -m synap:qwen3-coder-30b
```

The plugin registers six Synap-hosted models, including the Muse Glimmer and
Qwen3 VL model IDs already present in AgentUse's generated model catalog.

## Data path

Prompts and the Synap API key are sent to `https://synap402.com/v1`.
Usage is billed against the user's Synap balance.

## Development

```bash
bun install
bun test
bun run typecheck
```
