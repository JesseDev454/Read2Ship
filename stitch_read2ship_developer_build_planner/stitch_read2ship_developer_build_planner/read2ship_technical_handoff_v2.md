# Read2Ship Developer Handoff (Technical Update)

This document provides exact Tailwind CSS classes, design tokens, and structural blueprints to implement the **Read2Ship** design system in React and TypeScript.

---

## 1. Core Tailwind Configuration Tokens

### Backgrounds & Surfaces
- **App Background:** `bg-[#17111b]` (Near-black charcoal)
- **Main Surface (Sidebar/Cards):** `bg-[#1f1924]` (Dark Gray)
- **Elevated Surface (Active States/Modals):** `bg-[#3d3742]` (Bright Slate)
- **Card Surface:** `bg-surface-container-low` (or `bg-[#1f1924]`)
- **Card Hover:** `hover:bg-[#3d3742]` or `transition-all duration-200`

### Accents & Indicators
- **Primary Purple:** `bg-[#9333ea]` | `text-[#9333ea]` | `border-[#9333ea]`
- **Secondary Cyan:** `text-[#06b6d4]` | `bg-[#06b6d4]`
- **Success Green:** `text-[#22c55e]` | `border-[#22c55e]`
- **Error Red:** `text-[#ef4444]` | `border-[#ef4444]`
- **Borders:** `border-white/10` (Subtle) or `border-[#9333ea]/30` (Branded)

### Shadows & Glows
- **Subtle Card Shadow:** `shadow-xl shadow-black/50`
- **Primary Glow:** `shadow-[0_0_20px_rgba(147,51,234,0.15)]`
- **Interactive Focus:** `ring-2 ring-[#9333ea] ring-offset-2 ring-offset-[#17111b]`

---

## 2. Component-Specific Tailwind Classes

### Navigation (Sidebar)
- **Layout:** `h-screen w-64 fixed left-0 top-0 flex flex-col border-r border-white/5`
- **Active Tab:** `bg-purple-600/10 text-purple-400 border-l-4 border-purple-600 px-4 py-3 font-bold`
- **Inactive Tab:** `text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 transition-colors`

### Buttons
- **Primary:** `px-6 py-3 bg-[#9333ea] text-white rounded-lg font-semibold hover:bg-[#a855f7] active:scale-95 transition-all shadow-lg shadow-purple-900/20`
- **Secondary/Ghost:** `px-6 py-3 border border-white/10 text-slate-300 rounded-lg hover:bg-white/5 transition-colors`

### Input Fields
- **API Token Input:** `w-full bg-[#110c16] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#9333ea] focus:ring-1 focus:ring-[#9333ea]`

### Mobile Responsiveness
- **Stacked Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Responsive Padding:** `px-4 md:px-8 lg:px-12`
- **Mobile Sidebar:** On mobile, transform to `fixed bottom-0 left-0 w-full h-16 flex-row` or use a standard hamburger menu.

---

## 3. Public Shareable Plan Card: HTML Blueprint

This card is the "North Star" for the submission. Use this structure for maximum impact and screenshot-readability.

```html
<!-- Main Container -->
<div class="max-w-[1200px] mx-auto p-8 flex items-center justify-center min-h-screen bg-[#17111b]">
  
  <!-- Shareable Card (The "Screenshot" Target) -->
  <div class="relative w-full max-w-2xl bg-[#1f1924] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 p-10 ring-1 ring-white/5">
    
    <!-- Header: User Profile & Badge -->
    <div class="flex justify-between items-start mb-8">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-[#3d3742] flex items-center justify-center font-bold text-xl text-white">J</div>
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Jesse’s Read2Ship Plan</h2>
          <p class="text-sm text-slate-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span> Generated today
          </p>
        </div>
      </div>
      <!-- Brand Icon Badge -->
      <div class="w-10 h-10 bg-[#9333ea] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.4)]">
        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>

    <!-- Direction Section -->
    <div class="grid grid-cols-2 gap-8 mb-10 border-b border-white/5 pb-10">
      <div>
        <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Current Direction</p>
        <p class="text-xl font-medium text-white">AI Agents + Backend</p>
      </div>
      <div>
        <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Build Next</p>
        <p class="text-xl font-bold text-[#06b6d4]">AI-Powered Code Review Assistant</p>
      </div>
    </div>

    <!-- Task List Section -->
    <div class="mb-10">
      <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Next 3 Tasks</p>
      <div class="space-y-4">
        <!-- Task Item -->
        <div class="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
          <div class="w-6 h-6 rounded-full border border-purple-500/50 flex items-center justify-center text-xs text-purple-400 shrink-0">1</div>
          <p class="text-slate-200 text-sm leading-relaxed">Set up Node.js/Express server and integrate LangChain SDK for agent orchestration.</p>
        </div>
        <!-- Task Item 2 -->
        <div class="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
          <div class="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-500 shrink-0">2</div>
          <p class="text-slate-400 text-sm leading-relaxed opacity-60">Implement GitHub App authentication (OAuth) and configure webhook listeners.</p>
        </div>
        <!-- ...Repeat for task 3 -->
      </div>
    </div>

    <!-- Recommended Stack -->
    <div class="mb-12">
      <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Recommended Stack</p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-white/5">Node.js</span>
        <span class="px-3 py-1 bg-[#9333ea]/10 text-purple-400 text-xs rounded-full border border-purple-500/20">LangChain</span>
        <span class="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-white/5">OpenAI API</span>
      </div>
    </div>

    <!-- Footer Meta -->
    <div class="flex justify-between items-center pt-6 border-t border-white/5">
      <div class="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
        <span class="text-yellow-500 text-xs">⚡ Powered by daily.dev API</span>
      </div>
      <p class="text-[10px] text-slate-600 font-mono">read2ship.dev/p/jesse123</p>
    </div>
  </div>
</div>
```

---

## 4. Export Guidance

1. **HTML/CSS:** Use the source of `{{DATA:SCREEN:SCREEN_11}}` (Share Card) and `{{DATA:SCREEN:SCREEN_7}}` (Build Plan) as your primary reference for the React component structures.
2. **Assets:** Download `{{DATA:IMAGE:IMAGE_8}}` for your main logo.
3. **Tailwind Config:** Add `Space Grotesk` to your `tailwind.config.js` and extend the colors using the hex codes provided in Section 1.
4. **Icons:** Use Lucide-React or Heroicons for the dashboard icons, mapping them to the `tab_icons` listed in `{{DATA:COMPONENTS:COMPONENTS_3}}`.