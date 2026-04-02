'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { SKILL_RARITY_LABELS, SKILL_RARITY_COLORS, SKILL_TYPE_CONFIG } from '@edumind/shared';

interface RequirementCheck {
  key: string;
  label: string;
  required: number;
  current: number;
  met: boolean;
}

interface SkillDetailData {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  mpCost: number;
  staCost: number;
  power: number;
  hitCount: number;
  cooldown: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effects: any;
  primarySubject: string | null;
  unlockCheck: { unlocked: boolean; requirements: RequirementCheck[] };
  learned: { id: string; isEquipped: boolean; equipSlot: number | null; masteryLevel: number } | null;
}

interface SkillDetailModalProps {
  skillId: string | null;
  open: boolean;
  onClose: () => void;
  onAction?: () => void;
}

export function SkillDetailModal({ skillId, open, onClose, onAction }: SkillDetailModalProps) {
  const [data, setData] = useState<SkillDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (!skillId || !open) return;
    setIsLoading(true);
    fetch(`/api/skills/${skillId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .finally(() => setIsLoading(false));
  }, [skillId, open]);

  async function handleLearn() {
    if (!data) return;
    setIsActing(true);
    try {
      const res = await fetch('/api/skills/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: data.id }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Learned ${data.name}!`);
        onAction?.();
        onClose();
      } else {
        toast.error(json.message || 'Failed to learn skill');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsActing(false);
    }
  }

  async function handleEquip(slot: number) {
    if (!data) return;
    setIsActing(true);
    try {
      const res = await fetch('/api/skills/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: data.id, slot }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Equipped ${data.name} to slot ${slot}`);
        onAction?.();
        onClose();
      } else {
        toast.error(json.message || 'Failed to equip');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsActing(false);
    }
  }

  async function handleUnequip() {
    if (!data) return;
    setIsActing(true);
    try {
      const res = await fetch('/api/skills/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: data.id, slot: null }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Unequipped ${data.name}`);
        onAction?.();
        onClose();
      } else {
        toast.error(json.message || 'Failed to unequip');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsActing(false);
    }
  }

  const typeConfig = data ? SKILL_TYPE_CONFIG[data.type] : null;
  const rarityColor = data ? (SKILL_RARITY_COLORS[data.rarity] ?? '') : '';
  const rarityLabel = data ? (SKILL_RARITY_LABELS[data.rarity] ?? '') : '';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        {isLoading || !data ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {typeConfig && <span>{typeConfig.icon}</span>}
                {data.name}
              </DialogTitle>
              <DialogDescription>{data.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Badges */}
              <div className="flex gap-2">
                {typeConfig && (
                  <Badge variant="outline" className={typeConfig.color}>
                    {typeConfig.label}
                  </Badge>
                )}
                <Badge variant="outline" className={rarityColor}>
                  {rarityLabel}
                </Badge>
                {data.primarySubject && (
                  <Badge variant="secondary" className="text-xs">
                    {data.primarySubject.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {data.mpCost > 0 && (
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-xs text-muted-foreground">MP Cost</p>
                    <p className="text-sm font-bold text-blue-400">{data.mpCost}</p>
                  </div>
                )}
                {data.staCost > 0 && (
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-xs text-muted-foreground">STA Cost</p>
                    <p className="text-sm font-bold text-green-400">{data.staCost}</p>
                  </div>
                )}
                {data.power > 0 && (
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-xs text-muted-foreground">Power</p>
                    <p className="text-sm font-bold text-orange-400">
                      {data.power}%{data.hitCount > 1 ? ` ×${data.hitCount}` : ''}
                    </p>
                  </div>
                )}
                {data.cooldown > 0 && (
                  <div className="rounded-lg border p-2 text-center">
                    <p className="text-xs text-muted-foreground">Cooldown</p>
                    <p className="text-sm font-bold">{data.cooldown} turns</p>
                  </div>
                )}
              </div>

              {/* Effects */}
              {data.effects && (data.effects as Record<string, unknown>).description && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <span className="font-medium">Effect: </span>
                  {String((data.effects as Record<string, string>).description ?? '')}
                </div>
              )}

              {/* Mastery */}
              {data.learned && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium">Mastery Level {data.learned.masteryLevel}</p>
                  {data.learned.isEquipped && (
                    <Badge className="mt-1" variant="default">Equipped (Slot {data.learned.equipSlot})</Badge>
                  )}
                </div>
              )}

              {/* Requirements */}
              {!data.learned && data.unlockCheck.requirements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold">Unlock Requirements</p>
                  {data.unlockCheck.requirements.map((req) => (
                    <div key={req.key}>
                      <div className="mb-0.5 flex items-center justify-between text-xs">
                        <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                          {req.met ? '✓' : '○'} {req.label}
                        </span>
                        <span>{req.current}/{req.required}</span>
                      </div>
                      <Progress value={Math.min(100, (req.current / req.required) * 100)} className="h-1" />
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {!data.learned && data.unlockCheck.unlocked && (
                  <Button className="flex-1" onClick={handleLearn} disabled={isActing}>
                    {isActing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Learn Skill
                  </Button>
                )}
                {data.learned && !data.learned.isEquipped && (
                  <Button className="flex-1" onClick={() => handleEquip(1)} disabled={isActing}>
                    Equip
                  </Button>
                )}
                {data.learned?.isEquipped && (
                  <Button variant="outline" className="flex-1" onClick={handleUnequip} disabled={isActing}>
                    Unequip
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
