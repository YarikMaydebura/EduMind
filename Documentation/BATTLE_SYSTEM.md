# EduMind AI — Battle & Class System

## Document Info
```
Version: 1.0.0
Inspired by: Solo Leveling, Pokemon, Final Fantasy
Purpose: Gamified PvP/PvE system that rewards academic performance
Core Concept: STUDY BETTER = BECOME STRONGER 📚⚔️
```

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    ⚔️ EDUMIND BATTLE SYSTEM ⚔️                                  │
│                      "Knowledge is Power"                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  📚 STUDY                    🎭 CLASS                    ⚔️ BATTLE              │
│  ═══════                     ═══════                     ════════               │
│  Complete homework     →     Stats grow           →      Stronger attacks       │
│  Pass quizzes          →     Unlock classes       →      New skills             │
│  Defeat bosses         →     Rare achievements    →      Rare class access      │
│  Practice daily        →     Higher attributes    →      Win more battles       │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗   │
│  ║                         CORE PRINCIPLE                                   ║   │
│  ║  ═══════════════════════════════════════════════════════════════════    ║   │
│  ║  A Common class player who studies hard CAN and WILL defeat             ║   │
│  ║  a Legendary class player who doesn't study!                            ║   │
│  ║                                                                          ║   │
│  ║  Class Bonus: 5-25%  vs  Study Bonus: up to 100%+                       ║   │
│  ║  HARD WORK BEATS LUCK!                                                  ║   │
│  ╚═════════════════════════════════════════════════════════════════════════╝   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Awakening System (Solo Leveling Style)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         🌟 AWAKENING JOURNEY 🌟                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Level 1-4: UNAWAKENED                                                          │
│  ═════════════════════                                                          │
│  • No class assigned                                                            │
│  • No battle access                                                             │
│  • Focus on studying and building stats                                         │
│  • System is watching your performance...                                       │
│                                                                                  │
│  Level 5: AWAKENING! 🌟                                                         │
│  ═══════════════════════                                                        │
│  • System analyzes: Subject Stats + Achievements + Study Patterns              │
│  • Proposes 5 BEST-FIT classes based on your performance                       │
│  • OR choose from basic Common classes manually                                 │
│  • Battle system UNLOCKS!                                                       │
│  • Choose your THEME (Fantasy, Cyberpunk, etc.)                                │
│                                                                                  │
│  Level 10+: EVOLUTION PATH                                                      │
│  ═══════════════════════════                                                    │
│  • Can evolve class to higher rarity                                           │
│  • Common → Uncommon → Rare → Epic → Legendary → Mythic                        │
│  • Based on continued academic performance                                      │
│  • New classes unlock as you improve!                                          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Character Attributes

### 2.1 Base Attributes

| Attribute | Abbr | Description | Base Value | Max | Regen |
|-----------|------|-------------|------------|-----|-------|
| **Health Points** | HP | Life - reach 0 = lose | 100 | 999 | None in battle |
| **Mana Points** | MP | For magic skills | 50 | 500 | +5 per turn |
| **Stamina** | STA | For physical skills | 50 | 500 | +5 per turn |
| **Attack** | ATK | Base damage dealt | 10 | 200 | - |
| **Defense** | DEF | Damage reduction | 10 | 200 | - |
| **Speed** | SPD | Turn order priority | 10 | 150 | - |
| **Luck** | LCK | Crit chance, drop rates | 5 | 100 | - |

### 2.2 Derived Stats

```typescript
// Calculated from base attributes
interface DerivedStats {
  critChance: number;      // LCK × 0.5% (max 50%)
  critDamage: number;      // 150% + (LCK × 0.5%) (max 200%)
  dodgeChance: number;     // SPD × 0.2% (max 30%)
  damageReduction: number; // DEF / (DEF + 100) (max 66%)
  turnOrder: number;       // SPD + random(0-10)
}
```

### 2.3 Subject Stats → Battle Attributes Conversion

