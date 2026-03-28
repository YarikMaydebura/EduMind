'use client';

import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

import { SidebarNavItem } from './sidebar-nav-item';
import { LOGO_ICON, NAV_ITEMS } from './sidebar-nav-config';

export function Sidebar({ className }: { className?: string }) {
  const { data: session } = useSession();
  const isOpen = useSidebarStore((s) => s.isOpen);
  const toggle = useSidebarStore((s) => s.toggle);

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
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-[width] duration-200',
        isOpen ? 'w-64' : 'w-16',
        className,
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-14 items-center border-b px-4', !isOpen && 'justify-center px-2')}>
        <Link href="/" className="flex items-center gap-2">
          <LogoIcon className="h-6 w-6 shrink-0 text-primary" />
          {isOpen && <span className="font-bold text-foreground">EduMind</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <SidebarNavItem key={item.href} item={item} collapsed={!isOpen} />
        ))}
      </nav>

      {/* User section */}
      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted',
                !isOpen && 'justify-center',
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              {isOpen && (
                <div className="min-w-0 text-left">
                  <p className="truncate font-medium text-foreground">{session.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{role.replace(/_/g, ' ')}</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isOpen ? 'top' : 'right'} align="start" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        {isOpen ? (
          <Button variant="ghost" size="sm" onClick={toggle} className="w-full justify-start gap-2">
            <ChevronLeft className="h-4 w-4" />
            Collapse
          </Button>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggle} className="w-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand</TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
