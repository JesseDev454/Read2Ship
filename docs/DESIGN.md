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
- App background: near-black / charcoal
- Main surface: dark gray
- Card surface: slightly lighter dark gray
- Elevated card: dark slate
- Border: subtle gray with low opacity
### Text Colors
- Primary text: off-white
- Secondary text: muted gray
- Tertiary text: darker muted gray
### Accent Colors
- Primary accent: purple
- Secondary accent: cyan or electric blue
- Success accent: green
- Warning accent: amber
- Error accent: red
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
### Cards
Card types:
- Article preview card
- Theme score card
- Tech stack chip card
- Generated project card
- Implementation task card
- Shareable action card
- Error state card
- Loading state card
Cards should use subtle borders and rounded corners.
### Tags and Chips
Use chips for:
- AI Agents
- TypeScript
- Backend
- PostgreSQL
- React
- DevTools
- API Design
- Automation
- Security
Chips should feel like developer metadata.
### Loading States
Use loading states with short messages:
- Reading your developer taste...
- Finding patterns in your saves...
- Turning your reading into a build plan...
Loading states should feel polished and reassuring.
### Error States
Design friendly error states for:
- Invalid API token
- Not enough content
- Failed plan generation
The error states should not look scary.
---
## Required Screens
Create five high-fidelity responsive screens.
---
# Screen 1: Landing Page
## Purpose
Explain Read2Ship quickly and make the user want to generate a plan.
## Layout
Dark landing page with:
- Navbar
- Hero section
- Action card preview
- How it works section
- Final CTA section
## Hero Content
Headline:
Turn your daily.dev reading into your next build.
Subtext:
Read2Ship analyzes your daily.dev content and generates practical mini-projects, coding tasks, and shareable build plans.
Primary CTA:
Generate My Plan
Secondary CTA:
View Sample Plan
## Hero Visual
Show a large preview of a generated Read2Ship card.
The card should contain:
- Developer direction
- Suggested project
- Difficulty
- Estimated time
- Three tasks
- Recommended stack
- Powered by daily.dev API badge
## How It Works Section
Three steps:
1. Connect daily.dev
2. Analyze your reading themes
3. Generate and share your build plan
Each step should have an icon, title, and short description.
## Landing Page Mood
The landing page should feel premium and focused. Not too much text. The user should understand the product in under 10 seconds.
---
# Screen 2: Connect Page
## Purpose
Allow the user to enter their daily.dev API token or try a sample plan.
## Layout
Centered token input card with a right-side preview panel.
## Main Card Content
Title:
Connect your daily.dev
Subtitle:
Paste your API token to analyze your reading activity and generate a practical build plan.
Input label:
daily.dev API Token
Placeholder:
Paste your token here
Security note:
Your token is only used to fetch your daily.dev content and is not stored.
Primary button:
Analyze My Reading
Secondary button:
Try Sample Plan
## Right Preview Panel
Show example transformation:
From:
- Article: Building AI Agents with TypeScript
- Article: PostgreSQL Performance Tips
- Article: Designing Better Backend APIs
To:
- Suggested build: AI-Powered Code Review Assistant
- Tasks: webhook endpoint, AI analysis, review summary
## Connect Page Mood
This page must feel secure, clean, and trustworthy.
---
# Screen 3: Analysis Dashboard
## Purpose
Show the user what Read2Ship detected from their daily.dev content.
## Layout
Use a dashboard layout:
- Left sidebar
- Main content area
- Right insight panel
## Main Content Sections
### Profile Summary Card
Show:
- Developer name
- Username
- Short reading summary
- Number of posts analyzed
### Top Reading Themes
Show theme cards with scores.
Example themes:
- AI Agents — 86%
- Backend Tooling — 74%
- TypeScript — 68%
- PostgreSQL — 52%
### Detected Tech Stack
Show chips:
- TypeScript
- Node.js
- PostgreSQL
- React
- APIs
- Automation
### Recent Posts Analyzed
Show article cards with:
- Title
- Source
- Tags
- Short metadata
### Main CTA
Button:
Generate Build Plan
## Right Panel
Title:
Developer Direction
Content:
Based on your recent reading, you seem focused on AI-powered developer tools, backend automation, and TypeScript systems.
Show one recommendation:
Your next build should combine AI, backend APIs, and automation.
## Dashboard Mood
The dashboard should feel like real data is flowing through the app. It should not feel empty.
---
# Screen 4: Generated Build Plan Page
## Purpose
Show the AI-generated practical project plan.
## Layout
Dashboard layout with a large main project card and supporting sections.
## Main Card
Title:
Your next build
Project title example:
AI-Powered Code Review Assistant
Summary:
Based on your daily.dev reading activity, this project helps you apply AI agents, backend tooling, and TypeScript automation in a practical way.
Metadata:
- Difficulty: Intermediate
- Estimated time: 2–3 days
- Track: Content → Action
Recommended stack chips:
- TypeScript
- Node.js
- Express
- PostgreSQL
- OpenAI API
## Implementation Tasks
Show exactly three task cards:
1. Create a webhook endpoint  
   Build an API endpoint that receives repository or code review events.
