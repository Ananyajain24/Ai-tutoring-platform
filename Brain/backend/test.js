import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

try {
  console.log('Calling LLM...');
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 100,
    temperature: 0,
    system: 'Reply only with valid JSON.',
    messages: [{ role: 'user', content: 'Reply with {"status":"ok"}' }],
  });
  console.log('SUCCESS:', response.content[0].text);
} catch (err) {
  console.error('FAILED:', err.message);
  console.error(err);
}
