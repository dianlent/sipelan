# Panduan Animasi & UI/UX SIPELAN

## 🎨 Animasi yang Telah Diterapkan

### 1. Landing Page (Homepage)

#### Hero Section
```typescript
// Judul utama - Fade in dari atas
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}

// Deskripsi - Fade in dari bawah
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.2 }}

// CTA Buttons - Scale up
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.5, delay: 0.4 }}
```

#### Button Interactions
```typescript
// Hover effect - Scale up
whileHover={{ scale: 1.05 }}

// Click effect - Scale down
whileTap={{ scale: 0.95 }}

// Shadow enhancement
className="shadow-lg hover:shadow-xl transition-shadow"
```

#### Statistics Cards
```typescript
// Staggered entrance
delay: 0.1, 0.2, 0.3 (untuk setiap card)

// Hover lift effect
whileHover={{ y: -5, transition: { duration: 0.2 } }}

// Shadow on hover
className="hover:shadow-lg transition-shadow"
```

#### Feature Icons
```typescript
// Icon rotation on hover
whileHover={{ rotate: 360 }}
transition={{ duration: 0.5 }}

// Card scale on hover
whileHover={{ scale: 1.05 }}
```

### 2. Form Page (Buat Pengaduan)

#### Form Sections
```typescript
// Smooth entrance
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5 }}
```

#### Success Modal
```typescript
// Modal entrance
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}
```

#### Input Focus
```typescript
// Focus ring animation
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### 3. Tracking Page (Lacak Pengaduan)

#### Search Box
```typescript
// Entrance animation
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
```

#### Timeline Items
```typescript
// Staggered timeline
delay: index * 0.1

// Smooth reveal
initial={{ opacity: 0, x: -20 }}
whileInView={{ opacity: 1, x: 0 }}
```

## 🎯 Prinsip Animasi

### Timing
- **Fast**: 0.2s - Micro-interactions (hover, click)
- **Medium**: 0.4-0.6s - Page elements entrance
- **Slow**: 0.8-1s - Complex animations

### Easing
```typescript
// Default easing (smooth)
transition={{ duration: 0.5 }}

// Spring (bouncy)
transition={{ type: "spring", stiffness: 300 }}

// Custom cubic-bezier
transition={{ ease: [0.6, 0.01, -0.05, 0.9] }}
```

### Performance
- ✅ Use `transform` and `opacity` (GPU accelerated)
- ✅ Use `will-change` sparingly
- ✅ Avoid animating `width`, `height`, `top`, `left`
- ✅ Use `viewport={{ once: true }}` for scroll animations

## 🎨 UI/UX Improvements

### 1. Visual Hierarchy

#### Typography Scale
```css
H1 (Hero): text-3xl md:text-5xl (30px - 48px)
H2 (Section): text-2xl md:text-3xl (24px - 30px)
H3 (Card): text-xl (20px)
Body: text-base (16px)
Small: text-sm (14px)
Tiny: text-xs (12px)
```

#### Spacing System
```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### 2. Color System

#### Primary Colors
```css
Blue-600: #2563EB (Primary actions)
Blue-700: #1D4ED8 (Hover state)
Blue-50: #EFF6FF (Light backgrounds)
```

#### Status Colors
```css
Green: Success, Completed
Yellow: Warning, Pending
Blue: Info, In Progress
Red: Error, Rejected
Gray: Neutral, Disabled
```

#### Gradients
```css
Hero: from-blue-600 via-blue-700 to-blue-800
Card Hover: hover:from-blue-50 to-white
```

### 3. Shadows

```css
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

### 4. Border Radius

```css
sm: 0.125rem (2px)
md: 0.375rem (6px)
lg: 0.5rem (8px)
xl: 0.75rem (12px)
full: 9999px (circle)
```

### 5. Interactive States

#### Buttons
```typescript
// Default state
bg-blue-600 text-white

// Hover
hover:bg-blue-700 hover:shadow-lg

// Active/Click
active:scale-95

// Disabled
disabled:opacity-50 disabled:cursor-not-allowed

