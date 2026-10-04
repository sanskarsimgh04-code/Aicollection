import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { isSupabaseAdminConfigured } from '@/lib/supabase/status';

export interface AuditLogPayload {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  diff?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Records an immutable audit log entry in the database.
 * Used for sensitive admin operations (e.g. order status transitions, settings modifications,
 * price overrides, role assignments).
 */
export async function recordAuditLog(payload: AuditLogPayload): Promise<void> {
  // Always log to structured server logger with redaction
  logger.info(`[AUDIT] ${payload.action} on ${payload.resourceType}:${payload.resourceId || 'global'}`, {
    module: 'AuditLog',
    actorRole: payload.actorRole,
    actorEmail: payload.actorEmail,
    action: payload.action,
    resourceType: payload.resourceType,
    resourceId: payload.resourceId,
  });

  if (!isSupabaseAdminConfigured()) {
    return;
  }

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return;

  try {
    const { error } = await (adminClient.from('audit_logs') as any).insert({
      actor_id: payload.actorId || null,
      actor_email: payload.actorEmail || null,
      actor_role: payload.actorRole,
      action: payload.action,
      resource_type: payload.resourceType,
      resource_id: payload.resourceId || null,
      diff: payload.diff || null,
      ip_address: payload.ipAddress || null,
      user_agent: payload.userAgent || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      logger.error('Failed to persist audit log entry to database', error);
    }
  } catch (err) {
    logger.error('Unexpected error while recording audit log', err);
  }
}
