import { Button } from '@/components/ui/button';
import { RefreshCw, Home, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-[14px] bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center font-bold text-xl mb-6">
        !
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-[#6B7280] max-w-md leading-relaxed">
        We encountered an error processing your request. Please try again or reach out to our team if the issue persists.
      </p>

      {error?.message && process.env.NODE_ENV !== 'production' && (
        <p className="mt-4 text-xs font-mono bg-red-50 text-[#DC2626] p-3 rounded-[9px] border border-red-100 max-w-md overflow-x-auto text-left">
          {error.message}
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {reset && (
          <Button onClick={reset} variant="primary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        )}
        <a href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" /> Return Home
          </Button>
        </a>
        <a href={`mailto:${SITE_CONFIG.contact.email}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Contact Support
          </Button>
        </a>
      </div>
    </div>
  );
}
