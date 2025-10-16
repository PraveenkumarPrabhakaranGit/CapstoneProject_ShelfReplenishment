# ShelfMind Theme Documentation

## Overview

This document outlines the unified, modern, and clean theme implemented for the ShelfMind application. The theme is designed to provide a professional and consistent look and feel across all pages, avoiding dark themes and focusing on a clean, retail-focused aesthetic.

## Color Palette

### Primary Brand Colors
- **Primary Blue**: `#2563eb` (blue-600) - Main brand color used for primary actions and branding
- **Primary Light**: `#93c5fd` (blue-300) - Lighter variant for backgrounds and subtle accents
- **Primary Dark**: `#1d4ed8` (blue-700) - Darker variant for hover states and emphasis

### Background Colors
- **Main Background**: `#f8fafc` (slate-50) - Light, professional background
- **Card Background**: `#ffffff` (white) - Clean white cards with subtle shadows
- **Secondary Background**: `#f1f5f9` (slate-100) - Subtle secondary backgrounds

### Text Colors
- **Primary Text**: `#0f172a` (slate-800) - Main text color for high contrast
- **Secondary Text**: `#64748b` (slate-500) - Secondary text for less prominent content
- **Muted Text**: `#94a3b8` (slate-400) - Muted text for subtle information

### Status Colors

#### Operational Status
- **Healthy**: `#22c55e` (green-500) - Good stock levels, completed tasks
- **Warning**: `#f59e0b` (amber-500) - Medium priority, attention needed
- **Critical**: `#ef4444` (red-500) - Low stock, high priority, urgent actions
- **Info**: `#3b82f6` (blue-500) - Informational content, neutral status

#### Priority Levels
- **Low Priority**: `#64748b` (slate-500) - Low urgency tasks
- **Medium Priority**: `#f59e0b` (amber-500) - Moderate urgency tasks
- **High Priority**: `#ef4444` (red-500) - High urgency, critical tasks

## Typography

### Font Family
- **Primary Font**: Inter (Google Fonts)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.)

### Font Weights
- **Light**: 300 - Subtle text, large headings
- **Regular**: 400 - Body text, standard content
- **Medium**: 500 - Emphasized text, labels
- **Semibold**: 600 - Headings, important text
- **Bold**: 700 - Strong emphasis, critical information

### Responsive Typography
- **Small**: `text-sm md:text-base` - Responsive small text
- **Base**: `text-base md:text-lg` - Responsive body text
- **Large**: `text-lg md:text-xl` - Responsive large text
- **Extra Large**: `text-xl md:text-2xl` - Responsive headings

## Component Styling

### Cards
- **Standard Card**: White background, subtle border, soft shadow
- **Elevated Card**: Enhanced shadow, hover effects, interactive feel
- **Interactive Card**: Hover states, cursor pointer, border color changes

### Buttons
- **Primary Button**: Blue gradient, white text, hover effects, subtle shadow
- **Secondary Button**: Light gray background, dark text, hover effects

### Status Indicators
- **Badges**: Rounded corners, colored backgrounds, bold text
- **Pills**: Fully rounded, subtle colors, consistent sizing

## Layout and Spacing

### Container Widths
- **Content Max Width**: `max-w-7xl` - Maximum content width
- **Section Padding**: Responsive padding for different screen sizes
- **Card Padding**: Consistent internal spacing for cards

### Border Radius
- **Standard**: `0.5rem` (8px) - Default rounded corners
- **Large**: `0.75rem` (12px) - Cards and larger elements
- **Extra Large**: `1rem` (16px) - Hero sections and prominent elements

### Shadows
- **Subtle**: `shadow-sm` - Light shadow for cards
- **Medium**: `shadow-md` - Standard shadow for elevated elements
- **Large**: `shadow-lg` - Prominent shadow for important elements
- **Extra Large**: `shadow-xl` - Maximum shadow for hero elements

## Animation and Transitions

### Standard Transitions
- **Duration**: `0.2s ease-in-out` - Quick, smooth transitions
- **Hover Effects**: Subtle scale and shadow changes
- **Focus States**: Ring-based focus indicators for accessibility

### Custom Animations
- **Fade In**: Smooth opacity transition for new content
- **Slide Up**: Subtle upward movement for appearing elements

## Utility Classes

### Brand Utilities
- `.brand-gradient` - Primary brand gradient background
- `.brand-gradient-subtle` - Subtle brand gradient for backgrounds

### Status Utilities
- `.status-healthy` - Green status indicator styling
- `.status-warning` - Amber warning indicator styling
- `.status-critical` - Red critical indicator styling
- `.status-info` - Blue informational indicator styling

### Priority Utilities
- `.priority-low` - Low priority task styling
- `.priority-medium` - Medium priority task styling
- `.priority-high` - High priority task styling

### Layout Utilities
- `.retail-bg` - Main application background gradient
- `.retail-card` - Standard card styling with hover effects
- `.retail-header` - Header styling with backdrop blur
- `.section-padding` - Responsive section padding
- `.card-padding` - Consistent card internal padding
- `.content-max-width` - Maximum content width container

## CSS Custom Properties

### Theme Variables
```css
--brand-primary: 37 99 235; /* blue-600 */
--brand-primary-light: 147 197 253; /* blue-300 */
--brand-primary-dark: 29 78 216; /* blue-700 */

--status-healthy: 34 197 94; /* green-500 */
--status-warning: 245 158 11; /* amber-500 */
--status-critical: 239 68 68; /* red-500 */
--status-info: 59 130 246; /* blue-500 */

--priority-low: 100 116 139; /* slate-500 */
--priority-medium: 245 158 11; /* amber-500 */
--priority-high: 239 68 68; /* red-500 */
```

## Accessibility

### Focus States
- **Ring-based Focus**: Consistent focus rings using brand colors
- **High Contrast**: Sufficient contrast ratios for all text
- **Keyboard Navigation**: Clear focus indicators for all interactive elements

### Color Contrast
- **Text on Background**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear visual distinction between states
- **Status Indicators**: Distinct colors that work for colorblind users

## Implementation Notes

### Tailwind Configuration
The theme extends Tailwind CSS with custom brand colors, status colors, and priority colors defined in `tailwind.config.ts`.

### Global Styles
Enhanced styling is implemented in `globals.css` with utility classes and component styles that maintain consistency across the application.

### Responsive Design
The theme is fully responsive with mobile-first design principles, ensuring optimal experience across all device sizes.

## Usage Guidelines

### Do's
- Use the defined color palette consistently
- Apply proper spacing and typography scales
- Maintain consistent border radius and shadows
- Use status colors appropriately for their semantic meaning
- Implement hover and focus states for interactive elements

### Don'ts
- Don't use colors outside the defined palette
- Don't mix different shadow styles inconsistently
- Don't ignore responsive design principles
- Don't use dark theme elements (as specified in requirements)
- Don't compromise accessibility for visual design

## File Structure

```
frontend/
├── tailwind.config.ts          # Tailwind configuration with custom colors
├── src/
│   ├── globals.css            # Global styles and utility classes
│   └── pages/                 # Page components using the theme
│       ├── Index.tsx          # Homepage with theme implementation
│       ├── Login.tsx          # Login page with consistent styling
│       ├── AssociateDashboard.tsx  # Associate dashboard
│       └── ManagerDashboard.tsx    # Manager dashboard
└── THEME_DOCUMENTATION.md     # This documentation file
```

This theme provides a solid foundation for a professional, modern, and accessible retail application interface that maintains consistency across all pages while providing the flexibility needed for different content types and user roles.