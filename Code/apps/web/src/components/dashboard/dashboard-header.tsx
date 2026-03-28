'use client';

import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Medal, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { cn } from '@/lib/utils';

const NAV_ITEMS: Record<string, { href: string; label: string; icon: React.ElementType }[]> = {
  STUDENT: [
    { href: '/s/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/s/classes', label: 'Classes', icon: BookOpen },
    { href: '/s/leaderboard', label: 'Leaderboard', icon: Medal },
    { href: '/s/achievements', label: 'Achievements', icon: Trophy },
  ],
  TEACHER: [
    { href: '/t/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/t/classes', label: 'Classes', icon: BookOpen },
    { href: '/t/students', label: 'Students', icon: Users },
  ],
  SCHOOL_ADMIN: [
    { href: '/a/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ],
  TECH_ADMIN: [
    { href: '/a/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ],
};

export function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) return null;

  const role = session.user.role as string;
  const navItems = NAV_ITEMS[role] ?? [];
  const initials = (session.user.name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <GraduationCap className="h-5 w-5 text-primary" />
          EduMind
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
      </div>
    </header>
  );
}
