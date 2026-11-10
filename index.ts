import type {
  AgentUseExtension,
  ProviderAuthMethod,
  ProviderModelDefinition,
} from 'agentuse/plugin-api';

export const SYNAP_BASE_URL = 'https://synap402.com/v1';

export const SYNAP_MODELS: ProviderModelDefinition[] = [
  {
    id: 'qwen/qwen3-vl-30b-a3b-instruct',
    name: 'Qwen3 VL 30B A3B Instruct',
    input: ['text', 'image'],
    reasoning: false,
    contextWindow: 65_536,
    maxOutputTokens: 16_384,
    cost: { input: 0.14, output: 0.55 },
    capabilities: { tools: true, parallelToolCalls: true },
  },
  {
    id: 'qwen/qwen3-30b-a3b-instruct-2507',
    name: 'Qwen3 30B A3B Instruct 2507',
    input: ['text'],
    reasoning: false,
    contextWindow: 98_304,
    maxOutputTokens: 16_384,
    cost: { input: 0.081267, output: 0.2438 },
    capabilities: { tools: true, parallelToolCalls: true },
  },
  {
    id: 'qwen3-coder-30b',
    name: 'Qwen3 Coder 30B',
    input: ['text'],
    reasoning: false,
    contextWindow: 98_304,
    maxOutputTokens: 16_384,
    cost: { input: 0.0675, output: 0.27 },
    capabilities: { tools: true, parallelToolCalls: true },
  },
  {
    id: 'meta/muse-glimmer-30b',
    name: 'Muse Glimmer 30B',
    input: ['text'],
    reasoning: true,
    contextWindow: 131_072,
    maxOutputTokens: 16_384,
    cost: { input: 0.28, output: 1.1 },
    capabilities: { tools: true, parallelToolCalls: true },
  },
  {
    id: 'gpt-oss-20b',
    name: 'GPT OSS 20B',
    input: ['text'],
    reasoning: true,
    contextWindow: 65_536,
    maxOutputTokens: 16_384,
    cost: { input: 0.017, output: 0.085 },
    capabilities: { tools: true, parallelToolCalls: true },
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 26B A4B IT',
    input: ['text'],
    reasoning: false,
    contextWindow: 32_768,
    maxOutputTokens: 8_192,
    cost: { input: 0.04, output: 0.21 },
    capabilities: { tools: true, parallelToolCalls: true },
  },
];

export const synapApiKey: ProviderAuthMethod = {
  id: 'api-key',
  type: 'api-key',
  name: 'Synap API key',
  environment: ['SYNAP_API_KEY'],
  async login(interaction) {
    const apiKey = (await interaction.prompt({
      message: 'Synap API key',
      secret: true,
    })).trim();
    if (!apiKey) throw new Error('A Synap API key is required.');
    return { apiKey };
  },
  resolve({ credential }, context) {
    const environmentKey = context.env.SYNAP_API_KEY?.trim();
    const storedKey = typeof credential?.apiKey === 'string'
      ? credential.apiKey.trim()
      : '';
    const apiKey = environmentKey || storedKey;
    if (!apiKey) return undefined;
    return {
      apiKey,
      source: environmentKey ? 'SYNAP_API_KEY' : 'stored Synap API key',
    };
  },
};

const activate: AgentUseExtension = (agentuse) => {
  agentuse.registerProvider({
    id: 'synap',
    name: 'Synap',
    models: SYNAP_MODELS,
    transport: {
      kind: 'openai-chat-completions',
      baseURL: SYNAP_BASE_URL,
    },
    auth: { methods: [synapApiKey] },
    media: { image: true, pdf: false },
  });
};

export default activate;
