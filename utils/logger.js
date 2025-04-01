const winston = require('winston');
const path = require('path');

// Create a logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Write to all logs with level 'info' and below to combined.log
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs error (and above) to error.log
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Obfuscate sensitive data
const obfuscateSensitiveData = (data) => {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
    const obfuscated = { ...data };
    
    sensitiveFields.forEach(field => {
        if (obfuscated[field]) {
            obfuscated[field] = '********';
        }
    });
    
    return obfuscated;
};

module.exports = {
    logger,
    obfuscateSensitiveData
}; 