```typescript
// ═══════════════════════════════════════════════════════════════════════════════
// CORE FORMULA: Academic Performance → Battle Power
// ═══════════════════════════════════════════════════════════════════════════════

interface SubjectConversion {
  subject: SubjectCategory;
  conversions: {
    attribute: Attribute;
    multiplier: number;
    type?: 'magic' | 'physical';
  }[];
}

const SUBJECT_CONVERSIONS: SubjectConversion[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // MATHEMATICS → Magic Power & Intelligence
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'MATHEMATICS',
    conversions: [
      { attribute: 'MP', multiplier: 0.5 },      // 80% Math → +40 MP
      { attribute: 'ATK', multiplier: 0.15, type: 'magic' }, // +12 magic ATK
      { attribute: 'LCK', multiplier: 0.05 },    // +4 LCK (precision)
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // SCIENCE → Technical Power & Status Effects
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'SCIENCE',
    conversions: [
      { attribute: 'MP', multiplier: 0.3 },
      { attribute: 'DEF', multiplier: 0.2 },
      { attribute: 'statusPower', multiplier: 0.15 }, // Stronger debuffs
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // PHYSICAL EDUCATION → Physical Power & Tankiness
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'PHYSICAL_EDUCATION',
    conversions: [
      { attribute: 'HP', multiplier: 0.8 },      // 90% PE → +72 HP
      { attribute: 'STA', multiplier: 0.5 },     // +45 STA
      { attribute: 'ATK', multiplier: 0.2, type: 'physical' },
      { attribute: 'DEF', multiplier: 0.15 },
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // LANGUAGES → Speed & Utility
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'LANGUAGES',
    conversions: [
      { attribute: 'SPD', multiplier: 0.3 },     // 80% → +24 SPD
      { attribute: 'MP', multiplier: 0.2 },
      { attribute: 'cooldownReduction', multiplier: 0.1 }, // -8% skill cooldown
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // HISTORY & SOCIAL STUDIES → Strategy & Defense
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'SOCIAL_STUDIES',
    conversions: [
      { attribute: 'DEF', multiplier: 0.35 },
      { attribute: 'HP', multiplier: 0.25 },
      { attribute: 'counterChance', multiplier: 0.1 }, // 8% counter chance
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ARTS & MUSIC → Creativity & Buffs
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'ARTS',
    conversions: [
      { attribute: 'MP', multiplier: 0.35 },
      { attribute: 'buffDuration', multiplier: 0.15 }, // +12% buff duration
      { attribute: 'healPower', multiplier: 0.2 },    // +16% heal effectiveness
    ]
  },
  
  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTER SCIENCE → Hacking & Debuffs
  // ─────────────────────────────────────────────────────────────────────────────
  {
    subject: 'COMPUTER_SCIENCE',
    conversions: [
      { attribute: 'MP', multiplier: 0.4 },
      { attribute: 'debuffPower', multiplier: 0.2 },
      { attribute: 'SPD', multiplier: 0.15 },
      { attribute: 'LCK', multiplier: 0.1 },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATION EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════════

function calculateBattleStats(student: Student, classBonus: ClassBonus): BattleStats {
  const base: BattleStats = {
    HP: 100, MP: 50, STA: 50,
    ATK: 10, DEF: 10, SPD: 10, LCK: 5
  };
  
  // Apply subject conversions
  for (const conversion of SUBJECT_CONVERSIONS) {
    const subjectAvg = student.subjectStats[conversion.subject].average;
    
    for (const conv of conversion.conversions) {
      base[conv.attribute] += Math.floor(subjectAvg * conv.multiplier);
    }
  }
  
  // Apply class passive bonus (5-25%)
  for (const bonus of classBonus.passives) {
    base[bonus.attribute] *= (1 + bonus.percentage / 100);
  }
  
  return base;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE: Two students comparison
// ═══════════════════════════════════════════════════════════════════════════════

// Student A: Common class, 90% average all subjects
// HP: 100 + 72 + 22 = 194 (base + PE + History)
// MP: 50 + 45 + 27 + 18 + 31 + 36 = 207 (base + Math + Science + Lang + Arts + CS)
// ATK: 10 + 13 + 18 = 41 (base + Math + PE)
// Class bonus: +5% HP = 194 * 1.05 = 204 HP
// TOTAL POWER: ~650

// Student B: Legendary class, 50% average all subjects
// HP: 100 + 40 + 12 = 152
// MP: 50 + 25 + 15 + 10 + 17 + 20 = 137
// ATK: 10 + 7 + 10 = 27
// Class bonus: +20% HP = 152 * 1.20 = 182 HP
// TOTAL POWER: ~450

// RESULT: Student A (Common, hardworking) BEATS Student B (Legendary, lazy)!
```

