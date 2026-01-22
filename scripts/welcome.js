#!/usr/bin/env node

/**
 * Patrick Push Protocol - Post-Install Welcome Message
 */

const colors = {
  pink: '\x1b[95m',
  cyan: '\x1b[96m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  reset: '\x1b[0m'
};

const { pink, cyan, green, yellow, reset } = colors;

console.log(`
${pink}╔════════════════════════════════════════════════════════╗
║                                                        ║
║       🌟 PATRICK PUSH PROTOCOL INSTALLED! 🌟          ║
║                                                        ║
║    "We should take your problem and PUSH it           ║
║              somewhere else!"                         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝${reset}

${cyan}Thanks for installing Patrick Push Protocol!${reset}

${green}✅ What is Patrick?${reset}
   Patrick Mode = Anti-Intelligence AI
   Makes Claude DUMBER on purpose for faster solutions!

${green}✅ Quick Start:${reset}
   ${yellow}1.${reset} Set your API key:
      ${cyan}export ANTHROPIC_API_KEY=your_key_here${reset}
   
   ${yellow}2.${reset} Try Patrick:
      ${cyan}patrick push "optimize my slow query"${reset}
   
   ${yellow}3.${reset} See the magic:
      ${cyan}patrick compare "fix this bug"${reset}

${green}✅ Commands:${reset}
   ${cyan}patrick push <problem>${reset}     - Interactive mode (tries multiple solutions)
   ${cyan}patrick quick <problem>${reset}    - One-shot dumb solution
   ${cyan}patrick compare <problem>${reset}  - Smart Claude vs Patrick
   ${cyan}patrick stats${reset}              - Your Patrick statistics
   ${cyan}patrick help${reset}               - Full help

${green}✅ Join the Community:${reset}
   🌐 Website:  ${cyan}https://patrickcoin.org${reset}
   🐦 Twitter:  ${cyan}@patrickcoin${reset}
   💰 Token:    ${cyan}$PATRICK${reset} (coming soon!)

${pink}🌟 Patrick: "I'm helping! I'm helping!"${reset}

${yellow}Tip: Patrick works best on quick fixes, debugging, and when
     Smart Claude is overthinking things!${reset}

`);

// Check for API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.log(`${yellow}⚠️  Don't forget to set your ANTHROPIC_API_KEY!${reset}
   ${cyan}export ANTHROPIC_API_KEY=your_key_here${reset}
`);
}
