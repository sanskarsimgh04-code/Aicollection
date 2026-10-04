import { ActionResponse } from './types';
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server';
import { getServerUserRole, UserRole } from '@/lib/auth/rbac';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: z.string().trim().optional(),
});

export async function verifyServerSession(
  accessToken?: string
): Promise<ActionResponse<{ userId: string; email: string; role: UserRole }>> {
  if (!accessToken) {
    return {
      success: false,
      error: { message: 'No authorization token provided', code: 'UNAUTHORIZED', statusCode: 401 },
    };
  }

  const client = getSupabaseServerClient(accessToken);
  if (!client) {
    return {
      success: false,
      error: { message: 'Database client unavailable', code: 'DB_UNAVAILABLE', statusCode: 503 },
    };
  }

  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) {
      return {
        success: false,
        error: { message: 'Invalid or expired session', code: 'UNAUTHORIZED', statusCode: 401 },
      };
    }

    const role = await getServerUserRole(user.id);

    return {
      success: true,
      data: {
        userId: user.id,
        email: user.email || '',
        role,
      },
    };
  } catch (err: any) {
    logger.error('Session verification error', err);
    return {
      success: false,
      error: { message: 'Authentication verification failed', code: 'AUTH_ERROR', statusCode: 500 },
    };
  }
}
