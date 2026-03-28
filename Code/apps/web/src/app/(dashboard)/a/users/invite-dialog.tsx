'use client';

import { Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function InviteDialog({ open, onOpenChange, onCreated }: InviteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'TEACHER' | 'STUDENT' | 'PARENT'>('STUDENT');
  const [email, setEmail] = useState('');
  const [maxUses, setMaxUses] = useState(30);
  const [generatedCode, setGeneratedCode] = useState('');

  async function handleCreate() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          email: email || undefined,
          maxUses,
          expiresInDays: 7,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setGeneratedCode(json.data.code);
        toast.success('Invite created');
        onCreated();
      } else {
        toast.error(json.message || 'Failed to create invite');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function copyLink() {
    const link = `${window.location.origin}/join/${generatedCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  }

  function handleClose(open: boolean) {
    if (!open) {
      setGeneratedCode('');
      setEmail('');
      setRole('STUDENT');
      setMaxUses(30);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invite</DialogTitle>
          <DialogDescription>Generate an invite link for new users</DialogDescription>
        </DialogHeader>

        {generatedCode ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted p-4 text-center">
              <p className="mb-1 text-sm text-muted-foreground">Invite Code</p>
              <p className="text-2xl font-bold tracking-wider">{generatedCode}</p>
            </div>
            <Button onClick={copyLink} className="w-full" variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy Invite Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2">
                {(['STUDENT', 'TEACHER', 'PARENT'] as const).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Restrict to specific email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min={1}
                max={500}
                value={maxUses}
                onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {!generatedCode && (
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Invite
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