---

## 3. Class System

### 3.1 Class Rarity & Bonuses

| Rarity | Passive Bonus | Special | How to Get |
|--------|---------------|---------|------------|
| **Common** | +5% to ONE stat | None | Default at Level 5 |
| **Uncommon** | +8% to ONE stat, +3% to another | None | 70%+ in 1 subject |
| **Rare** | +12% to TWO stats | 1 special ability | 80%+ in 2 subjects |
| **Epic** | +15% to TWO stats | 1 special + 1 passive | 85%+ in 2 subjects + achievements |
| **Legendary** | +20% to THREE stats | 2 special + unique passive | 90%+ in 3 subjects + rare achievements |
| **Mythic** | +25% to ALL stats | 3 special + unique + exclusive skills | EXTREME conditions |

### 3.2 Themes (6 Total)

Each theme has its own visual style and skill effects:

| Theme | Style | Skill Effects | Best For |
|-------|-------|---------------|----------|
| **Fantasy** | Medieval magic | Fire, Ice, Lightning, Holy | Math, Arts |
| **Cyberpunk** | Neon tech | Hacking, Electric, Glitch | CS, Science |
| **Military** | Modern warfare | Tactical, Explosive, Precision | PE, History |
| **Sci-Fi** | Space tech | Laser, Plasma, Gravity | Science, Math |
| **Anime/Manhwa** | Solo Leveling style | Shadow, Aura, Spirit | All subjects |
| **Steampunk** | Victorian tech | Steam, Clockwork, Brass | Science, Arts |

### 3.3 Class Count by Theme

| Theme | Common | Uncommon | Rare | Epic | Legendary | Mythic | Total |
|-------|--------|----------|------|------|-----------|--------|-------|
| Fantasy | 4 | 4 | 3 | 2 | 2 | 1 | 16 |
| Cyberpunk | 4 | 4 | 3 | 2 | 2 | 1 | 16 |
| Military | 4 | 4 | 3 | 2 | 2 | 1 | 16 |
| Sci-Fi | 4 | 4 | 3 | 2 | 2 | 1 | 16 |
| Anime/Manhwa | 4 | 4 | 3 | 2 | 2 | 1 | 16 |
| Steampunk | 4 | 4 | 3 | 2 | 2 | 1 | 16 |
| **TOTAL** | 24 | 24 | 18 | 12 | 12 | 6 | **96** |

### 3.4 Class Evolution System

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         🔄 CLASS EVOLUTION SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  OPTION A: Natural Evolution                                                    │
│  ═══════════════════════════                                                    │
│  • Reach required level with current class                                      │
│  • Meet new class requirements (subject stats + achievements)                  │
│  • System proposes available upgrades                                          │
│  • FREE evolution!                                                              │
│                                                                                  │
│  OPTION B: Class Change Token                                                   │
│  ═══════════════════════════                                                    │
│  • Rare item from dungeons/shop (10,000 KP)                                    │
│  • Can switch to ANY class you qualify for                                     │
│  • Limit: 1 per month                                                          │
│  • Useful for changing theme/playstyle                                         │
│                                                                                  │
│  OPTION C: Study-Based Unlock                                                   │
│  ═════════════════════════════                                                  │
│  • Improve specific subject by 15%+                                            │
│  • New classes become available automatically                                  │
│  • Encourages balanced study!                                                  │
│                                                                                  │
│  EVOLUTION PATH:                                                                │
│  ═══════════════                                                                │
│                                                                                  │
│  Common     →    Uncommon    →    Rare    →    Epic    →   Legendary  → Mythic │
│  (Lv 5)         (Lv 10)          (Lv 20)      (Lv 35)      (Lv 50)      (Lv 75)│
│                                                                                  │
│  Requirements increase at each tier:                                            │
│  • Uncommon: 70%+ in 1 subject                                                 │
│  • Rare: 80%+ in 2 subjects + 5 achievements                                   │
│  • Epic: 85%+ in 2 subjects + 15 achievements + special condition              │
│  • Legendary: 90%+ in 3 subjects + 30 achievements + rare conditions           │
│  • Mythic: See Mythic Classes section                                          │
│                                                                                  │
│  EXAMPLE:                                                                       │
│  ════════                                                                       │
│  Student starts as "Apprentice Mage" (Common, Fantasy)                         │
│  → Level 10 + 70% Math → Evolves to "Elementalist" (Uncommon)                  │
│  → Level 20 + 80% Math + 80% Science → Evolves to "Archmage" (Rare)           │
│  → Level 35 + 85%+ + achievements → Evolves to "Sage" (Epic)                  │
│  → Level 50 + 90%+ + rare achievements → Evolves to "Grand Sage" (Legendary)  │
│  → Level 75 + EXTREME conditions → Evolves to "Supreme Mage" (Mythic)         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Battle System

