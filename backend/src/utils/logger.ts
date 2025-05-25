import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
}

// Define log colors
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
  trace: "magenta",
}

// Add colors to winston
winston.addColors(logColors)

// Get log level from environment
const logLevel = process.env.LOG_LEVEL || "info"

// Create formatters
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    return `${timestamp} [${level}]: ${message} ${metaStr}`
  }),
)

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
)

// Create transports
const transports: winston.transport[] = [
  new winston.transports.Console({
    level: logLevel,
    format: consoleFormat,
  }),
]

// Add file transport if enabled
const logFileEnabled = process.env.LOG_FILE_ENABLED === "true"
if (logFileEnabled) {
  transports.push(
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: logLevel,
      format: fileFormat,
    }),
  )

  transports.push(
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      format: fileFormat,
    }),
  )
}

// Create logger instance
export const logger = winston.createLogger({
  levels: logLevels,
  level: logLevel,
  transports,
  exitOnError: false,
})

// Add request logging helper
export const logRequest = (req: any, res: any, next: any) => {
  const start = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  logger.info("Incoming request", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  })

  res.on("finish", () => {
    const duration = Date.now() - start
    logger.info("Request completed", {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    })
  })

  next()
}

// Export default logger
export default logger
