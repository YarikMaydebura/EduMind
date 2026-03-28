'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

import { MobileSidebar } from './mobile-sidebar';
import { Sidebar } from './sidebar';
import { LOGO_ICON } from './sidebar-nav-config';

export function AppShell({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const LogoIcon = LOGO_ICON;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card px-4 md:hidden">
          <MobileSidebar />
          <LogoIcon className="h-5 w-5 text-primary" />
          <span className="font-bold">EduMind</span>
        </div>

        {/* Main content */}
        <main
          className={cn(
            'transition-[margin-left] duration-200 ease-in-out',
            isOpen ? 'md:ml-64' : 'md:ml-16',
          )}
        >
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
