import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in React component tree', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FAFAF8]">
          <div className="max-w-md w-full bg-white rounded-[14px] border border-[#E5E7EB] p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#171717] tracking-tight">Something went wrong</h2>
            <p className="text-sm text-[#6B7280] mt-2 mb-6">
              An unexpected error occurred while rendering this view. Our team has been notified.
            </p>
            {this.state.error && process.env.NODE_ENV !== 'production' && (
              <pre className="text-left text-xs bg-gray-50 p-3 rounded-[9px] border border-gray-200 text-[#DC2626] overflow-x-auto mb-6 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Try again
              </Button>
              <a href="/">
                <Button variant="primary" className="w-full flex items-center gap-2">
                  <Home className="w-4 h-4" /> Return to Shop
                </Button>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