### 4.1 Battle Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ⚔️ BATTLE FLOW ⚔️                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. MATCH START                                                                  │
│     ════════════                                                                │
│     • Both players load with current stats                                      │
│     • Stats = (Subject Performance × Conversion) + Class Bonus + Equipment     │
│     • Display HP/MP/STA bars                                                    │
│                                                                                  │
│  2. TURN ORDER                                                                   │
│     ════════════                                                                │
│     • Compare SPD: Higher SPD goes first                                        │
│     • If equal: Random selection                                                │
│     • Recalculate each turn (buffs/debuffs can change SPD)                     │
│                                                                                  │
│  3. PLAYER TURN                                                                  │
│     ════════════                                                                │
│     Choose ONE action:                                                          │
│     ┌─────────────────────────────────────────────────────────────────────┐    │
│     │ 🗡️ BASIC ATTACK                                                     │    │
│     │    • Free action (no MP/STA cost)                                   │    │
│     │    • Deals ATK × 1.0 damage                                         │    │
│     │    • Always available                                               │    │
│     │                                                                      │    │
│     │ ⚡ USE SKILL (1 of 4-6 equipped)                                    │    │
│     │    • Costs MP or STA                                                │    │
│     │    • Deals skill damage or applies effect                           │    │
│     │    • May have cooldown                                              │    │
│     │                                                                      │    │
│     │ 🛡️ DEFEND                                                           │    │
│     │    • Skip attack                                                    │    │
│     │    • +50% DEF this turn                                             │    │
│     │    • Recover +10 MP and +10 STA                                     │    │
│     │                                                                      │    │
│     │ 💊 USE ITEM (if available)                                          │    │
│     │    • Consume item from inventory                                    │    │
│     │    • Heal HP/MP/STA or cure status                                  │    │
│     └─────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  4. DAMAGE CALCULATION                                                          │
│     ══════════════════                                                          │
│     Base Damage = Skill Power × ATK                                            │
│     Final Damage = Base × (100 / (100 + enemy DEF))                            │
│     Crit Damage = Final × (1.5 + LCK×0.005)                                    │
│                                                                                  │
│  5. STATUS EFFECTS (applied after damage)                                       │
│     ════════════════════════════════════                                        │
│     • 🔥 Burn: -5% max HP per turn (3 turns)                                   │
│     • ☠️ Poison: -3% max HP per turn (5 turns)                                 │
│     • ❄️ Freeze: 25% chance skip turn (2 turns)                                │
│     • ⚡ Shock: -20% SPD (3 turns)                                              │
│     • 💪 Buff: +X% stat (duration varies)                                      │
│     • 💔 Debuff: -X% stat (duration varies)                                    │
│                                                                                  │
│  6. END OF TURN                                                                  │
│     ═════════════                                                               │
│     • Apply status effect damage                                                │
│     • Reduce buff/debuff durations                                              │
│     • Regenerate +5 MP and +5 STA                                              │
│     • Check cooldowns                                                           │
│                                                                                  │
│  7. WIN CONDITION                                                               │
│     ══════════════                                                              │
│     • Enemy HP ≤ 0 → YOU WIN! 🎉                                               │
│     • Your HP ≤ 0 → YOU LOSE 😢                                                │
│     • 30 turns reached → DRAW (both get small reward)                          │
│                                                                                  │
│  8. REWARDS                                                                      │
│     ═════════                                                                   │
│     Winner:                                                                     │
│     • +50-100 XP (academic)                                                     │
│     • +50-100 KP (currency)                                                     │
│     • 10% chance: Random item drop                                             │
│     • 5% chance: Skill book (class-specific)                                   │
│                                                                                  │
│     Loser:                                                                      │
│     • +20 XP                                                                    │
│     • +20 KP                                                                    │
│                                                                                  │
│     Draw:                                                                       │
│     • +35 XP each                                                               │
│     • +35 KP each                                                               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Battle Types

