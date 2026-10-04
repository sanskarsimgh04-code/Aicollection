import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  searchParams: URLSearchParams;
  params: Record<string, string>;
  push: (href: string) => void;
  replace: (href: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  searchParams: new URLSearchParams(),
  params: {},
  push: () => {},
  replace: () => {},
});

export function useRouter() {
  const ctx = useContext(RouterContext);
  return {
    push: ctx.push,
    replace: ctx.replace,
  };
}

export function usePathname() {
  const ctx = useContext(RouterContext);
  return ctx.pathname;
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const ctx = useContext(RouterContext);
  return ctx.params as T;
}

export function useSearchParams() {
  const ctx = useContext(RouterContext);
  return ctx.searchParams;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, onClick, ...props }, ref) => {
    const { push } = useContext(RouterContext);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      if (
        !e.defaultPrevented &&
        e.button === 0 && // left click only
        (!props.target || props.target === '_self') && // not new tab
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        push(href);
      }
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }
);
Link.displayName = 'Link';

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentUrl, setCurrentUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href);
      setCurrentUrl(href);
      window.scrollTo(0, 0);
    }
  }, []);

  const replace = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', href);
      setCurrentUrl(href);
    }
  }, []);

  // Compute pathname & query
  const [pathname, search] = currentUrl.split('?');
  const searchParams = new URLSearchParams(search || '');

  // Extract dynamic params (like /category/[slug], /product/[slug], /order/[id], /account/orders/[id])
  const params: Record<string, string> = {};
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'category' && segments[1]) {
    params.slug = segments[1];
  } else if (segments[0] === 'product' && segments[1]) {
    params.slug = segments[1];
  } else if (segments[0] === 'order' && segments[1]) {
    params.id = segments[1];
  } else if (segments[0] === 'account' && segments[1] === 'orders' && segments[2]) {
    params.id = segments[2];
  }

  return (
    <RouterContext.Provider value={{ pathname, searchParams, params, push, replace }}>
      {children}
    </RouterContext.Provider>
  );
}
