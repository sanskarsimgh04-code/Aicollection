import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
  adminNotice?: boolean;
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin', adminNotice = false }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (tab === 'signin') {
      const res = await signIn(email, password);
      setIsLoading(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } else {
      const res = await signUp(email, password, fullName, phone);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Account created! Please check your email for confirmation.');
        setTimeout(() => onClose(), 2000);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-[14px] border border-[#E5E7EB] shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#6B7280] hover:text-[#171717] rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-6">
          <div className="w-10 h-10 rounded-[9px] bg-[#111111] text-white flex items-center justify-center mx-auto mb-2 font-bold text-sm">
            A1
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#171717]">
            {tab === 'signin' ? 'Sign In to A1 Collection' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {adminNotice
              ? 'Administrator authentication required to access this portal.'
              : 'Access your order history and personalized preferences.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E5E7EB] mb-6">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMessage(null); }}
            className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'signin'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setErrorMessage(null); }}
            className={`flex-1 pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'signup'
                ? 'border-[#111111] text-[#111111]'
                : 'border-transparent text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-[#DC2626] border border-red-200 rounded-[9px] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] rounded-[9px] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <>
              <Input
                label="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Eleanor Vance"
                required
              />
              <Input
                label="Phone Number (for order confirmation)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </>
          )}

          <Input
            label="Email Address *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="eleanor@example.com"
            required
          />

          <Input
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            {tab === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
