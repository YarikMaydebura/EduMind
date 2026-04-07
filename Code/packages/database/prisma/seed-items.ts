import type { PrismaClient } from '@prisma/client';

interface ItemSeed {
  name: string;
  description: string;
  type: 'CONSUMABLE' | 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'SKILL_BOOK' | 'COSMETIC' | 'SPECIAL';
  rarity: 'ITEM_COMMON' | 'ITEM_UNCOMMON' | 'ITEM_RARE' | 'ITEM_EPIC' | 'ITEM_LEGENDARY';
  price: number;
  effects: Record<string, unknown>;
  requirements?: Record<string, unknown>;
  consumable: boolean;
  tradeable: boolean;
  inShop: boolean;
  shopLimit?: number;
  iconUrl?: string;
}

// ═══════════════════════════════════════════════════════════════
// 28 Shop Items for EduMind AI
// ═══════════════════════════════════════════════════════════════

const ITEMS: ItemSeed[] = [
  // ──────────────── CONSUMABLES (7) ────────────────
  {
    name: 'Small HP Potion',
    description: 'Restores 50 HP. A basic healing potion for minor wounds.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_COMMON',
    price: 50,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { heal: { type: 'HP', amount: 50 } },
  },
  {
    name: 'Medium HP Potion',
    description: 'Restores 150 HP. A reliable healing potion for moderate injuries.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_UNCOMMON',
    price: 150,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { heal: { type: 'HP', amount: 150 } },
  },
  {
    name: 'Large HP Potion',
    description: 'Restores 500 HP. A powerful elixir that mends even grave wounds.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_RARE',
    price: 500,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { heal: { type: 'HP', amount: 500 } },
  },
  {
    name: 'Small MP Potion',
    description: 'Restores 30 MP. Replenishes a small amount of magical energy.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_COMMON',
    price: 40,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { heal: { type: 'MP', amount: 30 } },
  },
  {
    name: 'Large MP Potion',
    description: 'Restores 100 MP. A concentrated magical brew for serious casters.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_UNCOMMON',
    price: 120,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { heal: { type: 'MP', amount: 100 } },
  },
  {
    name: 'STA Potion',
    description: 'Restores 30 STA. Refreshes stamina for continued study battles.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_COMMON',
    price: 40,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { heal: { type: 'STA', amount: 30 } },
  },
  {
    name: 'Antidote',
    description: 'Cures burn and poison status effects. A must-have for any adventurer.',
    type: 'CONSUMABLE',
    rarity: 'ITEM_COMMON',
    price: 30,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { cure: { statuses: ['BURN', 'POISON'] } },
  },

  // ──────────────── WEAPONS (3) ────────────────
  {
    name: 'Basic Sword',
    description: 'A simple but reliable blade. +5 ATK.',
    type: 'WEAPON',
    rarity: 'ITEM_COMMON',
    price: 200,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { ATK: 5 } },
  },
  {
    name: 'Iron Blade',
    description: 'A sturdy iron weapon forged with care. +10 ATK.',
    type: 'WEAPON',
    rarity: 'ITEM_UNCOMMON',
    price: 500,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { ATK: 10 } },
  },
  {
    name: 'Steel Greatsword',
    description: 'A massive two-handed blade of tempered steel. +20 ATK.',
    type: 'WEAPON',
    rarity: 'ITEM_RARE',
    price: 1500,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { ATK: 20 } },
  },

  // ──────────────── ARMOR (3) ────────────────
  {
    name: 'Leather Vest',
    description: 'Light armor offering basic protection. +5 DEF.',
    type: 'ARMOR',
    rarity: 'ITEM_COMMON',
    price: 200,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { DEF: 5 } },
  },
  {
    name: 'Chain Mail',
    description: 'Interlocking metal rings that absorb blows. +10 DEF.',
    type: 'ARMOR',
    rarity: 'ITEM_UNCOMMON',
    price: 500,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { DEF: 10 } },
  },
  {
    name: 'Plate Armor',
    description: 'Heavy full-body armor for maximum protection. +20 DEF.',
    type: 'ARMOR',
    rarity: 'ITEM_RARE',
    price: 1500,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { DEF: 20 } },
  },

  // ──────────────── ACCESSORIES (2) ────────────────
  {
    name: 'Lucky Charm',
    description: 'A small trinket that brings good fortune. +5 LCK.',
    type: 'ACCESSORY',
    rarity: 'ITEM_UNCOMMON',
    price: 300,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { LCK: 5 } },
  },
  {
    name: 'Speed Ring',
    description: 'An enchanted ring that quickens the wearer. +5 SPD.',
    type: 'ACCESSORY',
    rarity: 'ITEM_UNCOMMON',
    price: 300,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { stats: { SPD: 5 } },
  },

  // ──────────────── SKILL BOOKS (4) ────────────────
  {
    name: 'Common Skill Book',
    description: 'Teaches a random common-tier skill to the reader.',
    type: 'SKILL_BOOK',
    rarity: 'ITEM_COMMON',
    price: 100,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { unlockSkillRarity: 'SKILL_COMMON' },
  },
  {
    name: 'Uncommon Skill Book',
    description: 'Teaches a random uncommon-tier skill to the reader.',
    type: 'SKILL_BOOK',
    rarity: 'ITEM_UNCOMMON',
    price: 500,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { unlockSkillRarity: 'SKILL_UNCOMMON' },
  },
  {
    name: 'Rare Skill Book',
    description: 'Teaches a random rare-tier skill to the reader.',
    type: 'SKILL_BOOK',
    rarity: 'ITEM_RARE',
    price: 1000,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { unlockSkillRarity: 'SKILL_RARE' },
  },
  {
    name: 'Epic Skill Book',
    description: 'Teaches a random epic-tier skill to the reader.',
    type: 'SKILL_BOOK',
    rarity: 'ITEM_EPIC',
    price: 2000,
    consumable: true,
    tradeable: true,
    inShop: true,
    effects: { unlockSkillRarity: 'SKILL_EPIC' },
  },

  // ──────────────── COSMETICS (3) ────────────────
  {
    name: 'Bronze Frame',
    description: 'A shiny bronze frame for your profile. Show off your style!',
    type: 'COSMETIC',
    rarity: 'ITEM_COMMON',
    price: 500,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { profileFrame: 'bronze' },
  },
  {
    name: 'Silver Frame',
    description: 'An elegant silver frame for your profile. A mark of distinction.',
    type: 'COSMETIC',
    rarity: 'ITEM_UNCOMMON',
    price: 1000,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { profileFrame: 'silver' },
  },
  {
    name: 'Gold Frame',
    description: 'A prestigious gold frame for your profile. Only the finest!',
    type: 'COSMETIC',
    rarity: 'ITEM_RARE',
    price: 2000,
    consumable: false,
    tradeable: true,
    inShop: true,
    effects: { profileFrame: 'gold' },
  },

  // ──────────────── SPECIAL (6) ────────────────
  {
    name: 'Class Change Token',
    description: 'Allows you to change your character class once. Choose wisely!',
    type: 'SPECIAL',
    rarity: 'ITEM_EPIC',
    price: 5000,
    consumable: false,
    tradeable: false,
    inShop: true,
    shopLimit: 1,
    effects: { classChange: true },
  },
  {
    name: 'XP Boost (1hr)',
    description: 'Grants 1.5x XP for 60 minutes. Stack your study sessions!',
    type: 'SPECIAL',
    rarity: 'ITEM_UNCOMMON',
    price: 1000,
    consumable: true,
    tradeable: false,
    inShop: true,
    effects: { xpBoost: { multiplier: 1.5, durationMinutes: 60 } },
  },
  {
    name: 'KP Boost (1hr)',
    description: 'Grants 1.5x KP earnings for 60 minutes. Maximize your rewards!',
    type: 'SPECIAL',
    rarity: 'ITEM_UNCOMMON',
    price: 1000,
    consumable: true,
    tradeable: false,
    inShop: true,
    effects: { kpBoost: { multiplier: 1.5, durationMinutes: 60 } },
  },
  {
    name: 'Battle Refresh',
    description: 'Resets your daily PvP battle limit. Get back in the arena!',
    type: 'SPECIAL',
    rarity: 'ITEM_RARE',
    price: 800,
    consumable: true,
    tradeable: false,
    inShop: true,
    shopLimit: 1,
    effects: { resetPvpDaily: true },
  },
  {
    name: 'Lucky Draw Ticket',
    description: 'Enter the lucky draw for a chance at rare rewards!',
    type: 'SPECIAL',
    rarity: 'ITEM_UNCOMMON',
    price: 200,
    consumable: true,
    tradeable: false,
    inShop: true,
    effects: { luckyDraw: true },
  },
  {
    name: 'Resurrection Stone',
    description: 'Revive in battle with 50% HP. Cheat death itself!',
    type: 'SPECIAL',
    rarity: 'ITEM_EPIC',
    price: 3000,
    consumable: true,
    tradeable: false,
    inShop: true,
    shopLimit: 3,
    effects: { revive: { hpPercent: 50 } },
  },
];

// ═══════════════════════════════════════════════════════════════
// Seed function
// ═══════════════════════════════════════════════════════════════

export async function seedItems(prisma: PrismaClient) {
  console.log('Seeding items...');

  for (const item of ITEMS) {
    const data = {
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      price: item.price,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      effects: item.effects as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requirements: (item.requirements ?? null) as any,
      consumable: item.consumable,
      tradeable: item.tradeable,
      inShop: item.inShop,
      shopLimit: item.shopLimit ?? null,
      iconUrl: item.iconUrl ?? null,
    };

    await prisma.item.upsert({
      where: { name: item.name },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded ${ITEMS.length} shop items.`);
}
