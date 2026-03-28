'use client';

import { Check, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
}

export function InviteStudentDialog({ open, onOpenChange, classId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  async function generateInvite() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/classes/${classId}/invite`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setInviteCode(json.data.code);
      } else {
        toast.error(json.message || 'Failed to generate invite');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/join/${inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInviteCode('');
      setCopied(false);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Students</DialogTitle>
          <DialogDescription>
            Generate an invite link for students to join this class
          </DialogDescription>
        </DialogHeader>

        {!inviteCode ? (
          <Button onClick={generateInvite} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Invite Link
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invite Code</Label>
              <div className="flex gap-2">
                <Input value={inviteCode} readOnly />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Invite Link</Label>
              <div className="flex gap-2">
                <Input
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/join/${inviteCode}`}
                  readOnly
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This invite expires in 7 days and can be used up to 30 times.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
