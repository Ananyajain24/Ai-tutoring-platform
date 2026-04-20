import Anthropic from '@anthropic-ai/sdk';
console.log("API KEY:", process.env.ANTHROPIC_API_KEY);
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callLLM({ systemPrompt, userMessage, temperature = 0, maxTokens = 2048 }) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected LLM response type');
  return block.text;
}
