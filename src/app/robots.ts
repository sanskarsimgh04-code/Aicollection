import { SITE_CONFIG } from '@/config/site';

export function getRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

Sitemap: ${SITE_CONFIG.url}/sitemap.xml
`;
}
