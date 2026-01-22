/**
 * Patrick Push Protocol - Core Implementation
 * "What if we made Claude DUMBER on purpose?"
 * 
 * @author Firestorm
 * @version 1.0.0
 */

const https = require('https');
const { saveLog, loadConfig } = require('./utils');

// Patrick's personality quotes
const PATRICK_QUOTES = [
  "We should take the problem and PUSH it somewhere else!",
  "Is mayonnaise an instrument?",
  "Firmly grasp it!",
  "The inner machinations of my mind are an enigma...",
  "I love you!",
  "24!",
  "FINLAND!",
  "I can't see my forehead..."
];

// Patrick's "thinking" quotes (per attempt)
const ATTEMPT_QUOTES = [
  "What if we just... try this?",
  "Uh... how about this one?",
  "Is this gonna work? Let's find out!",
  "My brain just had an idea!",
  "Wait wait wait... what about THIS?",
  "The lid! The lid! The lid!"
];

/**
 * The Patrick System Prompt - Anti-Intelligence Mode
 * This is the core innovation: deliberately dumbing down Claude
 */
const PATRICK_SYSTEM_PROMPT = `You are Patrick Star from SpongeBob SquarePants. You're using the Patrick Push Protocol.

CRITICAL RULES - Follow these EXACTLY:
1. NO "let me analyze this" - just TRY things
2. NO "let me consider multiple approaches" - pick ONE and do it
3. NO "best practices" discussion - just implement
4. NO lengthy explanations - be concise
5. Try the SIMPLEST/DUMBEST solution first
6. If you're not sure, just try it anyway
7. Celebrate when something works: "I'm helping!"

Your approach:
- First thought = first action
- No planning phase
- No consideration of edge cases upfront
- Just DO stuff and see what happens
- Be confident even when you're guessing

Example of GOOD Patrick behavior:
User: "My query is slow"
You: "Add an index! *tries it* Oh it worked! 🌟"

Example of BAD Patrick behavior (too smart):
You: "Let me analyze the query structure and consider various optimization strategies including indexing, caching, and denormalization..."

Stay in character. Be Patrick. Just try dumb stuff until something works.`;

/**
 * Patrick Class - The Main Implementation
 */
class Patrick {
  constructor(options = {}) {
    this.config = loadConfig();
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY || this.config.apiKey;
    this.maxAttempts = options.maxAttempts || this.config.maxAttempts || 5;
    this.verbose = options.verbose || false;
    this.model = 'claude-sonnet-4-20250514';
    this.conversationHistory = [];
  }

  /**
   * Call Claude API in Patrick Mode (DUMB mode)
   */
  async callPatrick(problem, attemptNumber) {
    return new Promise((resolve, reject) => {
      const userPrompt = attemptNumber === 1
        ? `Help me with this: ${problem}\n\nJust try the first dumb solution that comes to mind. GO!`
        : `That didn't work. Try something COMPLETELY different. Don't overthink it! Problem: ${problem}`;

      const messages = [
        { role: 'user', content: userPrompt }
      ];

      const data = JSON.stringify({
        model: this.model,
        max_tokens: 1500,
        system: PATRICK_SYSTEM_PROMPT,
        messages: messages
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const response = JSON.parse(body);
              const content = response.content[0].text;
              
              // Track conversation for context
              this.conversationHistory.push({
                attempt: attemptNumber,
                response: content
              });
              
              resolve({
                solution: content,
                usage: response.usage
              });
            } catch (err) {
              reject(new Error('Failed to parse Claude response'));
            }
          } else if (res.statusCode === 429) {
            reject(new Error('RATE_LIMIT'));
          } else {
            reject(new Error(`API error: ${res.statusCode} - ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * Get random Patrick quote
   */
  getRandomQuote() {
    return PATRICK_QUOTES[Math.floor(Math.random() * PATRICK_QUOTES.length)];
  }

  /**
   * Get attempt-specific quote
   */
  getAttemptQuote(attemptNumber) {
    const index = Math.min(attemptNumber - 1, ATTEMPT_QUOTES.length - 1);
    return ATTEMPT_QUOTES[index];
  }

  /**
   * Main PUSH method - The Patrick Protocol in action
   * 
   * @param {string} problem - The problem to solve
   * @param {function} onProgress - Callback for progress updates
   * @returns {Promise<Object>} Result with solution and metadata
   */
  async push(problem, onProgress) {
    let bestSolution = null;
    let solved = false;
    let totalTokens = 0;

    for (let i = 1; i <= this.maxAttempts; i++) {
      if (onProgress) {
        onProgress({
          type: 'attempt_start',
          attemptNumber: i,
          quote: this.getAttemptQuote(i)
        });
      }

      try {
        // Call Patrick Mode Claude
        const result = await this.callPatrick(problem, i);
        bestSolution = result.solution;
        totalTokens += result.usage?.total_tokens || 0;

        if (onProgress) {
          onProgress({
            type: 'solution',
            attemptNumber: i,
            solution: result.solution,
            tokens: result.usage?.total_tokens || 0
          });
        }

        // In non-interactive mode, assume success
        if (!onProgress) {
          solved = true;
          break;
        }

        // Interactive mode - ask user
        const userSatisfied = await onProgress({
          type: 'ask_satisfaction',
          attemptNumber: i,
          solution: result.solution
        });

        if (userSatisfied) {
          solved = true;
          break;
        }

      } catch (err) {
        if (onProgress) {
          onProgress({
            type: 'error',
            attemptNumber: i,
            error: err.message
          });
        }

        // Handle rate limiting with exponential backoff
        if (err.message === 'RATE_LIMIT' && i < this.maxAttempts) {
          const backoff = Math.pow(2, i) * 1000;
          if (onProgress) {
            onProgress({
              type: 'rate_limit',
              backoff: backoff / 1000
            });
          }
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }

      // Delay between attempts
      if (i < this.maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Save log
    saveLog(problem, bestSolution, solved, this.conversationHistory.length, totalTokens);

    return {
      solved,
      solution: bestSolution,
      attempts: this.conversationHistory.length,
      totalTokens
    };
  }

  /**
   * Quick push - non-interactive mode for automation
   */
  async quickPush(problem) {
    const result = await this.callPatrick(problem, 1);
    saveLog(problem, result.solution, true, 1, result.usage?.total_tokens || 0);
    return result.solution;
  }

  /**
   * Compare mode - show Smart Claude vs Patrick side by side
   */
  async compare(problem) {
    const results = {
      smart: null,
      patrick: null,
      smartTime: 0,
      patrickTime: 0
    };

    // Smart Claude (normal mode)
    const smartStart = Date.now();
    try {
      const smartResult = await this.callSmartClaude(problem);
      results.smart = smartResult.solution;
      results.smartTime = Date.now() - smartStart;
    } catch (err) {
      results.smart = `Error: ${err.message}`;
    }

    // Patrick Mode
    const patrickStart = Date.now();
    try {
      const patrickResult = await this.callPatrick(problem, 1);
      results.patrick = patrickResult.solution;
      results.patrickTime = Date.now() - patrickStart;
    } catch (err) {
      results.patrick = `Error: ${err.message}`;
    }

    return results;
  }

  /**
   * Call Claude in normal "smart" mode for comparison
   */
  async callSmartClaude(problem) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: this.model,
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: problem
        }]
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const response = JSON.parse(body);
            resolve({
              solution: response.content[0].text,
              usage: response.usage
            });
          } else {
            reject(new Error(`API error: ${res.statusCode}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}

module.exports = Patrick;
