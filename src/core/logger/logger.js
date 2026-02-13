const winston = require("winston");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Get log level based on environment
 */
const getLogLevel = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

const isVercel = Boolean(process.env.VERCEL);
const logDir = isVercel ? "/tmp/logs" : path.join(process.cwd(), "logs");

let fileTransports = [];
try {
  fs.mkdirSync(logDir, { recursive: true });
  fileTransports = [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ];
} catch (err) {
  // If filesystem is read-only, continue with console-only logging.
}

// Configure winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || getLogLevel(),
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: () =>
        moment()
          .tz(process.env.TIME_ZONE || "Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "website-monitor" },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    ...fileTransports,
  ],
});

module.exports = logger;
