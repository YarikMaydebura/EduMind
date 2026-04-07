'use client';

import { Backpack, Loader2, Shield, Sword, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  consumable: boolean;
  quantity: number;
  isEquipped?: boolean;
  equipSlot?: string;
}

interface EquipmentSlots {
  weapon: { name: string } | null;
  armor: { name: string } | null;
  accessory: { name: string } | null;
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [equipped, setEquipped] = useState<EquipmentSlots>({ weapon: null, armor: null, accessory: null });
  const [isLoading, setIsLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'equipment' | 'consumables'>('all');

  const loadInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory');
      const json = await res.json();
      if (json.success) {
        setItems(json.data.items);
        setEquipped(json.data.equipped);
      }
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void loadInventory(); }, [loadInventory]);

  async function handleEquip(itemId: string, action: 'equip' | 'unequip') {
    setActingId(itemId);
    try {
      const res = await fetch('/api/inventory/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`${action === 'equip' ? 'Equipped' : 'Unequipped'} ${json.data.itemName}`);
        void loadInventory();
      } else {
        toast.error(json.message || 'Failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActingId(null);
    }
  }

  async function handleUse(itemId: string) {
    setActingId(itemId);
    try {
      const res = await fetch('/api/inventory/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Used ${json.data.used}`);
        void loadInventory();
      } else {
        toast.error(json.message || 'Failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActingId(null);
    }
  }

  const filteredItems = tab === 'all' ? items
    : tab === 'equipment' ? items.filter((i) => ['WEAPON', 'ARMOR', 'ACCESSORY'].includes(i.type))
    : items.filter((i) => i.consumable);

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Backpack className="h-6 w-6" /> Inventory
      </h1>

      {/* Equipment slots */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Equipment Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <Sword className="mx-auto mb-1 h-5 w-5 text-orange-500" />
              <p className="text-[10px] text-muted-foreground">Weapon</p>
              <p className="text-xs font-semibold">{equipped.weapon?.name ?? 'Empty'}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <Shield className="mx-auto mb-1 h-5 w-5 text-slate-500" />
              <p className="text-[10px] text-muted-foreground">Armor</p>
              <p className="text-xs font-semibold">{equipped.armor?.name ?? 'Empty'}</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <Zap className="mx-auto mb-1 h-5 w-5 text-purple-500" />
              <p className="text-[10px] text-muted-foreground">Accessory</p>
              <p className="text-xs font-semibold">{equipped.accessory?.name ?? 'Empty'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <Button variant={tab === 'all' ? 'default' : 'ghost'} size="sm" onClick={() => setTab('all')}>
          All ({items.length})
        </Button>
        <Button variant={tab === 'equipment' ? 'default' : 'ghost'} size="sm" onClick={() => setTab('equipment')}>
          Equipment
        </Button>
        <Button variant={tab === 'consumables' ? 'default' : 'ghost'} size="sm" onClick={() => setTab('consumables')}>
          Consumables
        </Button>
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">No items. Visit the Shop to buy some!</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const isEquipType = ['WEAPON', 'ARMOR', 'ACCESSORY'].includes(item.type);
            return (
              <Card key={item.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.name}</span>
                      {item.isEquipped && <Badge variant="default" className="text-[10px]">Equipped</Badge>}
                      {item.quantity > 1 && <Badge variant="secondary" className="text-[10px]">×{item.quantity}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex gap-1">
                    {isEquipType && !item.isEquipped && (
                      <Button size="sm" variant="outline" disabled={actingId === item.id} onClick={() => handleEquip(item.id, 'equip')}>
                        Equip
                      </Button>
                    )}
                    {isEquipType && item.isEquipped && (
                      <Button size="sm" variant="ghost" disabled={actingId === item.id} onClick={() => handleEquip(item.id, 'unequip')}>
                        Unequip
                      </Button>
                    )}
                    {item.consumable && (
                      <Button size="sm" disabled={actingId === item.id} onClick={() => handleUse(item.id)}>
                        Use
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
