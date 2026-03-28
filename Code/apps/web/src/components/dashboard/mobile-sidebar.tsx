'use client';

import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

import { LOGO_ICON, NAV_ITEMS } from './sidebar-nav-config';

export function MobileSidebar() {
  const { data: session } = useSession();
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  if (!session?.user) return null;

  const role = session.user.role as string;
  const navItems = NAV_ITEMS[role] ?? [];
  const initials = (session.user.name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
  const LogoIcon = LOGO_ICON;

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="relative z-50 flex w-72 flex-col bg-card shadow-lg">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b px-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <LogoIcon className="h-6 w-6 text-primary" />
                <span className="font-bold">EduMind</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User */}
            <div className="border-t p-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{session.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="mt-1 w-full justify-start text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
