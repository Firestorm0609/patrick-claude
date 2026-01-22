/**
 * Patrick Push Protocol - Test Suite
 * "Is mayonnaise a test framework?"
 */

const Patrick = require('../src/patrick');
const { loadConfig } = require('../src/utils');

console.log('🧪 Running Patrick Push Protocol Tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${err.message}`);
    failed++;
  }
}

// Test 1: Patrick instantiation
test('Patrick instantiation', () => {
  const patrick = new Patrick({ apiKey: 'test-key', maxAttempts: 3 });
  if (!patrick) throw new Error('Patrick not created');
  if (patrick.maxAttempts !== 3) throw new Error('Wrong max attempts');
});

// Test 2: Patrick without API key uses env/config
test('Patrick uses environment API key', () => {
  const oldKey = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = 'env-test-key';
  const patrick = new Patrick();
  if (patrick.apiKey !== 'env-test-key') throw new Error('Did not use env key');
  process.env.ANTHROPIC_API_KEY = oldKey;
});

// Test 3: Random quote generation
test('Patrick generates random quotes', () => {
  const patrick = new Patrick();
  const quote = patrick.getRandomQuote();
  if (!quote || typeof quote !== 'string') throw new Error('Invalid quote');
  if (quote.length === 0) throw new Error('Empty quote');
});

// Test 4: Attempt quote generation
test('Patrick generates attempt quotes', () => {
  const patrick = new Patrick();
  const quote1 = patrick.getAttemptQuote(1);
  const quote2 = patrick.getAttemptQuote(2);
  if (!quote1 || !quote2) throw new Error('Invalid attempt quotes');
});

// Test 5: Config loading
test('Config loading works', () => {
  const config = loadConfig();
  if (!config || typeof config !== 'object') throw new Error('Invalid config');
  if (typeof config.maxAttempts !== 'number') throw new Error('Missing maxAttempts');
});

// Test 6: Patrick mode detection
test('Patrick has correct model', () => {
  const patrick = new Patrick();
  if (patrick.model !== 'claude-sonnet-4-20250514') throw new Error('Wrong model');
});

// Test 7: Max attempts configuration
test('Patrick respects max attempts config', () => {
  const patrick1 = new Patrick({ maxAttempts: 3 });
  const patrick2 = new Patrick({ maxAttempts: 10 });
  if (patrick1.maxAttempts !== 3) throw new Error('Wrong max attempts for patrick1');
  if (patrick2.maxAttempts !== 10) throw new Error('Wrong max attempts for patrick2');
});

// Test 8: Conversation history initialization
test('Conversation history starts empty', () => {
  const patrick = new Patrick();
  if (!Array.isArray(patrick.conversationHistory)) throw new Error('History not array');
  if (patrick.conversationHistory.length !== 0) throw new Error('History not empty');
});

// Test 9: Verbose mode
test('Patrick handles verbose flag', () => {
  const patrick1 = new Patrick({ verbose: true });
  const patrick2 = new Patrick({ verbose: false });
  if (patrick1.verbose !== true) throw new Error('Verbose not set');
  if (patrick2.verbose !== false) throw new Error('Verbose not false');
});

// Test 10: API key priority (explicit > env > config)
test('API key priority is correct', () => {
  const patrick = new Patrick({ apiKey: 'explicit-key' });
  if (patrick.apiKey !== 'explicit-key') throw new Error('Did not use explicit key');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`🧪 Test Results:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n🌟 Patrick: "My brain just spilled like milk..."');
  process.exit(1);
} else {
  console.log('\n🌟 Patrick: "I helped! All tests passed!"');
  process.exit(0);
}
