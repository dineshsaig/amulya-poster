# Amulya Buffet Poster — Font Guide

## Current Fonts Used

### Primary: Book Antiqua / Palatino (Serif)
**Why:** Elegant, classic, matches the reference design's luxury aesthetic

**Stack (fallback order):**
```css
font-family: "Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif;
```

- **Book Antiqua** — Preferred (Windows/most systems)
- **Palatino Linotype** — Fallback (alternative Palatino)
- **Palatino** — Older system
- **Georgia** — Web-safe serif fallback

---

## Font Options for Future Customization

| Font | Style | Use Case | Notes |
|------|-------|----------|-------|
| **Book Antiqua** | Serif, elegant | ✅ Current choice — menu items | Premium, readable at small sizes |
| **Palatino** | Serif, classic | ✅ Alternative to Book Antiqua | Slightly more formal |
| **Georgia** | Serif, modern | Alternative | Web-optimized, less luxurious |
| **Garamond** | Serif, sophisticated | High-end posters | Requires web font import |
| **Playfair Display** | Serif, dramatic | Headers (not current) | Google Font, decorative |
| **EB Garamond** | Serif, refined | Premium menus | Google Font, excellent readability |
| **Cormorant Garamond** | Serif, upscale | Luxury restaurants | Google Font, very elegant |
| **Crimson Text** | Serif, warm | Traditional Indian feel | Google Font, readable |

---

## Font Sizing Strategy

**Current implementation (auto-scaling):**
- Minimum: 7.5px
- Maximum: 10.5px
- Scales down automatically if too many items
- Maintains 19px line-height for vertical alignment

**Examples:**
- 5 veg items → 10.5px (lots of space)
- 12 veg items → 8.5px (tight but readable)
- 15 veg items → 7.8px (compressed)

---

## Color Matching

| Element | Color | RGB | Hex |
|---------|-------|-----|-----|
| Veg bullet | Green | (46, 125, 50) | #2E7D32 |
| Non-Veg bullet | Red | (183, 28, 28) | #B71C1C |
| Sides bullet | Gold | (139, 105, 20) | #8B6914 |
| Desserts bullet | Gold | (218, 165, 32) | #DAA520 |
| Text | Dark brown | (26, 8, 0) | #1A0800 |

---

## To Change Fonts Globally

Edit `/components/poster/PosterCanvas.tsx` line 26:

```tsx
fontFamily: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
```

### Example: Switch to Garamond
```tsx
fontFamily: '"Garamond", "Times New Roman", serif',
```

### Example: Use Google Fonts (add to layout.tsx)
```tsx
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&display=swap');
```

Then:
```tsx
fontFamily: '"EB Garamond", serif',
```

---

## Recommendations

**For current design:** Stick with Book Antiqua/Palatino
- ✅ System font (no loading delay)
- ✅ Perfectly matches reference design
- ✅ Readable at small sizes
- ✅ Professional, elegant

**For future upgrade:** Consider EB Garamond or Cormorant Garamond if you want:
- Even more luxury feel
- Slightly better online rendering
- Premium restaurant positioning

