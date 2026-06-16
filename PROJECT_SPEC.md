# Amulya Poster Generator — Complete Project Specification

A single-purpose web app for the owner of **Amulya Indian Cuisine (Bellevue, WA)** to generate branded daily buffet menu posters for WhatsApp and social media in under 30 seconds — no designer, no Canva.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Canvas | HTML5 Canvas API (no libraries) |
| PDF | jsPDF 4.x |
| Database | Supabase (PostgreSQL) — optional; falls back to localStorage |
| Fonts | Book Antiqua / Palatino (poster), Playfair Display (app UI) |
| Motion | framer-motion (UI only, not poster) |

---

## User Workflow (6 steps)

```
Step 1  Pick Day        (Mon–Sun, auto-advances on tap)
Step 2  Pick Meal Type  (Lunch / Dinner, auto-advances on tap)
Step 3  Select Veg Items      (min 1, checkbox list from library)
Step 4  Select Non-Veg Items  (min 1)
Step 5  Select Desserts        (min 1)
Step 6  Preview + Download    (PNG for WhatsApp, PDF option)
```

Accompaniments are always fixed: Chutneys, Fryams, Salads, Naan, Tea, White Rice, Raita, Roti Chutney.

Admin route `/admin` — CRUD for menu library (add/edit/delete/toggle-active items per category).

---

## Directory Structure

```
amulya-poster/
├── app/
│   ├── page.tsx               — main 6-step workflow
│   ├── admin/page.tsx         — menu library management
│   ├── globals.css            — Tailwind import + CSS vars + scrollbar
│   └── layout.tsx             — root layout (fonts: Playfair Display)
├── components/
│   ├── poster/
│   │   └── PosterCanvas.tsx   — HTML preview (mirrors canvas exactly)
│   └── workflow/
│       ├── StepDay.tsx
│       ├── StepMealType.tsx
│       ├── StepMenuSelect.tsx  — shared item picker (veg/nonveg/desserts)
│       ├── StepVeg.tsx         (legacy — superseded by StepMenuSelect)
│       ├── StepNonVeg.tsx      (legacy)
│       ├── StepDesserts.tsx    (legacy)
│       └── StepPoster.tsx     — step 6: preview + download + font picker
│   └── ui/
│       ├── Button.tsx
│       ├── MenuItemCard.tsx
│       └── StepIndicator.tsx
├── lib/
│   ├── posterExport.ts        — canvas generation + PNG/PDF download
│   ├── menuData.ts            — full menu library (static fallback)
│   └── supabase.ts            — Supabase client + localStorage fallback
├── types/index.ts             — shared TypeScript types
├── public/
│   └── poster-template.png    — 1024×1819px template image (THE key asset)
├── supabase-schema.sql        — full DB schema + seed data
└── .env.example               — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## TypeScript Types

```typescript
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type MealType = 'Lunch' | 'Dinner';
type MenuCategory = 'veg' | 'non-veg' | 'dessert' | 'accompaniment';

interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  isDefault?: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface PosterConfig {
  day: Day;
  mealType: MealType;
  vegItems: MenuItem[];
  nonVegItems: MenuItem[];
  desserts: MenuItem[];
  accompaniments: MenuItem[];
  date?: string;
}

type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6;
```

---

## Poster Template Layout

The template image is `public/poster-template.png` — **1024 × 1819 px**. All text is drawn on top of this image via Canvas API.

### Pixel-accurate text boxes (scanned from template)

```
TITLE:    x=30,  y=252,  w=964, h=175
VEG:      x=20,  y=539,  w=318, h=690   (left column, green dots)
SIDES:    x=355, y=555,  w=295, h=408   (center column top, olive dots)
DESSERTS: x=355, y=1100, w=295, h=130   (center column bottom, above ornate label)
NONVEG:   x=692, y=539,  w=295, h=690   (right column, red dots)
```

### Typography constants

```
FIXED_FONT = 28px    (same for ALL columns — no per-item font size changes)
LINE_H     = 38px    (height per visual line, including wrapped lines)
ITEM_GAP   = 5px     (extra gap between items; NOT between wrapped lines)
DOT_R      = 7px     (bullet dot radius)
```

### Item layout within a box

```
dotCX = box.x + 6 + DOT_R          (center-x of bullet dot)
textX = dotCX + DOT_R + 9          (start-x of text)
maxW  = box.x + box.w - textX - 6  (max text width before wrapping)
```

### Smart wrap rule

- If item name fits in `maxW` → 1 line
- If not → split at last word boundary that fits on line 1
- Max 2 lines; line 2 truncated with `…` if still overflows
- Bullet dot only on line 1; wrapped continuation starts at `textX`

### Canvas drawing (textBaseline = 'middle')

```
curY = box.y   // absolute template Y, top-aligned
for each item:
  lines = smartWrap(item.name)
  itemH = lines.length * LINE_H
  if curY + itemH > box.y + box.h: skip (safety)
  for each line at index li:
    cy = curY + li * LINE_H + LINE_H / 2   // vertical center of line
    draw dot at (dotCX, cy) — first line only
    draw text at (textX, cy) with textBaseline='middle'
  curY += itemH + ITEM_GAP
