# Read2Ship Developer Handoff

This document outlines the technical specifications for implementing the **Read2Ship** design system and screens. The project is designed to be built using **React, Tailwind CSS, and TypeScript**.

---

## 1. Design Tokens

### Colors (Hex Codes)
- **App Background:** `#17111b` (Near-black/Charcoal)
- **Main Surface:** `#1f1924` (Dark Gray)
- **Elevated Surface:** `#3d3742` (Bright Gray/Slate)
- **Primary Accent:** `#9333ea` (Purple) - Used for primary actions, branding, and active states.
- **Secondary Accent:** `#06b6d4` (Cyan) - Used for secondary data, themes, and highlights.
- **Success:** `#22c55e` (Green) - Used for completions and positive states.
- **Error:** `#ef4444` (Red) - Used for destructive actions or failure states.
- **Primary Text:** `#f8fafc` (Off-white)
- **Secondary Text:** `#94a3b8` (Muted Gray)
- **Outline/Border:** `rgba(255, 255, 255, 0.1)` (Subtle white border)

### Typography (Space Grotesk)
- **Hero Headline:** `font-display text-5xl font-bold tracking-tight`
- **Section Heading:** `font-display text-2xl font-semibold`
- **Subheading:** `font-display text-lg font-medium`
- **Body Base:** `font-body text-base leading-relaxed`
- **Metadata/Label:** `font-body text-sm text-secondary-text`
- **Code/Technical:** `font-mono text-xs uppercase tracking-wider`

### Spacing & Layout
- **Gutter:** `1.5rem (24px)`
- **Container Max-Width:** `1280px`
- **Card Padding:** `1.5rem (24px)`
- **Stack Gap:** `1rem (16px)` / `2rem (32px)`

### Shapes & Shadows
- **Border Radius:** `8px (ROUND_EIGHT)` for cards and buttons.
- **Shadows:** `flat` with subtle `0 0 20px rgba(147, 51, 234, 0.1)` glow for primary cards.

---

## 2. Component Breakdown

### Navigation
- **TopNavBar:** Fixed top, blurred background, contains logo, nav links, and "Sign Up" CTA.
- **SideNavBar:** Fixed left (Desktop), vertical tabs for Dashboard navigation.

### Cards
- **Article Preview Card:** Image thumbnail (left), title/source/tags (right).
- **Theme Score Card:** Horizontal progress bar showing match percentage for specific topics.
- **Task Card:** Numbered list items with title, description, and "Deliverable" badge.
- **Shareable Card:** Centered, high-polish card with gradient border or subtle glow.

### UI States
- **Loading State:** Centered spinner/icon with animated progress bar and cycling status text.
- **Error State:** Warning icon, error code block (red text), and "Reconnect/Refresh" action.
- **Empty State:** Illustrated icon with "Feed is a bit quiet" messaging and CTA to browse daily.dev.

---

## 3. Screen Implementation Guide

### [SCREEN_12] Landing Page
- **Structure:** Vertical scrolling layout with Hero -> Feature Grid -> CTA Footer.
- **Key Detail:** The Hero section features a "Transformation Preview" showing a small article card morphing into a task card.
- **Responsive:** Stacks 3-column features into a single column on mobile.

### [SCREEN_4] Connect Page
- **Structure:** Centered layout. Left side: API input card. Right side: "From/To" visual preview.
- **Key Detail:** Masked input for API token. The visual preview on the right uses a grid-based background.

### [SCREEN_2] Analysis Dashboard
- **Structure:** Sidebar + Main Grid.
- **Main Sections:** Profile header, 2-column grid for Themes and Intensity, full-width list for Recent Posts.
- **Key Detail:** "Generate Build Plan" is the floating primary action or prominent sidebar button.

### [SCREEN_7] Actionable Build Plan
- **Structure:** Sidebar + Content area. Features a prominent Project Header.
- **Main Sections:** Project overview (difficulty, time), Execution Plan (3-card grid), and "Inspired By" article footer.
- **Dynamic Logic:** The Execution Plan must support varying text lengths; cards should maintain equal height in a row.

### [SCREEN_10] Public Share Card
- **Structure:** Centered viewport. The card is fixed aspect ratio (optimized for 1200x630 sharing).
- **Key Detail:** Higher contrast than the dashboard. Use a heavier weight for "Build Next" title.

---

## 4. Interaction Notes

1. **API Token Entry:** On paste, trigger immediate validation. Transition to **Loading State** (Analyzing) upon clicking "Analyze My Reading".
2. **Generation Failure:** If the API returns < 5 posts, show the **Empty State**. If the token is rejected, show **Error State 02: Connection Unauthorized**.
3. **Download Card:** Should trigger a client-side render (e.g., html2canvas) of the `ShareablePlanCard` component as a PNG.
4. **Copy Link:** Copy the unique build URL (e.g., `read2ship.dev/p/user123`) to the clipboard with a toast confirmation.

---

## 5. Export Guidance

1. **Design System:** Use the `DESIGN.md` content to set up your Tailwind configuration (colors, spacing, typography).
2. **Assets:** Download the **Brand Logo (IMAGE_8)** as an SVG/PNG for the navbar.
3. **HTML/CSS:** Use the code from **SCREEN_7** and **SCREEN_10** as the primary blueprints for your React components. The CSS uses standard Tailwind classes.
4. **Data Interfaces:**
   ```typescript
   interface Task {
     id: string;
     title: string;
     description: string;
     deliverable: string;
     effort: string;
   }
   
   interface BuildPlan {
     projectTitle: string;
     difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
     estTime: string;
     stack: string[];
     tasks: Task[];
   }
   ```