2. Analyze changes with AI  
   Send code diffs or summaries to an AI model and classify potential issues.
3. Generate a review summary  
   Return actionable review comments, warnings, and improvement suggestions.
## Bonus Feature
Add one bonus feature card:
Generate a shareable review report for each analyzed pull request.
## Inspired By Section
Show article cards under:
Inspired by your daily.dev reads
Example articles:
- Building AI Agents with TypeScript
- How to Design Better Backend APIs
- PostgreSQL Performance Tips for Developers
## Buttons
- Create Share Card
- Regenerate
- Copy Plan
## Mood
This page should feel actionable. The user should immediately know what to build next.
---
# Screen 5: Public Shareable Plan Page
## Purpose
Create a polished public page that users can share.
## Layout
Centered shareable card with buttons below it.
The card should look excellent as a screenshot for social media.
## Card Content
Card title:
Jesse’s Read2Ship Plan
Subtitle:
Generated from daily.dev reading activity
Sections:
### Current Direction
AI Agents + Backend Tooling
### Build Next
AI-Powered Code Review Assistant
### Difficulty
Intermediate
### Estimated Time
2–3 days
### 3 Tasks
1. Create a webhook endpoint
2. Analyze code changes with AI
3. Generate a review summary
### Recommended Stack
TypeScript, Node.js, Express, PostgreSQL, OpenAI API
### Inspired By
daily.dev reading activity
### Badge
Powered by daily.dev API
## Buttons Below Card
- Copy Link
- Download Card
- Generate Your Own
## Mood
This should be the most polished screen in the product. It should feel like a developer achievement card mixed with a practical project brief.
---
## Responsive Design
The app must work well on:
- Desktop
- Tablet
- Mobile
On mobile:
- Sidebar should collapse
- Cards should stack vertically
- Share card should remain screenshot-friendly
- Buttons should be easy to tap
- Text should not overflow
---
## Accessibility
Use:
- High contrast text
- Clear focus states
- Readable font sizes
- Button labels that explain the action
- Proper spacing between interactive elements
---
## Product Differentiation
Read2Ship is not:
- A bookmark manager
- A reading streak tracker
- A daily briefing app
- A top reader leaderboard
- A daily.dev clone
Read2Ship is:
- An action planner
- A project idea generator
- A reading-to-building bridge
- A shareable developer productivity tool
The UI should constantly reinforce the transition:
Reading → Insight → Build Plan → Share
---
## Sample Data
Use realistic sample data.
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
---
## Final Design Goal
The final design should look like a serious hackathon-ready developer product.
It should be polished enough to deploy publicly and share on social media.
The most important screen is the public shareable plan page. Make it visually strong, clean, and screenshot-ready.