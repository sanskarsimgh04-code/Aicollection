import { AdminRole } from '@/types/database';
export type { AdminRole };
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export type UserRole = AdminRole | 'CUSTOMER';

/**
 * Role hierarchy levels
 */
export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  MANAGER: 60,
  ORDER_MANAGER: 40,
  CONTENT_MANAGER: 40,
};

/**
 * Permissions mapping for fine-grained authorization
 */
export const PERMISSIONS = {
  MANAGE_ROLES: ['SUPER_ADMIN'] as AdminRole[],
  MANAGE_SETTINGS: ['SUPER_ADMIN', 'ADMIN'] as AdminRole[],
  VIEW_AUDIT_LOGS: ['SUPER_ADMIN', 'ADMIN'] as AdminRole[],
  MANAGE_ORDERS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ORDER_MANAGER'] as AdminRole[],
  MANAGE_CATALOG: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] as AdminRole[],
  MANAGE_CONTENT: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'] as AdminRole[],
  MANAGE_COUPONS: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] as AdminRole[],
};

/**
 * Checks if a given role is allowed in the allowed roles list.
 */
export function hasRole(role: UserRole | null | undefined, allowedRoles: (AdminRole | 'CUSTOMER')[]): boolean {
  if (!role) return false;
  return allowedRoles.includes(role);
}

/**
 * STRICT SERVER-SIDE AUTHORIZATION:
 * Queries the database directly using the admin client to retrieve the authentic role.
 * NEVER trusts frontend claims or unverified JWT claims.
 */
export async function getServerUserRole(userId: string): Promise<UserRole> {
  if (!userId) return 'CUSTOMER';

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    // In local development without Supabase credentials, fail closed or return customer
    return 'CUSTOMER';
  }

  try {
    const { data, error } = await (adminClient.from('admin_users') as any)
      .select('role, is_active')
      .eq('id', userId)
      .single();

    if (error || !data || !data.is_active) {
      return 'CUSTOMER';
    }

    return data.role as AdminRole;
  } catch (err) {
    logger.error('Failed to verify user role in database', err, { userId });
    return 'CUSTOMER';
  }
}

/**
 * Verifies that a user has one of the allowed admin roles.
 * Throws ForbiddenError or UnauthorizedError on failure.
 */
export async function assertServerAdmin(
  userId: string | undefined | null,
  allowedRoles?: AdminRole[]
): Promise<AdminRole> {
  if (!userId) {
    throw new UnauthorizedError('Authentication required: Missing user session');
  }

  const role = await getServerUserRole(userId);

  if (role === 'CUSTOMER') {
    logger.warn('Unauthorized admin access attempt', { userId, attemptedRoles: allowedRoles });
    throw new ForbiddenError('Access denied: User is not an authorized administrator');
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role as AdminRole)) {
    logger.warn('Insufficient administrative privilege', {
      userId,
      userRole: role,
      requiredRoles: allowedRoles,
    });
    throw new ForbiddenError(`Access denied: Requires one of [${allowedRoles.join(', ')}]`);
  }

  return role as AdminRole;
}
