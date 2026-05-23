---
name: Technical Builder
colors:
  surface: '#17111b'
  surface-dim: '#17111b'
  surface-bright: '#3d3742'
  surface-container-lowest: '#110c16'
  surface-container-low: '#1f1924'
  surface-container: '#231d28'
  surface-container-high: '#2e2832'
  surface-container-highest: '#39323e'
  on-surface: '#eadfee'
  on-surface-variant: '#cfc2d7'
  inverse-surface: '#eadfee'
  inverse-on-surface: '#342e39'
  outline: '#988ca0'
  outline-variant: '#4d4354'
  surface-tint: '#ddb8ff'
  primary: '#ddb8ff'
  on-primary: '#490080'
  primary-container: '#9333ea'
  on-primary-container: '#f6e6ff'
  inverse-primary: '#861fdd'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb86b'
  on-tertiary: '#492900'
  tertiary-container: '#9a5c00'
  on-tertiary-container: '#ffe8d4'
  error: '#EF4444'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb8ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6800b4'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86b'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#17111b'
  on-background: '#eadfee'
  surface-variant: '#39323e'
  bg-app: '#0A0A0B'
  surface-main: '#121214'
  surface-card: '#1A1A1D'
  surface-elevated: '#212124'
  border-subtle: '#2D2D30'
  text-primary: '#F5F5F7'
  text-secondary: '#A1A1AA'
  text-tertiary: '#71717A'
  success: '#22C55E'
  warning: '#F59E0B'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-code:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  metadata:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-max: 1200px
  sidebar-width: 260px
  gutter: 20px
---

# DESIGN.md — Read2Ship
## Product Overview
Read2Ship is a hackathon web app built on top of the daily.dev Public API.
The product helps developers turn their daily.dev reading activity, saved posts, feeds, and article interests into practical mini-projects, coding tasks, and shareable build plans.
The core idea is:
> Developers do not need more saved articles. They need help turning reading into shipping.
Read2Ship should feel like a polished developer tool that naturally fits beside daily.dev, but it must not be a direct clone of daily.dev.
---
## Product Name
Read2Ship
## Tagline
Turn your daily.dev reading into your next build.
## Short Description
Read2Ship analyzes your daily.dev content and generates practical mini-projects, implementation tasks, and shareable build plans.
---
## Target Users
Read2Ship is for developers who:
- Read a lot of technical content
- Save articles for later but rarely return to them
- Want project ideas based on what they are already learning
- Want actionable coding tasks instead of just recommendations
- Want something shareable that shows what they are building next
---
## Design Personality
The design should feel:
- Developer-focused
- Dark-first
- Sharp
- Productive
- Trustworthy
- Modern
- Technical
- Slightly futuristic
- Hackathon-polished
- Useful, not decorative
The app should feel like a bridge between reading and building.
Avoid making the product feel like a generic SaaS landing page.
---
## Visual Inspiration
Use daily.dev as inspiration only for:
- Dark developer-focused interface
- Card-based information layout
- Feed-style article previews
- Compact metadata
- Topic chips/tags
- Developer productivity feeling
Do not copy:
- daily.dev logo
- daily.dev exact layout
- daily.dev exact navigation
- daily.dev exact cards
- daily.dev branding
Read2Ship should have its own identity.
---
## Color System
Use a dark-first color palette.
### Background Colors
- App background: near-black / charcoal (#0A0A0B)
- Main surface: dark gray (#121214)
- Card surface: slightly lighter dark gray (#1A1A1D)
- Elevated card: dark slate (#212124)
- Border: subtle gray with low opacity (#2D2D30)
### Text Colors
- Primary text: off-white (#F5F5F7)
- Secondary text: muted gray (#A1A1AA)
- Tertiary text: darker muted gray (#71717A)
### Accent Colors
- Primary accent: purple (#9333EA)
- Secondary accent: cyan or electric blue (#06B6D4)
- Success accent: green (#22C55E)
- Warning accent: amber (#F59E0B)
- Error accent: red (#EF4444)
Use accents sparingly for buttons, highlights, progress, tags, and important data.
Do not use loud gradients everywhere. Gradients may be used subtly in hero backgrounds or card glows.
---
## Typography
Use a clean modern sans-serif font.
The typography should feel technical and readable.
Suggested style:
- Large bold hero headline
- Medium-weight section headings
- Compact body text
- Small muted metadata labels
- Code-like labels for tags and technical chips
Text should have strong hierarchy.
Avoid oversized marketing text after the landing page. Dashboard screens should be compact and useful.
---
## Layout Principles
The product should use:
- Card-based layouts
- Clear visual hierarchy
- Rounded corners
- Subtle borders
- Soft shadows or glow effects
- Compact developer metadata
- Responsive grid layouts
- Sidebar layout for dashboard screens
- Centered card layout for connect and share pages
The app should feel dense enough to be useful but not cluttered.
---
## Core Components
Design the following reusable components:
### Navigation Bar
Used on the landing page.
Items:
- Product
- Demo
- How it Works
- Generate Plan
Brand name: Read2Ship
Include a small badge:
- Powered by daily.dev API
### Sidebar Navigation
Used inside the dashboard.
Items:
- Overview
- Reading Themes
- Build Plan
- Share Card
- Settings
The sidebar should look polished but not too large.
### Buttons
Button variants:
- Primary: purple/cyan accent
- Secondary: dark bordered button
- Ghost: transparent subtle text button
- Success/action: green accent when needed
Button labels:
- Generate My Plan
- View Sample Plan
- Analyze My Reading
- Generate Build Plan
- Create Share Card
- Copy Link
- Download Card
- Generate Your Own
---
## Required Screens
1. Landing Page
2. Connect Page
3. Analysis Dashboard
4. Generated Build Plan Page
5. Public Shareable Plan Page
---
## Sample Data
Developer:
- Name: Jesse
- Username: jessedev454
Themes:
- AI Agents
- Backend Tooling
- TypeScript
- PostgreSQL
- Developer Automation
Project:
AI-Powered Code Review Assistant
Tasks:
1. Create a webhook endpoint
2. Analyze code changes with AI
3. Generate a review summary
Stack:
- TypeScript
- Node.js
- Express
- PostgreSQL
- OpenAI API
Sample articles:
- Building AI Agents with TypeScript
- How to Design Better Backend APIs
- PostgreSQL Performance Tips for Developers
- Automating Developer Workflows with AI
- Designing Reliable API Systems
