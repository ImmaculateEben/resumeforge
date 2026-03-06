import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

interface AuditLogEntry {
  actorUserId: string;
  action: string;
  targetType: string;
  targetId?: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    await db.adminAuditLog.create({
      data: {
        actorUserId: entry.actorUserId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        beforeJson: entry.before as object,
        afterJson: entry.after as object,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    logger.error("Failed to create audit log", {
      error: String(error),
      action: entry.action,
      targetType: entry.targetType,
    });
  }
}
