'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GRADE_YEARS = [
  'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6',
  'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12',
] as const;

interface InviteInfo {
  role: string;
  tenant: { id: string; name: string };
  class: { id: string; name: string; subject: string } | null;
  email: string | null;
}

export function JoinForm({ code }: { code: string }) {
  const router = useRouter();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [gradeYear, setGradeYear] = useState('GRADE_7');

  const { register, handleSubmit } = useForm({
    defaultValues: { email: '', password: '', firstName: '', lastName: '' },
  });

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(`/api/join/${code}`);
        const json = await res.json();
        if (json.success) {
          setInvite(json.data);
        } else {
          setError(json.message || 'Invalid invite');
        }
      } catch {
        setError('Failed to validate invite');
      } finally {
        setIsFetching(false);
      }
    }
    fetchInvite();
  }, [code]);

  async function onSubmit(data: { email: string; password: string; firstName: string; lastName: string }) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/join/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, gradeYear }),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to join');
        return;
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success('Account created! Please sign in.');
        router.push('/login');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
          <Button variant="link" onClick={() => router.push('/login')} className="mt-4">
            Go to login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!invite) return null;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Join {invite.tenant.name}</CardTitle>
        <div className="flex justify-center gap-2 pt-2">
          <Badge>{invite.role}</Badge>
          {invite.class && <Badge variant="outline">{invite.class.name}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} disabled={isLoading} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} disabled={isLoading} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={isLoading}
              required
              defaultValue={invite.email || ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 8 characters"
              {...register('password')}
              disabled={isLoading}
              required
              minLength={8}
            />
          </div>

          {invite.role === 'STUDENT' && (
            <div className="space-y-2">
              <Label>Grade Year</Label>
              <Select value={gradeYear} onValueChange={setGradeYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_YEARS.map((g) => (
                    <SelectItem key={g} value={g}>
                      Grade {g.replace('GRADE_', '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