```

### Capacity (max items before box overflows)

| Box | Height | Single-line capacity | With 1 wrap |
|---|---|---|---|
| VEG | 690px | ~16 items (690÷43) | fewer |
| NONVEG | 690px | ~16 items | fewer |
| SIDES | 408px | ~9 items | fewer |
| DESSERTS | 130px | 3 items (3×38+2×5=124px) | 2 items |

### Title

- Font: bold, serif; size auto-scaled from 74px down to 36px minimum
- Color: `#7A0000` (dark crimson)
- Centered horizontally in TITLE box
- Text: `"{Day} {MealType} Buffet"`

### Column colors

| Column | Dot color | Text color |
|---|---|---|
| Veg | `#1A6E1A` (dark green) | `#1A0800` (near-black brown) |
| Sides | `#5C5C2E` (olive) | `#1A0800` |
| Desserts | `#A05000` (amber-brown) | `#1A0800` |
| Non-Veg | `#8B0000` (dark red) | `#1A0800` |

---

## HTML Preview (PosterCanvas.tsx)

The preview must **exactly mirror** the canvas output — the design principle is "preview = download."

### Key implementation rules

1. Root div: `position: relative`, `width: 100%`, `aspectRatio: 1024/1819`, `containerType: 'inline-size'` (required for `cqw` units)
2. Template image: `position: absolute, inset: 0, width: 100%, height: 100%, objectFit: fill`
3. Each column is a wrapper div: `position: absolute` at the box's `left/top/width/height` as `%` of `TW/TH`
4. Inside the wrapper, each visual line is a row div:
   - `position: absolute`
   - `top = (yOffset / box.h * 100)%` — `yOffset` is the TOP of the line relative to box top (NOT center)
   - `height = (LINE_H / box.h * 100)%`
5. Dot and text inside each row:
   - Both `position: absolute`, `top: 50%`, `transform: translateY(-50%)` to center within the row
   - This matches canvas `cy = yOffset + LINE_H/2` with `textBaseline: 'middle'`
6. Font sizes use `cqw` (container query width): `(px / TW * 100).toFixed(3)cqw`
7. Percentages are relative to their containing block, NOT the full template — row `top%` is relative to wrapper `height` (`box.h`)

### Critical bug to avoid

**Wrong:** `yOffset = curY + li * LINE_H + LINE_H * 0.5` — this places the row TOP at the line CENTER, making content appear half a line too low.

**Correct:** `yOffset = curY + li * LINE_H` (line TOP), then `top: 50%; transform: translateY(-50%)` on content.

---

## iOS Download

`window.open('', '_blank')` **must** be called BEFORE any `await`, or the browser treats it as a popup and blocks it.

```typescript
// iOS PNG download pattern:
const tab = window.open('', '_blank');   // BEFORE any await
if (!tab) { alert('Allow pop-ups...'); return; }
const canvas = await generatePosterCanvas(config);
const dataUrl = canvas.toDataURL('image/png', 1.0);
tab.document.write(`... <img src="${dataUrl}"> ...`);
tab.document.close();
// User then long-presses image → Save to Photos
```

iOS detection:
```typescript
/iPad|iPhone|iPod/.test(navigator.userAgent) ||
(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
```

---

## Data Layer

### Supabase (preferred)

Set env vars:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Table: `menu_items` with columns: `id (uuid)`, `name`, `category`, `is_default`, `is_active`, `sort_order`, `created_at`.

RLS: public SELECT, authenticated ALL.

### localStorage fallback (no Supabase)

