'use client';

import { Palette, User } from 'lucide-react';
import Link from 'next/link';

import { MotionPage } from '@/components/motion/motion-page';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsPage() {
  return (
    <MotionPage className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Choose a theme that fits your style. Your preference is saved to your account.
            </p>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Profile link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Update your name and other profile information.
            </p>
            <Link href="/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
