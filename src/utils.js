/**
 * Patrick Utilities
 * Helper functions for the Patrick Push Protocol
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.patrick');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const LOG_DIR = path.join(os.homedir(), '.patrick-logs');

const DEFAULT_CONFIG = {
  apiKey: null,
  maxAttempts: 5,
  autoSave: true,
  logDir: LOG_DIR
};

const COLORS = {
  reset: '\x1b[0m',
  pink: '\x1b[95m',
  cyan: '\x1b[96m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  red: '\x1b[91m',
  gray: '\x1b[90m',
  purple: '\x1b[35m'
};

/**
 * Log with color
 */
function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

/**
 * Patrick speaks!
 */
function patrick(message) {
  log(`\n🌟 Patrick: "${message}"`, 'pink');
}

/**
 * Ensure config directory exists
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Ensure log directory exists
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * Load configuration
 */
function loadConfig() {
  ensureConfigDir();

  if (!fs.existsSync(CONFIG_FILE)) {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }

  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (err) {
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration
 */
function saveConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Get a config value
 */
function getConfig(key) {
  const config = loadConfig();
  return config[key];
}

/**
 * Set a config value
 */
function setConfig(key, value) {
  const config = loadConfig();
  config[key] = value;
  saveConfig(config);
}

/**
 * Save a log of the Patrick session
 */
function saveLog(problem, solution, solved, attempts, tokens = 0) {
  const config = loadConfig();

  if (!config.autoSave) return;

  ensureLogDir();

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const logFile = path.join(LOG_DIR, `patrick-${timestamp}.json`);

  const logData = {
    timestamp: new Date().toISOString(),
    problem,
    solved,
    solution,
    attempts,
    tokens,
    mode: 'patrick' // To distinguish from other modes
  };

  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));

  if (process.env.PATRICK_VERBOSE) {
    log(`📄 Log saved to: ${logFile}`, 'gray');
  }
}

/**
 * Get Patrick's mood based on success rate
 */
function getPatrickMood() {
  ensureLogDir();

  const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    return 'neutral';
  }

  const recentFiles = files.slice(-10); // Last 10 attempts
  let solvedCount = 0;

  recentFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(LOG_DIR, file), 'utf8'));
    if (data.solved) solvedCount++;
  });

  const successRate = solvedCount / recentFiles.length;

  if (successRate >= 0.8) return 'happy';
  if (successRate >= 0.5) return 'neutral';
  return 'confused';
}

/**
 * Format time duration
 */
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

/**
 * Format token count
 */
function formatTokens(tokens) {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(1)}M`;
}

/**
 * Truncate text for display
 */
function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

module.exports = {
  log,
  patrick,
  saveLog,
  loadConfig,
  saveConfig,
  getConfig,
  setConfig,
  getPatrickMood,
  formatDuration,
  formatTokens,
  truncate,
  colors: COLORS
};
