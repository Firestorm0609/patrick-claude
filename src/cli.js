/**
 * Patrick CLI Interface
 * "Is mayonnaise an instrument?"
 */

const Patrick = require('./patrick');
const { log, patrick, colors } = require('./utils');
const readline = require('readline');

class PatrickCLI {
  async run() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
      this.showHelp();
      return;
    }

    if (args[0] === 'version' || args[0] === '--version' || args[0] === '-v') {
      this.showVersion();
      return;
    }

    const command = args[0];

    switch (command) {
      case 'push':
        await this.handlePush(args.slice(1));
        break;
      case 'quick':
        await this.handleQuick(args.slice(1));
        break;
      case 'compare':
        await this.handleCompare(args.slice(1));
        break;
      case 'stats':
        await this.showStats();
        break;
      default:
        log(`\n❌ Unknown command: ${command}`, 'red');
        log('Try: patrick help\n', 'yellow');
    }
  }

  parseFlags(args) {
    return {
      verbose: args.includes('--verbose') || args.includes('-v'),
      attempts: this.extractFlagValue(args, '--attempts') || 5,
      auto: args.includes('--auto') || args.includes('-a')
    };
  }

  extractFlagValue(args, flag) {
    const index = args.indexOf(flag);
    if (index !== -1 && args[index + 1]) {
      return parseInt(args[index + 1]);
    }
    return null;
  }

  async handlePush(args) {
    const flags = this.parseFlags(args);
    const problem = args.filter(a => !a.startsWith('--') && !a.startsWith('-')).join(' ');

    if (!problem) {
      log('\n❌ Error: Please provide a problem to push!', 'red');
      log('Usage: patrick push "your problem here"\n', 'yellow');
      return;
    }

    const patrickInstance = new Patrick({
      verbose: flags.verbose,
      maxAttempts: flags.attempts
    });

    if (!patrickInstance.apiKey) {
      log('\n❌ Error: ANTHROPIC_API_KEY not found', 'red');
      log('Set it with: export ANTHROPIC_API_KEY=your_key_here\n', 'yellow');
      process.exit(1);
    }

    // Header
    log('\n╔════════════════════════════════════════════╗', 'pink');
    log('║     PATRICK PUSH PROTOCOL - DUMB MODE! 🌟 ║', 'pink');
    log('╚════════════════════════════════════════════╝', 'pink');

    patrick(patrickInstance.getRandomQuote());

    log(`\n📋 Problem: ${problem}`, 'cyan');
    log(`🧠 Mode: ANTI-INTELLIGENCE (Patrick Mode)`, 'pink');
    log(`🔄 Maximum attempts: ${patrickInstance.maxAttempts}`, 'gray');
    log('');

    const startTime = Date.now();

    const result = await patrickInstance.push(problem, async (event) => {
      switch (event.type) {
        case 'attempt_start':
          log(`\n${'='.repeat(50)}`, 'gray');
          log(`🎯 Attempt ${event.attemptNumber}/${patrickInstance.maxAttempts} - Trying dumb solution...`, 'yellow');
          log('='.repeat(50), 'gray');
          patrick(`"${event.quote}"`);
          break;

        case 'solution':
          log('\n📝 Patrick\'s Solution:', 'green');
          log(event.solution, 'reset');
          if (flags.verbose) {
            log(`\n💭 Tokens used: ${event.tokens}`, 'gray');
          }
          break;

        case 'ask_satisfaction':
          if (flags.auto) {
            log('\n🤖 Auto mode: Assuming success', 'green');
            return true;
          }

          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          return new Promise(resolve => {
            rl.question('\n✅ Did this work? (y/n): ', (answer) => {
              rl.close();
              const satisfied = answer.toLowerCase() === 'y';

              if (satisfied) {
                patrick("I helped! I'm helping!");
              } else {
                patrick("Tartar sauce! Let me try something else...");
              }

              resolve(satisfied);
            });
          });

        case 'error':
          log(`\n❌ Attempt ${event.attemptNumber} failed: ${event.error}`, 'red');
          patrick("My brain just spilled like milk...");
          break;

        case 'rate_limit':
          log(`\n⏸️  Rate limited - waiting ${event.backoff} seconds...`, 'yellow');
          patrick("I need a snack break!");
          break;
      }
    });

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

    // Final result
    log('\n' + '='.repeat(50), 'gray');
    if (result.solved) {
      log('🏆 PROBLEM SOLVED!', 'green');
      patrick("The dumb solution worked!");
      log(`\n⚡ Time: ${totalTime}s`, 'cyan');
      log(`🔄 Attempts: ${result.attempts}`, 'cyan');
      if (flags.verbose) {
        log(`💭 Total tokens: ${result.totalTokens}`, 'gray');
      }
    } else {
      log('🤔 Reached max attempts', 'yellow');
      patrick("Maybe we need to be even DUMBER?");
      if (result.solution) {
        log('\n💡 Best solution found:', 'cyan');
        log(result.solution, 'reset');
      }
    }
    log('='.repeat(50) + '\n', 'gray');
  }

  async handleQuick(args) {
    const problem = args.join(' ');

    if (!problem) {
      log('\n❌ Error: Please provide a problem!', 'red');
      log('Usage: patrick quick "your problem here"\n', 'yellow');
      return;
    }

    const patrickInstance = new Patrick();

    if (!patrickInstance.apiKey) {
      log('\n❌ Error: ANTHROPIC_API_KEY not found', 'red');
      process.exit(1);
    }

    log('\n🌟 Patrick Quick Mode - One dumb shot!\n', 'pink');

    try {
      const solution = await patrickInstance.quickPush(problem);
      log('📝 Solution:', 'green');
      log(solution + '\n', 'reset');
    } catch (err) {
      log(`\n❌ Error: ${err.message}\n`, 'red');
    }
  }

  async handleCompare(args) {
    const problem = args.join(' ');

    if (!problem) {
      log('\n❌ Error: Please provide a problem!', 'red');
      log('Usage: patrick compare "your problem here"\n', 'yellow');
      return;
    }

    const patrickInstance = new Patrick();

    if (!patrickInstance.apiKey) {
      log('\n❌ Error: ANTHROPIC_API_KEY not found', 'red');
      process.exit(1);
    }

    log('\n╔════════════════════════════════════════════╗', 'pink');
    log('║      SMART CLAUDE vs PATRICK - FIGHT! 🥊   ║', 'pink');
    log('╚════════════════════════════════════════════╝\n', 'pink');

    log('🧠 Running comparison...\n', 'cyan');

    try {
      const results = await patrickInstance.compare(problem);

      // Smart Claude
      log('📊 SMART CLAUDE:', 'purple');
      log(`⏱️  Time: ${(results.smartTime / 1000).toFixed(1)}s`, 'gray');
      log(results.smart, 'reset');

      log('\n' + '-'.repeat(50) + '\n', 'gray');

      // Patrick
      log('🌟 PATRICK MODE:', 'pink');
      log(`⏱️  Time: ${(results.patrickTime / 1000).toFixed(1)}s`, 'gray');
      log(results.patrick, 'reset');

      log('\n' + '='.repeat(50), 'gray');

      // Winner
      if (results.patrickTime < results.smartTime) {
        const speedup = (results.smartTime / results.patrickTime).toFixed(1);
        log(`\n🏆 PATRICK WINS! ${speedup}x faster!`, 'green');
        patrick("I'm helping! I'm helping!");
      } else {
        log('\n🧠 Smart Claude was faster this time', 'purple');
        patrick("Is this the Krusty Krab?");
      }
      log('');

    } catch (err) {
      log(`\n❌ Error: ${err.message}\n`, 'red');
    }
  }

  async showStats() {
    const fs = require('fs');
    const path = require('path');
    const { loadConfig } = require('./utils');
    const config = loadConfig();
    const logDir = config.logDir;

    if (!fs.existsSync(logDir)) {
      log('\n📊 No stats available yet', 'yellow');
      patrick("We haven't helped anyone yet!");
      return;
    }

    const files = fs.readdirSync(logDir).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      log('\n📊 No stats available yet', 'yellow');
      return;
    }

    let totalAttempts = 0;
    let solvedCount = 0;
    let totalTokens = 0;
    let totalProblems = files.length;

    files.forEach(file => {
      const data = JSON.parse(fs.readFileSync(path.join(logDir, file), 'utf8'));
      totalAttempts += data.attempts || 0;
      totalTokens += data.tokens || 0;
      if (data.solved) solvedCount++;
    });

    log('\n╔════════════════════════════════════════════╗', 'pink');
    log('║       PATRICK STATS - I HELPED! 🌟        ║', 'pink');
    log('╚════════════════════════════════════════════╝', 'pink');

    log(`\n📊 Total problems pushed: ${totalProblems}`, 'cyan');
    log(`✅ Successfully solved: ${solvedCount} (${Math.round(solvedCount/totalProblems*100)}%)`, 'green');
    log(`🔄 Average attempts: ${(totalAttempts/totalProblems).toFixed(1)}`, 'yellow');
    log(`💭 Total tokens used: ${totalTokens.toLocaleString()}`, 'gray');

    patrick(`I helped ${solvedCount} times with dumb solutions!`);
    log('');
  }

  showHelp() {
    log('\n╔════════════════════════════════════════════╗', 'pink');
    log('║     PATRICK PUSH PROTOCOL - HELP 🌟       ║', 'pink');
    log('╚════════════════════════════════════════════╝', 'pink');

    patrick("Hi! I'm Patrick! I solve problems by being dumb!");

    log('\n📚 Commands:', 'cyan');
    log('  patrick push "problem"     Interactive mode - tries dumb solutions', 'reset');
    log('  patrick quick "problem"    Quick mode - one dumb shot', 'reset');
    log('  patrick compare "problem"  Compare Smart vs Patrick', 'reset');
    log('  patrick stats              Show your Patrick stats', 'reset');
    log('  patrick help               Show this help', 'reset');

    log('\n🎯 Flags:', 'cyan');
    log('  --attempts N    Number of attempts (default: 5)', 'reset');
    log('  --auto          Auto-accept solutions', 'reset');
    log('  --verbose       Show detailed output', 'reset');

    log('\n💡 Examples:', 'cyan');
    log('  patrick push "optimize my database query"', 'yellow');
    log('  patrick quick "fix this bug"', 'yellow');
    log('  patrick compare "improve performance" --verbose', 'yellow');

    log('\n🧠 How Patrick Works:', 'cyan');
    log('  Patrick Mode = Anti-Intelligence', 'reset');
    log('  • NO analysis phase', 'reset');
    log('  • NO "let me think about this"', 'reset');
    log('  • Just tries DUMB solutions', 'reset');
    log('  • Often faster than Smart Claude!', 'reset');

    log('\n🌐 Links:', 'cyan');
    log('  Website: https://patrickcoin.org', 'reset');
    log('  Docs: https://github.com/firestorm/patrick-push', 'reset');

    patrick("The dumber, the better!");
    log('');
  }

  showVersion() {
    const packageJson = require('../package.json');
    log(`\n🌟 Patrick Push Protocol v${packageJson.version}`, 'pink');
    patrick(`Version ${packageJson.version} - Now with EXTRA dumb!`);
    log('');
  }
}

const cli = new PatrickCLI();
cli.run().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
