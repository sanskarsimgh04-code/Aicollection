import React, { useState, ReactNode } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AuthModal } from './auth-modal';
import { ShieldAlert, Lock, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from '@/router';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protects customer account routes (/account, /account/orders)
 */
export function ProtectedAccountRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] text-[#111111] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#171717]">Sign In to View Account</h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Please sign in with your email and password to track active orders, view past receipts, and update your delivery preferences.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Sign In / Sign Up
            </Button>
            <Link href="/shop">
              <Button variant="outline" className="w-full sm:w-auto">
                Return to Shop
              </Button>
            </Link>
          </div>

          <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * STRICT: Protects administrative routes (/admin/*)
 * Requires genuine administrator role.
 * Anonymous or customer sessions CANNOT access admin views or data.
 */
export function ProtectedAdminRoute({ children }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FAFAF8]">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#171717]">
            Administrative Access Restricted
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Access to the A1 Collection management portal requires authorized administrative credentials (SUPER_ADMIN, ADMIN, MANAGER, ORDER_MANAGER, or CONTENT_MANAGER).
          </p>

          {user && !isAdmin && (
            <div className="p-3 rounded-[9px] bg-amber-50 text-[#92400E] border border-amber-200 text-xs">
              Logged in as <strong>{user.email}</strong> (Role: Customer). Customer accounts cannot access the admin portal.
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Admin Login
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back to Store
              </Button>
            </Link>
          </div>

          <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} adminNotice={true} />
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
