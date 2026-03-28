import {
  BookOpen,
  Bot,
  GraduationCap,
  LayoutDashboard,
  Medal,
  Settings,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  STUDENT: [
    { href: '/s/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/s/classes', label: 'Classes', icon: BookOpen },
    { href: '/s/tutor', label: 'AI Tutor', icon: Bot },
    { href: '/s/leaderboard', label: 'Leaderboard', icon: Medal },
    { href: '/s/achievements', label: 'Achievements', icon: Trophy },
    { href: '/s/settings', label: 'Settings', icon: Settings },
  ],
  TEACHER: [
    { href: '/t/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/t/classes', label: 'Classes', icon: BookOpen },
    { href: '/t/ai', label: 'AI Assistant', icon: Sparkles },
    { href: '/t/students', label: 'Students', icon: Users },
    { href: '/t/settings', label: 'Settings', icon: Settings },
  ],
  SCHOOL_ADMIN: [
    { href: '/a/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/a/classes', label: 'Classes', icon: BookOpen },
    { href: '/a/users', label: 'Users', icon: Users },
    { href: '/a/settings', label: 'Settings', icon: Settings },
  ],
  TECH_ADMIN: [
    { href: '/a/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/a/settings', label: 'Settings', icon: Settings },
  ],
};

export const LOGO_ICON = GraduationCap;
