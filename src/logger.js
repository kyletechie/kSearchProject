import winston from 'winston';
import colors from "../src/colors.js";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(), // adds color to level
    winston.format.timestamp({ format: 'H:mm:ss' }), // timestamp format
    winston.format.printf(({ level, message, timestamp }) => {
      return `${colors.blue}[${timestamp}]${colors.reset} ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