| Type | Description | Availability | Rewards |
|------|-------------|--------------|---------|
| **1v1 PvP** | Student vs Student | 5 per day, 5 min cooldown | XP, KP, items, skills |
| **PvE Dungeon** | Student vs AI mobs | Unlimited (stamina system later) | XP, KP, items, gold |
| **Friendly Match** | Practice with friends | Unlimited | No rewards |

### 4.3 Battle Limits

```typescript
const BATTLE_LIMITS = {
  pvp: {
    maxPerDay: 5,
    cooldownMinutes: 5,
    minLevel: 5,
  },
  dungeon: {
    maxPerDay: 10, // Can increase later
    cooldownMinutes: 0,
    minLevel: 5,
  },
  friendly: {
    maxPerDay: Infinity,
    cooldownMinutes: 1,
    minLevel: 5,
  },
};
```

---

## 5. Skill System

### 5.1 Skill Types

| Type | Cost | Description | Example |
|------|------|-------------|---------|
| **Physical Attack** | STA | Direct physical damage | "Sword Slash" - 20 STA, 150% ATK |
| **Magic Attack** | MP | Magic damage | "Fireball" - 30 MP, 180% ATK |
| **Hybrid Attack** | MP+STA | Combined damage | "Flame Strike" - 20 MP + 15 STA, 200% ATK |
| **Heal** | MP | Restore HP | "Healing Light" - 25 MP, restore 30% HP |
| **Buff** | MP | Boost your stats | "Power Up" - 20 MP, +30% ATK for 3 turns |
| **Debuff** | MP | Reduce enemy stats | "Weakness" - 25 MP, -20% enemy DEF |
| **Status Effect** | MP | Apply DoT/CC | "Ignite" - 35 MP, burn for 5% per turn |
| **Ultimate** | MP+STA | Super powerful, long cooldown | "Final Strike" - 50 MP + 50 STA, 400% ATK |

### 5.2 Skill Rarity

| Rarity | Power Level | How to Get | Count |
|--------|-------------|------------|-------|
| **Common** | 100-150% ATK | Default, shop | ~50 |
| **Uncommon** | 150-200% ATK | Achievements, drops | ~40 |
| **Rare** | 200-250% ATK | Rare achievements, dungeons | ~30 |
| **Epic** | 250-350% ATK | Special conditions | ~20 |
| **Legendary** | 350-450% ATK | Legendary+ class only | ~10 |
| **Mythic** | 450-600% ATK | Mythic class exclusive | ~6 |

### 5.3 Skill Unlock Conditions

```typescript
interface SkillUnlockCondition {
  skillId: string;
  name: string;
  conditions: {
    type: 'subject_stat' | 'achievement' | 'level' | 'class' | 'battles_won' | 'mobs_defeated';
    value: any;
  }[];
  operator: 'AND' | 'OR'; // Must meet ALL or ANY conditions
}

// Example: "Number Rain" skill
const numberRainSkill: SkillUnlockCondition = {
  skillId: 'number_rain',
  name: 'Number Rain',
  conditions: [
    { type: 'subject_stat', value: { subject: 'MATHEMATICS', minAverage: 80 } },
    { type: 'achievement', value: 'homework_streak_5' },
    { type: 'level', value: 10 },
    { type: 'class', value: ['Mage', 'Calculator', 'Technomancer'] },
  ],
  operator: 'AND',
};

// Example: "Power Strike" skill
const powerStrikeSkill: SkillUnlockCondition = {
  skillId: 'power_strike',
  name: 'Power Strike',
  conditions: [
    { type: 'subject_stat', value: { subject: 'PHYSICAL_EDUCATION', minAverage: 75 } },
    { type: 'mobs_defeated', value: 50 },
    { type: 'class', value: ['Warrior', 'Fighter', 'Knight', 'Soldier'] },
  ],
  operator: 'AND',
};
```

### 5.4 Subject → Skill Type Connection

