# Shadcn UI Migration Summary

This document outlines the refactoring of Color Guru's common UI components to use Shadcn UI components.

## What Was Changed

### 1. Dependencies Installed

**Core Dependencies:**
- `tailwindcss` - CSS framework
- `postcss` & `autoprefixer` - CSS processing
- `@tailwindcss/postcss` - New Tailwind v4 PostCSS plugin
- `tailwindcss-animate` - Animation utilities
- `class-variance-authority` - CVA for component variants
- `clsx` & `tailwind-merge` - Class name utilities
- `@types/node` - TypeScript types for Node.js

**Radix UI Primitives:**
- `@radix-ui/react-dialog` - For ExportModal
- `@radix-ui/react-tabs` - For ExportModal tabs
- `@radix-ui/react-tooltip` - For Tooltip component
- `@radix-ui/react-checkbox` - For checkboxes
- `@radix-ui/react-select` - For dropdown selects
- `@radix-ui/react-slider` - For range sliders
- `@radix-ui/react-label` - For form labels

### 2. Configuration Files Created/Updated

**New Files:**
- `tailwind.config.js` - Tailwind CSS configuration with Shadcn theme
- `postcss.config.js` - PostCSS configuration for Tailwind v4
- `src/lib/utils.ts` - Utility function for class name merging (`cn`)

**Updated Files:**
- `tsconfig.json` - Added path alias `@/*` → `./src/*`
- `vite.config.ts` - Added path alias resolution for `@`
- `src/index.css` - Migrated to Tailwind v4 syntax with CSS variables

### 3. Shadcn UI Components Created

All components are located in `src/components/ui/`:

1. **Button** (`button.tsx`)
   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon
   - Full accessibility support

2. **Dialog** (`dialog.tsx`)
   - Complete modal/dialog system
   - Includes: DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
   - Animated transitions
   - Used by: ExportModal

3. **Tabs** (`tabs.tsx`)
   - Tabbed interface component
   - Includes: TabsList, TabsTrigger, TabsContent
   - Keyboard navigation support
   - Used by: ExportModal

4. **Tooltip** (`tooltip.tsx`)
   - Radix-based tooltip with positioning
   - Includes: TooltipProvider, TooltipTrigger, TooltipContent
   - Configurable delay duration
   - Used throughout the app

5. **Checkbox** (`checkbox.tsx`)
   - Accessible checkbox with indicator
   - Full keyboard support
   - Used by: ExportModal options

6. **Select** (`select.tsx`)
   - Dropdown select component
   - Includes: SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectGroup
   - Scroll buttons for long lists
   - Ready for curve/language selectors

7. **Slider** (`slider.tsx`)
   - Range slider component
   - Touch and keyboard support
   - Ready for HSB parameter controls

8. **Input** (`input.tsx`)
   - Text input with consistent styling
   - Support for all input types
   - Ready for hex color input

9. **Label** (`label.tsx`)
   - Form label component
   - Accessibility support
   - Ready for form controls

### 4. Refactored Components

#### Tooltip.tsx
**Before:**
- Custom implementation with useState
- Manual visibility management
- Separate CSS file

**After:**
- Uses Shadcn Tooltip with Radix UI
- Built-in positioning and animations
- No separate CSS file needed
- Better accessibility

#### ExportModal.tsx
**Before:**
- Custom modal with backdrop
- Manual tab switching with state
- Custom button and checkbox styling
- Separate CSS file (ExportModal.css)

**After:**
- Uses Shadcn Dialog component
- Uses Shadcn Tabs component
- Uses Shadcn Button and Checkbox
- Cleaner, more maintainable code
- Consistent styling with design system
- Better accessibility out of the box

**Backup:** The old implementation is preserved as `ExportModal.old.tsx`

### 5. CSS Architecture

**Tailwind v4 Approach:**
- Uses `@import "tailwindcss"` instead of separate `@tailwind` directives
- CSS variables defined in `:root` for theming
- HSL color format for better color manipulation
- Design tokens for spacing, colors, borders, etc.

**CSS Variables:**
```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--card, --card-foreground
--popover, --popover-foreground
--border, --input, --ring
--radius
```

### 6. Ready for Further Migration

The following components are ready to be migrated when needed:

**App.tsx controls can use:**
- `Select` - for curve/language dropdowns
- `Slider` - for HSB parameter sliders
- `Input` - for pinned color hex input
- `Label` - for form labels
- `Button` - for reset/export buttons

**Benefits of future migration:**
- Consistent styling across the app
- Better accessibility
- Reduced custom CSS
- Easier theming and customization

## How to Use Shadcn Components

### Example: Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Click me</Button>
<Button variant="outline" size="sm">Small outline</Button>
<Button variant="ghost" size="icon">🔍</Button>
```

### Example: Tooltip
```tsx
import { Tooltip } from "@/components/Tooltip"

<Tooltip content="This is helpful info">
  <button>Hover me</button>
</Tooltip>
```

### Example: Dialog
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>My Dialog</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## Build & Development

All commands work as before:
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Migration Benefits

1. **Consistency** - All components follow the same design system
2. **Accessibility** - Radix UI primitives are fully accessible (WCAG compliant)
3. **Maintainability** - Less custom code to maintain
4. **Customization** - Easy to theme via CSS variables
5. **Developer Experience** - TypeScript support, better autocomplete
6. **Performance** - Optimized components with proper React patterns
7. **Future-proof** - Based on widely adopted standards (Radix UI)

## Notes

- Old component implementations are backed up with `.old.tsx` extension
- All existing functionality is preserved
- The app maintains the same visual appearance
- CSS files can be gradually removed as components are migrated
- Tailwind v4 syntax is used (`@import "tailwindcss"`)
