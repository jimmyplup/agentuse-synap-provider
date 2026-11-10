import { describe, expect, test } from 'bun:test';
import type { ProviderDefinition } from 'agentuse/plugin-api';
import activate, { SYNAP_BASE_URL, SYNAP_MODELS, synapApiKey } from './index.js';

describe('Synap AgentUse provider', () => {
  test('registers the canonical provider transport', async () => {
    let provider: ProviderDefinition | undefined;
    await activate({
      on() { return { dispose() {} }; },
      registerProvider(value: ProviderDefinition) { provider = value; return { dispose() {} }; },
      unregisterProvider() {},
      log: { debug() {}, info() {}, warn() {} },
    } as never);

    expect(provider?.id).toBe('synap');
    expect(provider?.transport).toEqual({
      kind: 'openai-chat-completions',
      baseURL: SYNAP_BASE_URL,
    });
    expect(provider?.models).toEqual(SYNAP_MODELS);
  });

  test('exposes the six live fleet models', () => {
    expect(SYNAP_MODELS).toHaveLength(6);
    expect(SYNAP_MODELS.map((model) => model.id)).toContain('meta/muse-glimmer-30b');
    expect(SYNAP_MODELS.map((model) => model.id)).toContain('qwen/qwen3-vl-30b-a3b-instruct');
  });

  test('resolves environment and stored API keys without logging them', () => {
    expect(synapApiKey.resolve(
      { credential: { apiKey: 'stored' } },
      { env: { SYNAP_API_KEY: 'environment' } } as never,
    )).toEqual({ apiKey: 'environment', source: 'SYNAP_API_KEY' });
    expect(synapApiKey.resolve(
      { credential: { apiKey: 'stored' } },
      { env: {} } as never,
    )).toEqual({ apiKey: 'stored', source: 'stored Synap API key' });
  });
});