| Subject | Skill Types | Example Skills |
|---------|-------------|----------------|
| **Mathematics** | Magic Attack, Calculation | Number Rain, Equation Blast, Pi Storm |
| **Science** | Status Effects, DoT | Acid Splash, Chemical Burn, Gravity Well |
| **PE** | Physical Attack, Buffs | Power Strike, Iron Body, Speed Burst |
| **Languages** | Buffs, Speed | Word of Power, Swift Tongue, Inspiration |
| **History** | Defense, Counter | Ancient Shield, Tactical Counter, War Cry |
| **Arts** | Heal, Buffs | Inspiring Song, Color Splash, Soothing Melody |
| **Computer Science** | Debuffs, Hacking | System Hack, Virus Upload, Firewall |

---

## 6. Economy System

### 6.1 Currency: Knowledge Points (KP)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         💰 KNOWLEDGE POINTS (KP) 💰                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  EARNING KP:                                                                    │
│  ═══════════                                                                    │
│  • Win PvP battle: 50-100 KP                                                   │
│  • Lose PvP battle: 20 KP                                                      │
│  • Complete homework: 10-30 KP                                                 │
│  • Pass quiz: 20-50 KP                                                         │
│  • Defeat boss: 100-200 KP                                                     │
│  • Daily login: 10 KP                                                          │
│  • Achievement: 50-500 KP                                                      │
│  • Dungeon clear: 30-150 KP                                                    │
│                                                                                  │
│  SPENDING KP:                                                                   │
│  ════════════                                                                   │
│  • Consumables: 50-200 KP                                                      │
│  • Equipment: 500-5000 KP                                                      │
│  • Skill Books: 1000-10000 KP                                                  │
│  • Cosmetics: 200-2000 KP                                                      │
│  • Boosters: 100-300 KP                                                        │
│  • Class Change Token: 10000 KP                                                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Shop Items

| Category | Item | Effect | Price (KP) | Rarity |
|----------|------|--------|------------|--------|
| **Consumables** | Small HP Potion | Restore 30% HP | 50 | Common |
| | Medium HP Potion | Restore 50% HP | 100 | Uncommon |
| | Large HP Potion | Restore 100% HP | 200 | Rare |
| | Small MP Potion | Restore 30% MP | 50 | Common |
| | Medium MP Potion | Restore 50% MP | 100 | Uncommon |
| | Antidote | Cure poison/burn | 75 | Common |
| | Revival Feather | Auto-revive once (50% HP) | 500 | Epic |
| **Equipment** | Basic Weapon | +5% ATK | 500 | Common |
| | Enhanced Weapon | +10% ATK | 1500 | Uncommon |
| | Rare Weapon | +15% ATK + special | 3000 | Rare |
| | Basic Armor | +5% DEF | 500 | Common |
| | Enhanced Armor | +10% DEF, +5% HP | 1500 | Uncommon |
| | Rare Armor | +15% DEF, +10% HP | 3000 | Rare |
| | Speed Boots | +10% SPD | 1000 | Uncommon |
| | Lucky Charm | +10% LCK | 1000 | Uncommon |
| **Skill Books** | Common Skill | Learn common skill | 1000 | Common |
| | Uncommon Skill | Learn uncommon skill | 2500 | Uncommon |
| | Rare Skill | Learn rare skill | 5000 | Rare |
| | Epic Skill | Learn epic skill | 10000 | Epic |
| **Cosmetics** | Avatar Frame | Profile decoration | 500 | Varies |
| | Battle Effect | Skill visual effect | 1000 | Varies |
| | Title | Display title | 200-2000 | Varies |
| **Special** | Class Change Token | Change class (1/month) | 10000 | Epic |
| | Stat Reset | Reset subject→stat allocation | 5000 | Rare |
| | XP Booster (1h) | +10% XP for 1 hour | 200 | Common |

---

