import { ForbiddenError, UnauthorizedError } from '@/lib/errors';
import { UserSession } from '@/types';

/**
 * Verifies that a user session has the required role.
 */
export function requireRole(session: UserSession | null, allowedRoles: ('admin' | 'staff' | 'customer')[]) {
  if (!session) {
    throw new UnauthorizedError('You must be signed in to perform this action');
  }

  if (!allowedRoles.includes(session.role)) {
    throw new ForbiddenError(`Role '${session.role}' is not authorized for this resource`);
  }

  return true;
}

export function requireAdmin(session: UserSession | null) {
  return requireRole(session, ['admin']);
}
