// backend/src/utils/logger.js
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const logger = {
    info: (message) => {
        console.log(`${colors.blue}ℹ️  INFO: ${message}${colors.reset}`);
    },
    success: (message) => {
        console.log(`${colors.green}✅ SUCCESS: ${message}${colors.reset}`);
    },
    warning: (message) => {
        console.log(`${colors.yellow}⚠️  WARNING: ${message}${colors.reset}`);
    },
    error: (message) => {
        console.log(`${colors.red}❌ ERROR: ${message}${colors.reset}`);
    },
    debug: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${colors.magenta}🐛 DEBUG: ${message}${colors.reset}`);
        }
    }
};

module.exports = logger;