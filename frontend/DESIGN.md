# Design System

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.3.4 |
| UI Library | React | 19.2.8 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Component Library | shadcn/ui | v4 (base-maia style) |
| Headless Primitives | @base-ui/react | ^1.7.0 |
| Variants | class-variance-authority | ^0.7.1 |
| Class Merging | tailwind-merge + clsx | ^3.6.0 / ^2.1.1 |
| Icons | lucide-react | ^1.38.0 |
| Theme | next-themes | ^0.4.6 |
| Animations | tw-animate-css | ^1.4.0 |
| Package Manager | pnpm | 10.18.0 |

## Architecture

- **CSS-first configuration** — No `tailwind.config.js`. All design tokens live in `styles/globals.css` via Tailwind v4 `@theme inline` blocks.
- **Semantic color system** — All colors defined as CSS custom properties using OKLCH color space. Components use semantic utility classes (e.g., `bg-primary`, `text-muted-foreground`) with no hardcoded values.
- **Component composition** — shadcn/ui components built on `@base-ui/react` primitives with `data-slot` attributes for CSS targeting. Variant styling via CVA. All class merging through `cn()` utility.
- **Route groups** — `(user)` for authenticated app shell (sidebar + header), `(authentication)` for login/signup (centered layout).

## Brand Identity

- **Product name:** Sunset — AI Job Application Tracker
- **Sidebar branding:** "Sunset" text in sidebar header
- **Color scheme:** Blue primary, neutral grays, red destructive

## Color Palette

All tokens use OKLCH. Light mode values listed; dark mode overrides are in `styles/globals.css`.

### Core Colors

| Token | Usage | Light Value |
|---|---|---|
| `--primary` | Brand color, buttons, links | `oklch(0.5 0.134 242.749)` — deep blue |
| `--primary-foreground` | Text on primary | `oklch(0.977 0.013 236.62)` — near-white |
| `--secondary` | Secondary backgrounds | `oklch(0.967 0.001 286.375)` — light gray-blue |
| `--secondary-foreground` | Text on secondary | `oklch(0.21 0.006 285.885)` |
| `--destructive` | Errors, danger | `oklch(0.577 0.245 27.325)` — red |
| `--accent` | Accent backgrounds | `oklch(0.97 0 0)` — light gray |
| `--accent-foreground` | Text on accent | `oklch(0.205 0 0)` |

### Surface Colors

| Token | Usage | Light Value |
|---|---|---|
| `--background` | Page background | `oklch(1 0 0)` — white |
| `--foreground` | Default text | `oklch(0.145 0 0)` — near-black |
| `--card` | Card background | `oklch(1 0 0)` |
| `--card-foreground` | Card text | `oklch(0.145 0 0)` |
| `--popover` | Popover/dropdown background | `oklch(1 0 0)` |
| `--popover-foreground` | Popover text | `oklch(0.145 0 0)` |
| `--muted` | Muted backgrounds | `oklch(0.97 0 0)` |
| `--muted-foreground` | Subdued text | `oklch(0.556 0 0)` |

### Border & Input

| Token | Usage | Light Value |
|---|---|---|
| `--border` | Default borders | `oklch(0.922 0 0)` — light gray |
| `--input` | Input borders | `oklch(0.922 0 0)` |
| `--ring` | Focus rings | `oklch(0.708 0 0)` — gray |

### Sidebar

| Token | Usage |
|---|---|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Active sidebar items |
| `--sidebar-accent` | Hover/active sidebar backgrounds |
| `--sidebar-border` | Sidebar dividers |

### Dark Mode Differences

- Borders become semi-transparent: `oklch(1 0 0 / 10%)`
- Primary shifts to a lighter blue: `oklch(0.443 0.11 240.79)`
- Destructive shifts lighter: `oklch(0.704 0.191 22.216)`
- Background inverts to near-black: `oklch(0.145 0 0)`

## Typography

| Font | CSS Variable | Usage |
|---|---|---|
| **Geist** | `--font-sans` / `--font-heading` | Body text, headings (applied to `<html>`) |
| **Geist Mono** | `--font-mono` | Monospace contexts |

**Weights used:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

**Text scale:** `text-xs` through `text-2xl`, with headings typically `text-base font-medium` to `text-2xl font-semibold`.

