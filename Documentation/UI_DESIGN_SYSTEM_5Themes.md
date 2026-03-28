# EduMind AI - UI Design System (FINAL)
## Version 1.0 - All Themes Approved

---

## 🎨 THEME OVERVIEW

| Theme | Target | Style | Status |
|-------|--------|-------|--------|
| **Dark Fantasy** | Teens/Adults | Solo Leveling inspired | ✅ Approved |
| **Ghibli** | All ages | Studio Ghibli warm tones | ✅ Approved |
| **Bright** | Teens 13-18 | Clean minimal teal | ✅ Approved |
| **Pixel** | Retro fans | 8-bit game style | ✅ Approved |
| **Cyberpunk** | Teens/Adults | Neon HUD style | ✅ Approved |

---

## 1. DARK FANTASY (Solo Leveling Style)

### Colors
```css
--bg: #080c18;
--card: rgba(8, 16, 32, 0.92);
--border: #1a4a6a;
--accent: #00d4ff;        /* Cyan glow */
--accent2: #4de8ff;
--text: #d0e8f8;
--text2: #6090b0;
--text3: #304860;
--gold: #f0c040;          /* Quest labels */
--red: #ff4060;           /* Warnings */
--green: #40ff90;         /* Success */
```

### Visual Elements
- **Corners**: Cyan glowing corner decorations (L-shaped)
- **Borders**: 1px solid with outer glow
- **Headers**: Circle (!) icon + uppercase text + gradient line separator
- **Battle Power**: Transparent with cyan border (NOT bright gradient)
- **Font**: Rajdhani (bold, tech feel)

### Solo Leveling Features
- Quest format: `[0/1]` progress indicators
- Warning text in red uppercase
- "ALARM" style level-up popup
- Glowing line separators

---

## 2. GHIBLI (Anime - Studio Ghibli)

### Colors
```css
--bg: #f5efe6;            /* Warm cream */
--card: rgba(255, 252, 245, 0.98);
--border: #d4c4a8;        /* Warm tan */
--accent: #5a8f5a;        /* Forest green */
--accent2: #7ab87a;
--text: #4a3f35;          /* Warm brown */
--text2: #7a6f60;
--text3: #a89880;
--gold: #c8a050;
--red: #c06050;
--green: #5a9060;
```

### Visual Elements
- **Corners**: Soft rounded corner accents
- **Borders**: 2px warm tan
- **Radius**: 16px cards, 10px buttons (rounded, friendly)
- **Font**: Nunito (soft, rounded)
- **Overall**: Natural, warm, inviting

---

## 3. BRIGHT (Clean Minimal - Teens)

### Colors
```css
--bg: #ffffff;            /* Pure white */
--card: #ffffff;
--border: #e5e7eb;        /* Light gray */
--accent: #14b8a6;        /* Teal */
--accent2: #2dd4bf;
--text: #111827;          /* Near black */
--text2: #4b5563;
--text3: #9ca3af;
--gold: #f59e0b;
--red: #ef4444;
--green: #10b981;
```

