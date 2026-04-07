'use client';

import { Loader2, ShoppingBag, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  price: number;
  consumable: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effects: any;
}

const TYPE_LABELS: Record<string, string> = {
  CONSUMABLE: 'Consumable',
  WEAPON: 'Weapon',
  ARMOR: 'Armor',
  ACCESSORY: 'Accessory',
  SKILL_BOOK: 'Skill Book',
  COSMETIC: 'Cosmetic',
  SPECIAL: 'Special',
};

const RARITY_COLORS: Record<string, string> = {
  ITEM_COMMON: 'text-gray-400',
  ITEM_UNCOMMON: 'text-green-500',
  ITEM_RARE: 'text-blue-500',
  ITEM_EPIC: 'text-purple-500',
  ITEM_LEGENDARY: 'text-amber-500',
};

export function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [kpBalance, setKpBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('ALL');

  const loadShop = useCallback(async () => {
    try {
      const res = await fetch('/api/shop');
      const json = await res.json();
      if (json.success) {
        setItems(json.data.items);
        setKpBalance(json.data.kpBalance);
      }
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void loadShop(); }, [loadShop]);

  async function handleBuy(itemId: string) {
    setBuyingId(itemId);
    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Purchased! (-${json.data.kpSpent} KP)`);
        setKpBalance(json.data.newBalance);
      } else {
        toast.error(json.message || 'Purchase failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setBuyingId(null);
    }
  }

  const filtered = typeFilter === 'ALL' ? items : items.filter((i) => i.type === typeFilter);
  const types = ['ALL', ...new Set(items.map((i) => i.type))];

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <ShoppingBag className="h-6 w-6" /> Shop
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Spend Knowledge Points on items and equipment</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-amber-500" />
          {kpBalance} KP
        </Badge>
      </div>

      {/* Type filters */}
      <div className="mb-4 flex flex-wrap gap-1">
        {types.map((t) => (
          <Button key={t} variant={typeFilter === t ? 'default' : 'ghost'} size="sm" className="text-xs" onClick={() => setTypeFilter(t)}>
            {t === 'ALL' ? 'All' : TYPE_LABELS[t] ?? t}
          </Button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => {
          const canAfford = kpBalance >= item.price;
          return (
            <Card key={item.id} className={`transition-all ${canAfford ? 'hover:shadow-md hover:border-primary/30' : 'opacity-60'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{item.name}</CardTitle>
                  <Badge variant="outline" className={`text-[10px] ${RARITY_COLORS[item.rarity] ?? ''}`}>
                    {item.rarity.replace('ITEM_', '')}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit text-[10px]">
                  {TYPE_LABELS[item.type] ?? item.type}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-500">{item.price} KP</span>
                  <Button size="sm" disabled={!canAfford || buyingId === item.id} onClick={() => handleBuy(item.id)}>
                    {buyingId === item.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">No items found</p>}
    </div>
  );
}