## Spacing & Layout

- **Header height:** `calc(--spacing(14))` (~3.5rem)
- **Sidebar width:** 16rem (expanded), 3rem (collapsed/icon mode), 18rem (mobile)
- **Page padding:** `p-6` (24px)
- **Component spacing:** Tailwind's default spacing scale (0.25rem increments)
- **Layout pattern:** Sidebar + header fixed; content in `SidebarInset` with overflow hidden

## Border Radius

Base radius: `0.625rem` (10px). Scaled via CSS calc:

| Token | Scale | Value |
|---|---|---|
| `--radius-sm` | 0.6x | ~0.375rem |
| `--radius-md` | 0.8x | ~0.5rem |
| `--radius-lg` | 1x | 0.625rem |
| `--radius-xl` | 1.4x | ~0.875rem |
| `--radius-2xl` | 1.8x | ~1.125rem |
| `--radius-4xl` | 2.6x | ~1.625rem |

**Usage patterns:** `rounded-4xl` (buttons, inputs), `rounded-2xl` (cards, dropdowns, tooltips), `rounded-xl` (skeletons, menu items), `rounded-lg` (sidebar buttons).

## Borders & Shadows

- **Card borders:** `ring-1 ring-foreground/10` (subtle outline, not `border`)
- **Dark mode borders:** Semi-transparent `oklch(1 0 0 / 10%)`
- **Dropdown shadows:** `shadow-2xl` with `ring-1 ring-foreground/5`
- **Tooltip:** Solid `bg-foreground text-background` with `rounded-2xl`
- **Focus rings:** `ring-ring` with `ring-offset-background`

## Components

All components live in `components/ui/` (shadcn) or `components/reusables/` (app-specific).

### shadcn/ui Components

ALWAYS USE SHADCN COMPONENTS. 

| Component | Key Variants/Sizes |
|---|---|
| **Button** | Variants: default, outline, secondary, ghost, destructive, link. Sizes: xs, default, sm, lg, icon, icon-xs, icon-sm, icon-lg |
| **Card** | Sizes: default, sm. Sub-components: Header, Title, Description, Action, Content, Footer |
| **Input** | Single style. `rounded-4xl`, `h-9`, `bg-input/30` |
| **Avatar** | Sizes: default, sm, lg. Includes AvatarGroup and AvatarBadge |
| **DropdownMenu** | Item variants: default, destructive. 14 sub-components |
| **Field** | Orientations: vertical, horizontal, responsive. Includes FieldError for validation display |
| **Sheet** | Sides: top, right, bottom, left. Shows close button by default |
| **Sidebar** | Variants: sidebar, floating, inset. Collapsible: offcanvas, icon, none. 20 sub-components |
| **Tooltip** | Position props: side, sideOffset. Includes Arrow |
| **Breadcrumb** | Flat structure with ChevronRight separator and MoreHorizontal ellipsis |
| **Separator** | Horizontal or vertical orientation |
| **Skeleton** | `animate-pulse rounded-xl bg-muted` |
| **Collapsible** | Trigger + content pattern |
| **Label** | Styled with group-data support |

### App Components

| Component | Purpose |
|---|---|
| **PageHeader** | Title + optional description + actions slot. Used on every page. |
| **StatCard** | Card with label/value/hint and right-aligned icon. Used on dashboard. |
| **AppSidebar** | Composed sidebar with brand header, nav items, user footer. |
| **SiteHeader** | Sticky header with hamburger toggle + separator |
| **NavMain** | Sidebar navigation with active state detection via `usePathname()` |
| **NavUser** | Avatar + dropdown (settings, theme toggle, logout) in sidebar footer |
| **SearchForm** | Sidebar search input with icon overlay |
| **LoginForm / SignupForm** | Card-based forms with FieldGroup + Input composition |

## Icons

**Library:** Lucide React

**Commonly used:** LayoutDashboard, FileText, List, Mail, Briefcase, BarChart3, Users, Menu, ChevronRight, ChevronsUpDown, Settings, LogOut, Sun, Moon, Search, X, PanelLeft

**Convention:** PascalCase naming, imported individually per component.

## Animations

All animations from `tw-animate-css` — no custom `@keyframes` defined.