## 7. Dungeon System (Future Feature)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         🏰 DUNGEON SYSTEM 🏰                                    │
│                         (Planned for future release)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  DUNGEON TYPES:                                                                 │
│  ══════════════                                                                 │
│                                                                                  │
│  📗 EASY DUNGEON (Level 5+)                                                     │
│     ├── Wave 1: 3 weak mobs                                                    │
│     ├── Wave 2: 3 weak mobs                                                    │
│     ├── Wave 3: 1 mini-boss                                                    │
│     └── Reward: 50 KP, common item chance, 30 XP                               │
│                                                                                  │
│  📙 MEDIUM DUNGEON (Level 15+)                                                  │
│     ├── Wave 1: 3 medium mobs                                                  │
│     ├── Wave 2: 5 medium mobs                                                  │
│     ├── Wave 3: 2 elite mobs                                                   │
│     ├── Wave 4: 1 boss                                                         │
│     └── Reward: 100 KP, uncommon item chance, 60 XP                            │
│                                                                                  │
│  📕 HARD DUNGEON (Level 30+)                                                    │
│     ├── Wave 1-5: Increasing difficulty                                        │
│     ├── Final: Strong boss                                                     │
│     └── Reward: 200 KP, rare item chance, skill book chance, 100 XP            │
│                                                                                  │
│  📓 NIGHTMARE DUNGEON (Level 50+)                                               │
│     ├── Wave 1-7: Very hard                                                    │
│     ├── Final: Nightmare boss                                                  │
│     └── Reward: 400 KP, epic item chance, rare skill chance, 200 XP            │
│                                                                                  │
│  SUBJECT-THEMED DUNGEONS:                                                       │
│  ═════════════════════════                                                      │
│     📐 Math Dungeon → Magic-focused enemies                                    │
│     🧪 Science Dungeon → Status-effect enemies                                 │
│     🏃 PE Dungeon → Physical-focused enemies                                   │
│     📚 Language Dungeon → Speed-based enemies                                  │
│     📜 History Dungeon → Defensive enemies                                     │
│     🎨 Arts Dungeon → Healing enemies                                          │
│     💻 CS Dungeon → Debuff enemies                                             │
│                                                                                  │
│     BONUS: +50% rewards if your matching subject is 80%+!                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Complete Formula Reference

```typescript
// ═══════════════════════════════════════════════════════════════════════════════
// MASTER FORMULA FILE
// ═══════════════════════════════════════════════════════════════════════════════

// 1. BATTLE STATS CALCULATION
function calculateFinalStats(student: Student, character: BattleCharacter): Stats {
  // Base stats
  let stats = { HP: 100, MP: 50, STA: 50, ATK: 10, DEF: 10, SPD: 10, LCK: 5 };
  
  // Add subject bonuses (main source of power!)
  stats = applySubjectConversions(stats, student.subjectStats);
  
  // Add class passive bonus (small bonus)
  stats = applyClassBonus(stats, character.class.passives);
  
  // Add equipment bonus
  stats = applyEquipmentBonus(stats, character.equipment);
  
  return stats;
}

// 2. DAMAGE CALCULATION
function calculateDamage(
  attacker: Stats,
  defender: Stats,
  skill: Skill,
  isCrit: boolean
): number {
  // Base damage
  let damage = skill.power * attacker.ATK / 100;
  
  // Defense reduction
  const reduction = defender.DEF / (defender.DEF + 100);
  damage *= (1 - reduction);
  
  // Critical hit
  if (isCrit) {
    const critMultiplier = 1.5 + (attacker.LCK * 0.005);
    damage *= critMultiplier;
  }
  
  // Type effectiveness (physical vs magic)
  if (skill.type === 'magic' && defender.magicResist) {
    damage *= (1 - defender.magicResist / 100);
  }
  
  return Math.floor(damage);
}

// 3. CRITICAL HIT CALCULATION
function isCriticalHit(attacker: Stats): boolean {
  const critChance = attacker.LCK * 0.5; // Max 50%
  return Math.random() * 100 < critChance;
}

// 4. TURN ORDER CALCULATION
function calculateTurnOrder(player1: Stats, player2: Stats): 'player1' | 'player2' {
  const p1Speed = player1.SPD + Math.random() * 10;
  const p2Speed = player2.SPD + Math.random() * 10;
  return p1Speed >= p2Speed ? 'player1' : 'player2';
}

// 5. XP & KP REWARD CALCULATION
function calculateBattleRewards(winner: boolean, enemyLevel: number): Rewards {
  if (winner) {
    return {
      xp: 50 + Math.floor(enemyLevel * 2),
      kp: 50 + Math.floor(enemyLevel * 2),
      itemDropChance: 0.10,
      skillDropChance: 0.05,
    };
  } else {
    return {
      xp: 20,
      kp: 20,
      itemDropChance: 0,
      skillDropChance: 0,
    };
  }
}

// 6. CLASS UNLOCK CHECK
function canUnlockClass(student: Student, classReq: ClassRequirements): boolean {
  // Check level
  if (student.level < classReq.minLevel) return false;
  
  // Check subject requirements
  for (const req of classReq.subjectRequirements) {
    if (student.subjectStats[req.subject].average < req.minAverage) {
      return false;
    }
  }
  
  // Check achievements
  for (const achId of classReq.requiredAchievements) {
    if (!student.achievements.includes(achId)) {
      return false;
    }
  }
  
  // Check special conditions
  for (const condition of classReq.specialConditions) {
    if (!evaluateCondition(student, condition)) {
      return false;
    }
  }
  
  return true;
}

// 7. SKILL UNLOCK CHECK
function canUnlockSkill(student: Student, character: BattleCharacter, skill: Skill): boolean {
  // Check class requirement
  if (skill.classRequired.length > 0) {
    if (!skill.classRequired.includes(character.class.id)) {
      return false;
    }
  }
  
  // Check all conditions
  for (const condition of skill.unlockConditions) {
    switch (condition.type) {
      case 'subject_stat':
        if (student.subjectStats[condition.subject].average < condition.minValue) {
          return false;
        }
        break;
      case 'achievement':
        if (!student.achievements.includes(condition.achievementId)) {
          return false;
        }
        break;
      case 'level':
        if (student.level < condition.minLevel) {
          return false;
        }
        break;
      case 'battles_won':
        if (character.battlesWon < condition.minValue) {
          return false;
        }
        break;
      case 'mobs_defeated':
        if (character.mobsDefeated < condition.minValue) {
          return false;
        }
        break;
    }
  }
  
  return true;
}
```