### Visual Elements
- **Buttons**: Light gray bg (#f9fafb) + dark text + visible border
- **Cards**: White with subtle 1px border, minimal shadow
- **Radius**: 10px cards, 6px buttons
- **Font**: Inter (clean, modern)
- **Overall**: Minimal, professional, distraction-free

---

## 4. PIXEL (8-bit Retro)

### Colors
```css
--bg: #0f0e1a;
--card: #1a1a2e;
--border: #4a4a6a;
--accent: #f0c040;        /* Gold */
--accent2: #f8e080;
--text: #e8e8d0;
--text2: #a0a090;
--text3: #606058;
--red: #ff6060;
--green: #60ff90;
```

### Visual Elements
- **Corners**: 12px gold squares at corners
- **Borders**: 4px solid + 6px drop shadow
- **Radius**: 0px (sharp edges)
- **Font**: Monospace
- **Progress bars**: Solid color (no gradient)
- **Overall**: Chunky, retro game feel

---

## 5. CYBERPUNK (Neon HUD)

### Colors
```css
--bg: #050508;
--card: rgba(8, 12, 24, 0.95);
--border: rgba(0, 255, 255, 0.3);
--accent: #00ffff;        /* Cyan */
--accent2: #ff00ff;       /* Magenta */
--text: #e0f7fa;
--text2: #80deea;
--text3: #4dd0e1;
--gold: #ffff00;
--red: #ff0066;
--green: #00ff66;
```

### Visual Elements
- **Corners**: SVG corner brackets
- **Cards**: Clipped corners (polygon clip-path)
- **Scan lines**: Subtle horizontal lines overlay
- **Font**: Rajdhani
- **Battle Power**: Transparent with cyan border glow
- **Overall**: Futuristic HUD aesthetic

---

## 📐 LAYOUT SPECIFICATIONS

### Grid (Desktop-First)
```css
/* Desktop 1200px+ */
grid-template-columns: 220px 1fr 1fr;
gap: 14px;

/* Tablet 700-1000px */
grid-template-columns: 200px 1fr;

/* Mobile <650px */
grid-template-columns: 1fr;
```

### Card Structure
- Character card: spans 3 rows
- Stats card: spans 2 columns
- Small cards: 1 column each

### Spacing
- Card padding: 14px
- Gap between cards: 14px
- Section header margin-bottom: 12px

---

## 🎭 CHARACTER SYSTEM

### Placeholder (Current)
- Dashed border box
- "Character Sprite" label
- Will be replaced with actual images/sprites

### Future Implementation
- Use actual PNG/SVG sprites (not generated silhouettes)
- Different sprite per class
- Animated idle states
- Element-colored effects around character

---

## ⚔️ ELEMENT COLORS

```css
[data-element="fire"]    { --elem: #ff6040; }
[data-element="ice"]     { --elem: #40d0ff; }
[data-element="lightning"]{ --elem: #ffe040; }
[data-element="arcane"]  { --elem: #c080ff; }
```

---

## 💎 RARITY SYSTEM

| Rarity | Border Style |
|--------|--------------|
| Epic | Subtle inner glow (purple) |
| Legendary | Gold border + inner glow |
| Mythic | Animated rainbow gradient border |

```css
.rarity-epic { box-shadow: inset 0 0 30px rgba(139,92,246,0.08); }
.rarity-legendary { border-color: #f0c040; box-shadow: inset 0 0 40px rgba(240,192,64,0.1); }
.rarity-mythic { background: linear-gradient(...) border-box; animation: mythic-shift 4s linear infinite; }
```

---

## 🎬 ANIMATION MOMENTS

1. **Page transitions** - Fade/slide between screens
2. **XP gain** - Floating "+XX XP" text
3. **Level up** - Full modal celebration
4. **Button hover** - Color shift + subtle glow
5. **Stat bar changes** - Smooth width transition
6. **Achievement unlock** - Popup notification
7. **Rank change** - Highlight animation

---

## 📦 IMPLEMENTATION FILES

```
/components/themes/
├── ThemeProvider.tsx      # Context for theme switching
├── dark-fantasy.css       # Solo Leveling theme
├── ghibli.css            # Studio Ghibli theme
├── bright.css            # Clean minimal theme
├── pixel.css             # 8-bit retro theme
├── cyberpunk.css         # Neon HUD theme
└── variables.css         # Shared CSS variables

/components/ui/
├── Card.tsx              # Theme-aware card
├── Button.tsx            # Theme-aware buttons
├── ProgressBar.tsx       # XP/stat bars
├── RadarChart.tsx        # Hexagon stats display
├── LevelRing.tsx         # Circular level indicator
└── CharacterCard.tsx     # Main character display
```

---

## ✅ APPROVAL STATUS

- [x] Dark Fantasy - Solo Leveling style approved
- [x] Ghibli - Warm natural tones approved
- [x] Bright - Clean minimal teal approved
- [x] Pixel - 8-bit retro approved
- [x] Cyberpunk - Neon HUD approved
- [x] Layout and spacing approved
- [x] Rarity system approved
- [x] Element colors working
- [ ] Character sprites - To be added later (using images, not SVG)

---

## 🚀 NEXT STEPS

1. Export final CSS for each theme
2. Create React components with theme support
3. Design character sprites (external images)
4. Build class selection screen
5. Design battle arena UI
6. Implement animations

---

*Document created: March 23, 2026*
*All themes approved by Yarik*