// Loading
<Loader2 className="animate-spin" />
```

#### Cards
```typescript
// Default
border rounded-lg shadow-sm

// Hover
hover:shadow-lg hover:-translate-y-1 transition-all

// Active
border-blue-500 ring-2 ring-blue-200
```

#### Inputs
```typescript
// Default
border border-gray-300

// Focus
focus:border-blue-500 focus:ring-2 focus:ring-blue-200

// Error
border-red-500 focus:ring-red-200

// Success
border-green-500 focus:ring-green-200
```

## 🚀 Micro-Interactions

### 1. Button Click Feedback
```typescript
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.1 }}
>
  Click Me
</motion.button>
```

### 2. Card Hover Effect
```typescript
<motion.div
  whileHover={{ 
    y: -5, 
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)" 
  }}
  transition={{ duration: 0.2 }}
>
  Card Content
</motion.div>
```

### 3. Icon Rotation
```typescript
<motion.div
  whileHover={{ rotate: 360 }}
  transition={{ duration: 0.5 }}
>
  <Icon />
</motion.div>
```

### 4. Stagger Children
```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### 5. Loading Spinner
```typescript
<Loader2 className="h-5 w-5 animate-spin" />
```

## 📱 Responsive Animations

### Mobile Optimizations
```typescript
// Reduce animation on mobile
const isMobile = window.innerWidth < 768;

<motion.div
  initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: isMobile ? 0.3 : 0.5 }}
>
```

### Reduce Motion
```typescript
// Respect user preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
>
```

## 🎭 Page Transitions

### Route Changes
```typescript
// In layout.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

## 🎨 Custom Animations

### Pulse Effect
```typescript
<motion.div
  animate={{
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  Pulsing Element
</motion.div>
```

### Shake Effect (Error)
```typescript
<motion.div
  animate={{
    x: [0, -10, 10, -10, 10, 0],
  }}
  transition={{
    duration: 0.5,
  }}
>
  Error Message
</motion.div>
```

### Slide In from Side
```typescript
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 100 }}
>
  Sidebar
</motion.div>
```

## ♿ Accessibility

### Focus Indicators
```css
focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-blue-500 
focus-visible:ring-offset-2
```

### Keyboard Navigation
- Tab order follows visual flow
- Skip links for main content
- Escape key closes modals
- Arrow keys for navigation

### Screen Readers
```typescript
<motion.div
  aria-live="polite"
  aria-label="Loading content"
>
  {isLoading && <Loader2 />}
</motion.div>
```

## 📊 Performance Tips

### 1. Use CSS Transforms
```typescript
// ✅ Good (GPU accelerated)
transform: translateY(-5px)

// ❌ Avoid (causes reflow)
top: -5px
```

### 2. Lazy Load Animations
```typescript
// Only animate when in viewport
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "100px" }}
>
```

### 3. Debounce Scroll Events
```typescript
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 300], [0, -50]);
```

### 4. Use will-change Sparingly
```css
/* Only for elements that will definitely animate */
.animating-element {
  will-change: transform;
}
```

## 🎯 Best Practices

### DO ✅
- Keep animations subtle and purposeful
- Use consistent timing across the app
- Provide visual feedback for all interactions
- Test on low-end devices
- Respect prefers-reduced-motion
- Use semantic HTML
- Maintain 60fps animations

### DON'T ❌
- Over-animate (causes distraction)
- Use long durations (>1s for UI)
- Animate on scroll excessively
- Forget loading states
- Ignore accessibility
- Animate layout properties
- Use animations as decoration only

## 🔧 Debugging

### Framer Motion DevTools
```typescript
import { MotionConfig } from "framer-motion";

<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

### Performance Monitoring
```typescript
// Check animation performance
const controls = useAnimation();

controls.start({
  x: 100,
  transition: {
    onComplete: () => console.log("Animation complete"),
    onUpdate: (latest) => console.log(latest)
  }
});
```

---

**Version**: 1.0  
**Last Updated**: 27 Oktober 2024  
**Framework**: Framer Motion 10.16.0