---

## 9. Summary

```
╔═════════════════════════════════════════════════════════════════════════════════╗
║                     EDUMIND BATTLE SYSTEM - COMPLETE SUMMARY                    ║
╠═════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  CORE PHILOSOPHY: "STUDY = POWER" 📚⚔️                                          ║
║  ═══════════════════════════════════                                            ║
║  • Academic performance is 75-80% of battle power                              ║
║  • Class rarity is only 5-25% bonus                                            ║
║  • Hard work ALWAYS beats luck!                                                ║
║                                                                                  ║
║  NUMBERS AT A GLANCE:                                                           ║
║  ════════════════════                                                           ║
║  • 6 Themes (Fantasy, Cyberpunk, Military, Sci-Fi, Anime, Steampunk)          ║
║  • 6 Rarities (Common → Uncommon → Rare → Epic → Legendary → Mythic)          ║
║  • 96 Classes total                                                             ║
║  • ~156 Skills total                                                            ║
║  • 7 Attributes (HP, MP, STA, ATK, DEF, SPD, LCK)                              ║
║                                                                                  ║
║  BATTLE RULES:                                                                  ║
║  ═════════════                                                                  ║
║  • Turn-based combat (Pokemon/Final Fantasy style)                             ║
║  • 4-6 skills + basic attack + defend                                          ║
║  • Status effects: Burn, Poison, Freeze, Shock, Buff, Debuff                   ║
║  • 30 turn limit (draw if reached)                                             ║
║                                                                                  ║
║  LIMITS:                                                                        ║
║  ═══════                                                                        ║
║  • 5 PvP battles per day                                                        ║
║  • 5 minutes cooldown                                                           ║
║  • Level 5 minimum                                                              ║
║                                                                                  ║
║  REWARDS:                                                                       ║
║  ════════                                                                       ║
║  • XP (academic progression)                                                    ║
║  • KP (Knowledge Points - currency)                                            ║
║  • Items (equipment, consumables)                                               ║
║  • Skills (class-specific drops)                                               ║
║                                                                                  ║
║  EVOLUTION:                                                                     ║
║  ══════════                                                                     ║
║  • Classes can evolve: Common → ... → Mythic                                   ║
║  • Based on academic performance + achievements                                ║
║  • Can also use Class Change Token                                             ║
║                                                                                  ║
╚═════════════════════════════════════════════════════════════════════════════════╝
```

---

**See also:**
- `CLASSES_COMPLETE.md` — All 96 classes with details
- `SKILLS_COMPLETE.md` — All 156 skills with effects
- `battle-system-schema.prisma` — Database schema additions
