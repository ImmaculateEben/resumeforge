type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: string;
  route?: string;
  duration?: number;
  result?: string;
  [key: string]: unknown;
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  });
}

export const logger = {
  info(message: string, meta?: Omit<LogEntry, "level" | "message">) {
    console.log(formatLog({ level: "info", message, ...meta }));
  },
  warn(message: string, meta?: Omit<LogEntry, "level" | "message">) {
    console.warn(formatLog({ level: "warn", message, ...meta }));
  },
  error(message: string, meta?: Omit<LogEntry, "level" | "message">) {
    console.error(formatLog({ level: "error", message, ...meta }));
  },
  debug(message: string, meta?: Omit<LogEntry, "level" | "message">) {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatLog({ level: "debug", message, ...meta }));
    }
  },
};
