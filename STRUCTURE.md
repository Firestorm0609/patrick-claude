# Patrick Push Protocol - Complete Package Structure

## Directory Layout

```
patrick-claude/
├── package.json              # NPM package configuration
├── README.md                 # Main documentation
├── LICENSE                   # MIT License
├── .gitignore               # Git ignore rules
├── .npmignore               # NPM ignore rules
├── bin/
│   └── patrick.js           # CLI entry point (executable)
├── src/
│   ├── patrick.js           # Core Patrick Mode implementation
│   ├── cli.js               # CLI interface and commands
│   └── utils.js             # Utility functions
├── scripts/
│   └── welcome.js           # Post-install welcome message
├── test/
│   └── patrick.test.js      # Test suite
└── examples/
    └── usage.md             # Usage examples

```

## File Descriptions

### Root Files

**`package.json`**
- NPM package metadata
- Dependencies (none - pure Node.js!)
- Binary entry point configuration
- Scripts for testing and installation

**`README.md`**
- Complete documentation
- Philosophy and origin story
- Command reference
- Examples and use cases

**`LICENSE`**
- MIT License
- Additional attribution notes

**`.gitignore`**
- Excludes node_modules, logs, local configs
- Keeps repository clean

**`.npmignore`**
- Excludes test files and dev docs from published package
- Keeps package size small

### `/bin` - Executables

**`patrick.js`**
- Shebang for CLI execution
- Entry point that loads the CLI module
- Makes `patrick` command available globally

### `/src` - Core Implementation

**`patrick.js`**
- **The heart of Patrick Mode**
- Patrick class with anti-intelligence implementation
- PATRICK_SYSTEM_PROMPT with the core innovation
- API communication logic
- Multiple attempt handling
- Smart vs Patrick comparison

**`cli.js`**
- PatrickCLI class
- Command parsing and routing
- Interactive prompts
- Beautiful terminal output
- Progress callbacks
- Stats and history display

**`utils.js`**
- Configuration management
- Logging system
- Color output helpers
- Patrick quotes database
- File system operations

### `/scripts` - Build Scripts

**`welcome.js`**
- Post-install message
- Quick start guide
- ASCII art Patrick logo
- API key reminder

### `/test` - Testing

**`patrick.test.js`**
- Unit tests for Patrick class
- Configuration tests
- Quote generation tests
- 10+ test cases

### `/examples` - Documentation

**`usage.md`** (to be created)
- Real-world examples
- Before/after comparisons
- Common use cases
- Tips and tricks

## Installation Flow

1. User runs: `npm install -g patrick-push`
2. NPM downloads and installs package
3. `postinstall` script runs `welcome.js`
4. User sees welcome message with setup instructions
5. Binary `patrick` is added to PATH
6. User can run `patrick` commands globally

## Usage Flow

1. User runs: `patrick push "problem"`
2. `bin/patrick.js` is executed
3. Loads `src/cli.js`
4. CLI parses command and flags
5. Creates Patrick instance from `src/patrick.js`
6. Patrick makes API calls with anti-intelligence prompt
7. Results displayed with colored output
8. Session logged to `~/.patrick-logs/`
9. Stats updated in `~/.patrick/config.json`

## Configuration Files (Created at Runtime)

**`~/.patrick/config.json`**
```json
{
  "apiKey": null,
  "maxAttempts": 5,
  "autoSave": true,
  "logDir": "~/.patrick-logs"
}
```

**`~/.patrick-logs/patrick-TIMESTAMP.json`**
```json
{
  "timestamp": "2025-01-22T...",
  "problem": "optimize slow query",
  "solved": true,
  "solution": "...",
  "attempts": 2,
  "tokens": 1234,
  "mode": "patrick"
}
```

## Development Workflow

### Local Testing
```bash
# Clone repo
git clone https://github.com/firestorm/patrick-push.git
cd patrick-push

# Test locally
node bin/patrick.js push "test problem"

# Run tests
npm test

# Link for local development
npm link
patrick push "test"
```

### Publishing
```bash
# Update version
npm version patch|minor|major

# Publish to NPM
npm publish

# Push to GitHub
git push origin main --tags
```

## Key Features Implementation

### Anti-Intelligence System Prompt
Located in: `src/patrick.js:26-48`

The core innovation that makes Patrick Mode work:
- Disables analytical overhead
- Enforces action bias
- Removes best practice filtering

### Multiple Attempt Logic
Located in: `src/patrick.js:109-180`

Patrick tries multiple times with fresh approaches:
- Tracks conversation history
- Handles rate limiting
- User satisfaction polling

### Beautiful CLI Output
Located in: `src/cli.js`

Colored terminal output with:
- Patrick quotes
- Progress indicators
- Success/failure messages
- Statistics display

### Comparison Mode
Located in: `src/patrick.js:202-245`

Side-by-side Smart Claude vs Patrick:
- Timing comparison
- Response quality
- Winner declaration

## Dependencies

**Runtime:** ZERO dependencies! 
- Pure Node.js (v14+)
- Uses only built-in modules:
  - `https` for API calls
  - `fs` for file operations
  - `path` for path handling
  - `os` for home directory
  - `readline` for prompts

**Development:** None needed!

## Environment Variables

**`ANTHROPIC_API_KEY`** (required)
- Your Anthropic API key
- Can also be set in `~/.patrick/config.json`

**`PATRICK_VERBOSE`** (optional)
- Enable verbose logging
- Shows file paths and extra details

## Token Integration (Future)

When $PATRICK token launches:

**Token Holder Benefits:**
- Unlimited pushes (no rate limits)
- Patrick remembers you (persistent memory)
- Advanced modes (genius mode)
- Priority support

**Token Burn Mechanics:**
- Each push burns small amount
- Deflationary tokenomics
- Integrated into CLI

## Publishing Checklist

Before publishing to NPM:

- [ ] Update version in package.json
- [ ] Test all commands locally
- [ ] Run test suite: `npm test`
- [ ] Update README with any changes
- [ ] Commit all changes to git
- [ ] Create git tag: `git tag v1.0.0`
- [ ] Publish: `npm publish`
- [ ] Push to GitHub: `git push origin main --tags`
- [ ] Announce on social media
- [ ] Update website with npm install instructions

## Support

- 🐛 Issues: https://github.com/firestorm/patrick-push/issues
- 💬 Discussions: https://github.com/firestorm/patrick-push/discussions
- 🌐 Website: https://patrickcoin.org
- 🐦 Twitter: @patrickcoin

---

🌟 **"The inner machinations of my mind are an enigma."** - Patrick Star
