import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { UserRole } from './rbac';
import { logger } from '@/lib/logger';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'CUSTOMER',
  isAdmin: false,
  isLoading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  refreshSession: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfileAndRole = async (userId: string, email: string): Promise<{ profile: any; userRole: UserRole }> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { profile: null, userRole: 'CUSTOMER' };

    try {
      // 1. Fetch profile
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single();

      // 2. Check if user is in admin_users
      const { data: adminRecord } = await (supabase.from('admin_users') as any)
        .select('role, is_active')
        .eq('id', userId)
        .single();

      const userRole: UserRole = adminRecord && adminRecord.is_active ? adminRecord.role : 'CUSTOMER';

      return { profile, userRole };
    } catch {
      return { profile: null, userRole: 'CUSTOMER' };
    }
  };

  const refreshSession = async () => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        setUser(null);
        setRole('CUSTOMER');
      } else {
        const { profile, userRole } = await fetchUserProfileAndRole(session.user.id, session.user.email || '');
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || session.user.user_metadata?.full_name || null,
          phone: profile?.phone || null,
          role: userRole,
        });
        setRole(userRole);
      }
    } catch (err) {
      logger.error('Error fetching auth session', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { profile, userRole } = await fetchUserProfileAndRole(session.user.id, session.user.email || '');
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || session.user.user_metadata?.full_name || null,
          phone: profile?.phone || null,
          role: userRole,
        });
        setRole(userRole);
      } else {
        setUser(null);
        setRole('CUSTOMER');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      await refreshSession();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone || '' },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create initial profile in profiles table
      if (data.user) {
        await (supabase.from('profiles') as any).upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        });
      }

      await refreshSession();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole('CUSTOMER');
  };

  const isAdmin = role !== 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
