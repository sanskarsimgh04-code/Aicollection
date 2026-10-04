import { SITE_CONFIG } from '@/config/site';

export function AnnouncementBar() {
  if (!SITE_CONFIG.announcement.enabled) return null;

  return (
    <div className="bg-[#111111] text-white py-2 px-4 text-center text-xs font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] inline-block animate-pulse" />
        <span>{SITE_CONFIG.announcement.text}</span>
      </div>
    </div>
  );
}
