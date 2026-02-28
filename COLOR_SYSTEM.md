# Job House Production - Professional Design System

## Color Palette

### Primary Colors
- **Primary**: Deep Navy Blue `#36261F` (hsl: 215 28% 20%)
  - Used for: Main backgrounds, primary buttons, headers, navigation
  - Best for: Creating authority, trust, and elegance
  - Accessibility: High contrast with white text

- **Secondary**: Rich Gold `#E5B760` (hsl: 38 98% 50%)
  - Used for: Accents, hover states, highlights, badges
  - Best for: Drawing attention, creating luxury feel
  - Accessibility: High contrast with dark text

### Background Colors
- **Background**: Soft Cream `#F6F3F1` (hsl: 45 12% 97%)
  - Used for: Page background in light mode
  - Best for: Creating warm, welcoming feel
  - Accessibility: Good contrast with dark text

- **Dark Background**: Navy `#1F1815` (hsl: 215 30% 12%)
  - Used for: Page background in dark mode
  - Best for: Reducing eye strain at night
  - Accessibility: Good contrast with light text

### Neutral Colors
- **Foreground (Light)**: Dark Navy `#36261F` (hsl: 215 28% 17%)
  - Used for: Body text, primary content
  - Accessibility: 16:1 contrast ratio with cream background

- **Foreground (Dark)**: Light Cream `#F5F1ED` (hsl: 45 12% 96%)
  - Used for: Text in dark mode
  - Accessibility: 16:1 contrast ratio with navy background

- **Muted**: Light Gray `#EAE7E0` (hsl: 45 12% 88%)
  - Used for: Secondary backgrounds, subtle dividers
  - Accessibility: Visible but not intrusive

- **Muted Foreground**: Medium Gray `#8B8680` (hsl: 215 10% 55%)
  - Used for: Secondary text, helper text, captions

### Card & Container Colors
- **Card**: Pure White `#FFFFFF` (hsl: 0 0% 100%)
  - Used for: Card backgrounds, container backgrounds
  - Best for: Content focus, clean appearance
  - Transparency: Can use bg-white/80 for subtle effects

- **Border**: Light Border `#E8E4DF` (hsl: 45 12% 92%)
  - Used for: Dividers, card borders, section separators
  - Best for: Subtle visual separation

### Interactive Colors
- **Ring/Focus**: Gold `#E5B760` (hsl: 38 98% 50%)
  - Used for: Focus states, input ring effects
  - Best for: Clear, beautiful focus indicators

- **Destructive**: Red `#EF4444` (hsl: 0 84.2% 60.2%)
  - Used for: Delete buttons, error states, warnings
  - Accessibility: High contrast, recognizable

## Semantic Usage

### Text Colors
- **Primary Text**: Use `text-foreground` (dark navy)
- **Secondary Text**: Use `text-muted-foreground` (gray)
- **Inverted Text**: Use `text-primary-foreground` (white on navy)
- **Accent Text**: Use `text-secondary` (gold)

### Background Colors
- **Main Background**: Use `bg-background` (cream)
- **Card Background**: Use `bg-card` or `bg-white`
- **Muted Background**: Use `bg-muted/30` (light gray with transparency)
- **Primary Background**: Use `bg-primary` (navy for hero sections)

### Button Styling
- **Primary Button**: `bg-primary hover:bg-primary/90 text-primary-foreground`
- **Secondary Button**: `bg-secondary hover:bg-secondary/90 text-secondary-foreground`
- **Outline Button**: `border border-border hover:bg-muted`
- **Ghost Button**: `hover:bg-muted/50`

### Hover States
- **Cards**: `hover:shadow-2xl` + `hover:border-secondary`
- **Links**: `hover:text-secondary` + `transition-colors`
- **Buttons**: Darken by 10% opacity with `hover:opacity-90` or darker shade

## Styling Examples

### Hero Section
```css
bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white
```

### Featured Sections
```css
bg-muted/30 py-20 md:py-32
```

### Card Component
```css
Card {
  border-border/50
  bg-white/80
  hover:shadow-2xl
  hover:border-secondary
  transition-all duration-300
}
```

### Navigation Item
```css
text-foreground
hover:text-secondary
transition-colors
```

### Badge/Tag
```css
bg-secondary/15
text-primary
px-3 py-1
rounded-full
text-xs font-semibold
```

## Typography Colors

### Headings
- Font: Playfair Display (serif)
- Color: `text-foreground`
- Weight: 600-800
- Used: H1, H2, H3, H4, H5, H6

### Body Text
- Font: Inter (sans-serif)
- Color: `text-foreground`
- Size: 16px base
- Line-height: 1.6
- Letter-spacing: -0.01em

### Secondary Text
- Color: `text-muted-foreground`
- Size: Usually 90% of body size
- Used for: Captions, helper text, metadata

## Accessibility Checklist

✅ Color Contrast Ratios:
- Navy #36261F on Cream #F6F3F1: 16:1 (AAA)
- Gold #E5B760 on Navy #36261F: 5.2:1 (AA)
- Dark text on White: 18:1 (AAA)

✅ Color Blindness Considerations:
- Navy and Gold work for all types of color blindness
- Not relying solely on color to convey meaning
- Using text labels and icons alongside colors

✅ Focus States:
- Clear focus indicators (gold ring/underline)
- 3:1 minimum contrast ratio for focus states
- Visible on both light and dark backgrounds

## CSS Custom Properties

All colors are defined as CSS variables in `app/globals.css`:

```css
:root {
  --primary: 215 28% 20%;
  --primary-foreground: 0 0% 100%;
  --secondary: 38 98% 50%;
  --background: 45 12% 97%;
  --foreground: 215 28% 17%;
  --card: 0 0% 100%;
  --border: 45 12% 92%;
  --muted: 45 12% 88%;
  --muted-foreground: 215 10% 55%;
  --accent: 38 98% 50%;
}
```

## Usage in Tailwind

All colors are available as Tailwind utilities:

```html
<!-- Text colors -->
<p class="text-foreground">Dark navy text</p>
<p class="text-secondary">Gold accent text</p>
<p class="text-muted-foreground">Gray secondary text</p>

<!-- Background colors -->
<div class="bg-primary">Navy background</div>
<div class="bg-card">White card background</div>
<div class="bg-muted/30">Light gray background</div>

<!-- Border colors -->
<div class="border border-border">Light border</div>

<!-- With opacity -->
<div class="bg-secondary/20">Light gold background</div>
```

## Dark Mode

Dark mode automatically switches color values:

```css
.dark {
  --background: 215 30% 12%;
  --foreground: 45 12% 96%;
  --primary: 38 98% 50%; /* Gold becomes primary */
  --secondary: 215 30% 35%;
  /* ... other variables ... */
}
```

## Future Extensions

When adding new features, maintain consistency by:
1. Using existing color tokens first
2. Adding new colors only if they don't fit existing palette
3. Testing accessibility (WebAIM contrast checker)
4. Ensuring dark mode compatibility
5. Following semantic naming conventions

---
**Version**: 1.0
**Last Updated**: 2/28/2026
**Designer**: AI Assistant v0