Keys: `amulya_veg_items`, `amulya_nonveg_items`, `amulya_dessert_items`, `amulya_accompaniments`.

If localStorage is empty, falls back to the static `DEFAULT_*` arrays in `lib/menuData.ts`.

---

## Visual Design (App UI)

- Background: `#0c0a09` (near-black, `stone-950`)
- Surface: `stone-900` / `stone-800`
- Primary accent: `#C9A84C` → `#F0C96B` (gold gradient, Playfair Display headings)
- Interactive: amber-700 tones
- Text: `stone-100` / `stone-300` / `stone-400`
- Borders: `stone-700/40`–`stone-800`
- Max width: `max-w-lg` (centered, mobile-first)
- Font (UI): Playfair Display
- Font (poster): Book Antiqua / Palatino Linotype / Georgia (serif fallback chain)

---

## Menu Library (seed data)

### Veg (53 items — highlights)
Tomato Dal, Methi Chaman, Saag Paneer, Sambar, Paneer 65 Biryani, Paneer 555 Biryani, Gutti Vankaya Biryani, Mylavaram Paneer Biryani, Bezawada Paneer Biryani, Mushroom Masala, Mushroom Curry, Spinach Curry, Vegetable Kurma, Kandhari Vegetables, Aloo Gobi, Tindora Fry, Karela Fry, Okra Fry, Potato Fry, Cabbage Fry, Eggplant Curry, Eggplant Bajji, Gobi 65, Gobi Pakora, Veg Pakora, Paneer Pakora, Onion Samosa, Onion Pakora, Bonda, Mysore Bonda, Wada, Punugulu, Chitti Punugulu, French Fries, Baby Corn, Dry Baby Corn, Loose Baby Corn, Cut Mirchi, Masala Papad, Jeera Rice, Tamarind Rice, Pulihara, Curd Rice, Kashmir Pulao, Paneer Fried Rice, Jackfruit Biryani, Oppu Curry, Appadam Bajji, Snake Gourd Majjiga Charu, Maggiga Charu, Pottlakaya Perugu Chutney, Turia with Chana Dal, Turiya Chana Dal

### Non-Veg (21 items)
Goat Curry, Lamb Curry, Apollo Fish, Nellore Fish Curry, Gongura Shrimp Curry, Chintachiguru Shrimp Curry, Chicken Tikka Masala, Butter Chicken, Meat Balls Curry, Tandoori Chicken, Chicken Seekh Kabab, Chicken Fry Curry, Chicken 65 Biryani, Chicken 555 Biryani, Bezawada Chicken Biryani, Mylavaram Chicken Biryani, Chicken Mughlai Biryani, Gongura Chicken Biryani, Natukodi Pulusu, Tandoori Chicken Biryani, Chicken Dum Biryani

### Desserts (11 items)
Fruit Custard, Coconut Mousse, Gulab Jamun, Kheer Badam, Pineapple Kesari, Mango Mousse, Semiya Payasam, Carrot Halwa, Laddu, Mango Kesari, Saggu Biyyam Semiya Payasam

### Accompaniments (8 items — always shown, not selectable)
Chutneys, Fryams, Salads, Naan, Tea, White Rice, Raita, Roti Chutney

---

## Key Solved Problems (don't re-introduce these bugs)

### 1. Preview/canvas vertical alignment
Canvas: `cy = curY + li * LINE_H + LINE_H/2` with `textBaseline: 'middle'`
Preview: row `top = yOffset%` where `yOffset = curY + li * LINE_H`, content has `top: 50%; transform: translateY(-50%)`
These are mathematically identical. Do NOT add `LINE_H * 0.5` to `yOffset`.

### 2. Desserts box position
DESSERTS box: `y=1100, h=130`. The ornate "Desserts" label on the template is at ~y=1237. Items must end by y=1230 (130px fits 3 single-line items: 3×38+2×5=124px).

### 3. iOS download blocked
`window.open()` must happen synchronously in the click handler before any `await`. If called after an await, the browser blocks it as a popup.

### 4. CSS `cqw` units
Container must have `containerType: 'inline-size'` set on the same element that defines 100% width. Without this, `cqw` resolves incorrectly.

### 5. Absolute children in flex containers
Absolutely positioned children do NOT participate in flexbox alignment. `alignItems: center` has no effect on them. Use `top: 50%; transform: translateY(-50%)` explicitly.

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Both optional — app works fully without Supabase using localStorage + static menu data.

---

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