| Pattern | Usage |
|---|---|
| `animate-pulse` | Loading skeletons |
| `animate-in fade-in-0 zoom-in-95` | Dropdown/tooltip open |
| `animate-out fade-out-0 zoom-out-95` | Dropdown/tooltip close |
| `slide-in-from-{top,bottom,left,right}-2` | Dropdown/tooltip positioning |
| `transition-all` | Button hover/active |
| `transition-colors` | Input focus, breadcrumb hover |
| `transition-opacity` | Sheet overlay |
| `duration-200 ease-in-out` | Sheet content slide |
| `duration-200 ease-linear` | Sidebar width transitions |
| `translate-y-px` | Button active press effect |

## Responsive Breakpoints

Tailwind defaults (no custom breakpoints defined):

| Prefix | Width | Usage |
|---|---|---|
| `sm` | 640px | Sheet max-width, breadcrumb gaps, grid cols |
| `md` | 768px | Sidebar visibility, auth padding, mobile breakpoint |
| `lg` | 1024px | Dashboard grid (4 cols) |

**Mobile behavior:** Below 768px, sidebar renders as a Sheet overlay. Toggle via hamburger menu. Detected via `useIsMobile()` hook using `window.matchMedia`.

## Theme Support

- **Implementation:** `next-themes` with class-based strategy (`attribute="class"`)
- **Default:** System (follows OS preference)
- **Toggle:** Available in NavUser dropdown (Sun/Moon icons)
- **Custom variant:** `@custom-variant dark (&:is(.dark *))` in CSS
- **Flash prevention:** `disableTransitionOnChange` enabled

## Design Tokens & Constants

### CSS Custom Properties

All tokens defined in `styles/globals.css`. No separate token files.

### Sidebar Constants (in `sidebar.tsx`)

| Constant | Value |
|---|---|
| `WIDTH` | `16rem` |
| `MOBILE_WIDTH` | `18rem` |
| `ICON_WIDTH` | `3rem` |
| `COOKIE_KEY` | `sidebar_state` |
| `KEYBOARD_SHORTCUT` | `Ctrl/Cmd+B` |

### Layout Constants

| Variable | Value |
|---|---|
| `--header-height` | `calc(--spacing(14))` |
| `--card-spacing` | Set via Card `size` prop |

## Accessibility

- **Focus management:** Visible focus rings via `ring-ring` with offset
- **Error states:** `aria-invalid` styling on Input and Button components
- **Form labels:** Every input wrapped in `Field` with `FieldLabel` using `htmlFor`
- **Screen reader text:** `sr-only` labels for icon-only buttons and search form
- **Keyboard shortcuts:** `Ctrl/Cmd+B` for sidebar toggle
- **Semantic HTML:** `<nav>`, `<header>`, `<main>`, `<form>`, proper heading hierarchy
- **Group semantics:** `role="group"` with `aria-label` on avatar groups and button groups

## File Structure

```
frontend/
├── app/
│   ├── (authentication)/       # Login, signup pages
│   ├── (user)/                 # Authenticated app shell
│   │   ├── layout.tsx          # Sidebar + header layout
│   │   ├── dashboard/page.tsx
│   │   ├── tracker/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── cover-letter/page.tsx
│   │   ├── bullets/page.tsx
│   │   ├── job-fit/page.tsx
│   │   └── networking/page.tsx
│   ├── layout.tsx              # Root layout (fonts, theme)
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components (14)
│   ├── reusables/              # App-specific reusable components
│   ├── app-sidebar.tsx         # Sidebar composition
│   ├── site-header.tsx         # Sticky header
│   ├── nav-main.tsx            # Sidebar navigation
│   ├── nav-user.tsx            # User dropdown
│   ├── search-form.tsx         # Search input
│   ├── login-form.tsx          # Login form
│   ├── signup-form.tsx         # Signup form
│   └── theme-provider.tsx      # next-themes wrapper
├── hooks/
│   └── use-mobile.ts           # Mobile breakpoint detection
├── lib/
│   └── utils.ts                # cn() utility
├── styles/
│   ├── globals.css             # All design tokens + theme
│   └── fonts.ts                # Font definitions
├── public/
│   └── favicon.ico
└── components.json             # shadcn/ui configuration
```
