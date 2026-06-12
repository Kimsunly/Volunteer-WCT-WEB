# TRAE IDE — Full Admin Dashboard Redesign Prompt
# Reference Design: Dark + Lime Green Modern Dashboard (Pinterest)
# Target: Replace existing Laravel/React admin with pixel-faithful redesign

---

## MISSION

You are a senior fullstack developer and UI engineer. Your job is to **completely redesign** the existing admin dashboard UI to match the reference design image exactly. The current admin UI (white background, basic layout, Khmer text) must be replaced with a **dark-mode, lime-green accented, 3-column modern dashboard** as shown in the reference.

Do NOT touch any backend logic, routes, controllers, or database models.
Only redesign: layout files, view templates, CSS/Tailwind, React/Vue components, and static assets.

Read ALL existing frontend files first before writing a single line of code.
Map each existing page/module to the new design system before coding.

---

## STEP 0 — AUDIT EXISTING CODE FIRST

Before writing anything:
1. List all frontend files: views, components, layouts, CSS, JS
2. Identify the frontend stack (Laravel Blade / React / Vue / Inertia)
3. Identify how routing works (web.php / React Router / Inertia links)
4. Identify existing nav items and their routes
5. Note the CSS framework in use (Tailwind / Bootstrap / custom)
6. Then proceed with the redesign using the EXACT same stack and routing

---

## DESIGN SYSTEM (NON-NEGOTIABLE — USE EXACTLY THESE VALUES)

### CSS Custom Properties (Root Variables)
Define these in your global CSS file (`app.css` / `globals.css` / `app.blade.php`):

```css
:root {
  /* === DARK MODE (default) === */
  --color-bg-base:        #131313;
  --color-bg-surface:     #1A1A1A;
  --color-bg-card:        #1E1E1E;
  --color-bg-card-hover:  #252525;
  --color-bg-input:       #2A2A2A;

  --color-accent:         #AAFF00;
  --color-accent-dim:     rgba(170, 255, 0, 0.12);
  --color-accent-glow:    rgba(170, 255, 0, 0.25);

  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #9A9A9A;
  --color-text-muted:     #555555;

  --color-border:         #2A2A2A;
  --color-border-hover:   #3A3A3A;

  --color-positive:       #AAFF00;
  --color-negative:       #FF4D4D;
  --color-warning:        #F59E0B;

  --radius-card:          16px;
  --radius-btn:           12px;
  --radius-sm:            8px;

  --sidebar-width:        220px;
  --rightpanel-width:     280px;

  --shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
  --shadow-glow: 0 0 20px rgba(170, 255, 0, 0.15);
}

[data-theme="light"] {
  --color-bg-base:        #F0F2F5;
  --color-bg-surface:     #FFFFFF;
  --color-bg-card:        #FFFFFF;
  --color-bg-card-hover:  #F8F9FA;
  --color-bg-input:       #F0F2F5;

  --color-accent:         #7ACC00;
  --color-accent-dim:     rgba(122, 204, 0, 0.10);
  --color-accent-glow:    rgba(122, 204, 0, 0.20);

  --color-text-primary:   #111111;
  --color-text-secondary: #6B7280;
  --color-text-muted:     #9CA3AF;

  --color-border:         #E5E7EB;
  --color-border-hover:   #D1D5DB;

  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-glow: 0 0 20px rgba(122, 204, 0, 0.10);
}
```

### Typography
- Import `Inter` from Google Fonts with weights: 400, 500, 600, 700
- Apply globally: `font-family: 'Inter', sans-serif;`
- Type scale:
  - KPI values: `font-size: 2rem; font-weight: 700; color: var(--color-text-primary)`
  - Card titles: `font-size: 0.9375rem; font-weight: 600; color: var(--color-text-primary)`
  - Labels/secondary: `font-size: 0.75rem; color: var(--color-text-secondary)`
  - Nav items: `font-size: 0.875rem; font-weight: 500`
  - Nav group labels: `font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted)`

---

## LAYOUT ARCHITECTURE

### Master Layout Shell
The root layout must be a fixed 3-column shell — no scrolling on the outer shell itself:

```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar 220px fixed] [Main Content flex-1 scroll] [Right 280px]│
│                        ↑ TopBar fixed at top                    │
└─────────────────────────────────────────────────────────────────┘
```

**CSS for root layout:**
```css
.dashboard-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg-base);
}
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-border);
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  flex-shrink: 0;
  height: 56px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
.right-panel {
  width: var(--rightpanel-width);
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--color-bg-surface);
  border-left: 1px solid var(--color-border);
  padding: 20px 16px;
}
```

---

## COMPONENT 1 — SIDEBAR

**Structure (top to bottom):**

```
┌─────────────────────┐
│ [Avatar] Guy Hawkins │  ← user section, padding 16px
├─────────────────────┤
│ 🔍 Search...   ⌘K  │  ← search bar, bg-input, rounded-sm
├─────────────────────┤
│ DASHBOARDS          │  ← group label, text-muted, uppercase
│   ▣ Overview  ●    │  ← ACTIVE: bg-accent, text-black, rounded-sm, full width
│   🛒 eCommerce      │
│   📊 Analytics      │
│   👥 Organizer Apps │  ← map your existing nav items here
├─────────────────────┤
│ SETTINGS            │  ← group label
│   ✉ Messages        │
│   ★ Reviews         │
│   ⚙ Settings        │
│   ? Help Centre     │
│   🏷 Categories     │  ← add all existing nav items
│   📝 Blogs & Tips   │
│   👥 Community      │
│   💬 Comments       │
│   👤 Users          │
│   ❤ Donations       │
├─────────────────────┤
│ [Logo] SMAKJIT      │  ← bottom, text-muted (use your actual app name)
└─────────────────────┘
```

**Sidebar CSS rules:**
```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-decoration: none;
}
.nav-item:hover {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
}
.nav-item.active {
  background: var(--color-accent);
  color: #000000;
  font-weight: 600;
}
.nav-item.active svg { color: #000000; }

.search-bar {
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**Avatar component (no images — initials only):**
```css
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
  color: #000;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
/* Variant colors for different users */
.avatar-purple { background: #7C3AED; color: #fff; }
.avatar-blue   { background: #2563EB; color: #fff; }
.avatar-orange { background: #EA580C; color: #fff; }
.avatar-pink   { background: #DB2777; color: #fff; }
.avatar-green  { background: var(--color-accent); color: #000; }
```

---

## COMPONENT 2 — TOP BAR

**Layout:**
```
[≡ ☆]  Dashboards / Overview          [🌙 ↺ 🔔 🌐]
```

**Specs:**
- Height: 56px
- Left: icon group (layers + star) then breadcrumb text
  - "Dashboards" → text-muted, font-size 0.8125rem
  - "/" → text-muted
  - "Overview" → text-primary, font-weight 600
- Right: icon buttons (moon/sun toggle, refresh, bell, globe)
  - Each: 32x32px, rounded-sm, bg transparent, hover bg-card
  - Icons: 18px, color text-secondary, hover text-primary
- Below topbar in main-content area (NOT inside topbar):
  - Left: "Overview" h1 — font-size 1.5rem, font-weight 700, text-primary
  - Right: "Today ▼" button — bg-card, border border, rounded-btn, padding 6px 14px

**Theme toggle behavior:**
```javascript
// Toggle data-theme attribute on <html> or <body>
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
  localStorage.setItem('theme', current === 'light' ? 'dark' : 'light');
};
// On load: apply saved theme
const saved = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);
```

---

## COMPONENT 3 — KPI STAT CARDS

4 equal-width cards in a CSS grid row: `grid-template-columns: repeat(4, 1fr); gap: 16px;`

**Card base CSS:**
```css
.kpi-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--shadow-card);
  transition: border-color 0.15s;
}
.kpi-card:hover { border-color: var(--color-border-hover); }
.kpi-label { font-size: 0.75rem; color: var(--color-text-secondary); }
.kpi-value { font-size: 1.875rem; font-weight: 700; color: var(--color-text-primary); line-height: 1; }
.kpi-trend { font-size: 0.75rem; display: flex; align-items: center; gap: 4px; }
.kpi-trend.positive { color: var(--color-positive); }
.kpi-trend.negative { color: var(--color-negative); }
```

**The 4 cards — adapt data to your actual app:**

Card 1 — Net Revenue (map to total donations/revenue):
- Label: "Net revenue"
- Value: dynamic from backend (format: $X,XXX)
- Trend: "↑ 0.4% vs last month"

Card 2 — Total Users (map to user count):
- Label: "Total Users" (was "ARR" in reference — adapt to your app)
- Value: dynamic count
- Trend: "↑ 32% vs last quarter"

Card 3 — Active Opportunities (quarterly goal equivalent):
- Label: "Active Opportunities"
- Value: dynamic count with % fill bar
- Sub: show pending count
- Include: small circular arc progress indicator
  ```html
  <svg width="48" height="48" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="20" fill="none" stroke="var(--color-border)" stroke-width="4"/>
    <circle cx="24" cy="24" r="20" fill="none" stroke="var(--color-accent)"
      stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="37.7"
      stroke-linecap="round" transform="rotate(-90 24 24)"/>
  </svg>
  ```

Card 4 — Pending Approvals (new orders equivalent):
- Label: "Pending Approvals"
- Value: dynamic count
- Trend with arrow + % change

---

## COMPONENT 4 — SALES OVERVIEW (Main Chart Card)

**Layout:** Spans ~60% of main content width. Sits left in a 2-column row.

```
┌──────────────────────────────────────────────┐
│ Sales Overview                            ⋮  │
│                                              │
│  [Donut Chart]    💲 Number of Sales         │
│    102k               $71,020                │
│  Weekly Visits                               │
│              ● Electronic  $55,640           │
│              ● Furniture   $11,420           │
│              ● Clothes      $1,840           │
│              ● Shoes        $2,120           │
└──────────────────────────────────────────────┘
```

**Donut chart — use Chart.js or Recharts:**
```javascript
// Chart.js config
{
  type: 'doughnut',
  data: {
    datasets: [{
      data: [55640, 11420, 1840, 2120],
      backgroundColor: ['#AAFF00', '#3D7A00', '#444444', '#7ACC00'],
      borderWidth: 0,
      cutout: '75%'
    }]
  },
  options: {
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }
}
```

**Center text overlay (absolute positioned inside chart wrapper):**
```css
.donut-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}
.donut-center-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary); }
.donut-center-label { font-size: 0.75rem; color: var(--color-text-secondary); }
```

**Legend dots:**
```css
.legend-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
```

---

## COMPONENT 5 — SMALL METRIC CARDS (right of donut chart, stacked 2)

Each card: `background: var(--color-bg-card); border-radius: var(--radius-card); padding: 16px; border: 1px solid var(--color-border);`

**Card A — New Customers / Organizers:**
```
[👤 icon in accent circle]
New Organizers:
862   -8% Last Week ↓
```

**Card B — Total Profit / Revenue:**
```
[📊 icon in accent circle]
$25.6k  +42% ↑
Weekly Revenue
```

**Icon circle:**
```css
.metric-icon {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-accent);
}
```

---

## COMPONENT 6 — TOTAL PROFIT LINE CHART CARD

Full-width card below the donut + metric row.

**Content:**
- Title: "Total Revenue:" (left)
- Value: "$136,755.77" (large, bold)
- X-axis label: current month/year
- Area chart with lime gradient

**Chart.js config:**
```javascript
{
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
    datasets: [{
      data: [30000, 45000, 35000, 60000, 50000, 80000, 65000, 136755],
      borderColor: '#AAFF00',
      borderWidth: 2,
      fill: true,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
        g.addColorStop(0, 'rgba(170,255,0,0.3)');
        g.addColorStop(1, 'rgba(170,255,0,0)');
        return g;
      },
      tension: 0.4,
      pointRadius: 0
    }]
  },
  options: {
    scales: {
      x: { grid: { display: false }, ticks: { color: '#555' } },
      y: { display: false }
    },
    plugins: { legend: { display: false } }
  }
}
```

---

## COMPONENT 7 — DATA TABLE (Customer List / Organizer Applications)

**Card:** Full width, bg-card, rounded-card, border

```
┌────────────────────────────────────────────────────────┐
│ Organizer Applications                              ⋮  │
├──────────────┬──────────────┬────────────┬─────────────┤
│ Name ↕       │ Category ↕   │ Status ↕   │ Action      │
├──────────────┼──────────────┼────────────┼─────────────┤
│ [AV] Name    │ Category     │ [Pending]  │ Approve | X │
│ [BK] Name    │ Category     │ [Active]   │ View        │
└──────────────┴──────────────┴────────────┴─────────────┘
```

**Table CSS:**
```css
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  font-size: 0.75rem; font-weight: 600;
  color: var(--color-text-secondary);
  text-align: left; padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer; user-select: none;
}
.data-table th:hover { color: var(--color-text-primary); }
.data-table td {
  padding: 12px 16px;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}
.data-table tr:hover td { background: var(--color-bg-card-hover); }
.data-table tr:last-child td { border-bottom: none; }

.status-badge {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 99px;
  font-size: 0.6875rem; font-weight: 600;
}
.status-badge.pending  { background: rgba(245,158,11,0.15); color: #F59E0B; }
.status-badge.active   { background: rgba(170,255,0,0.15);  color: #AAFF00; }
.status-badge.rejected { background: rgba(255,77,77,0.15);  color: #FF4D4D; }
```

**Action buttons in table:**
```css
.btn-approve {
  padding: 5px 12px; border-radius: var(--radius-sm);
  background: var(--color-accent); color: #000;
  font-size: 0.75rem; font-weight: 600;
  border: none; cursor: pointer;
  transition: opacity 0.15s;
}
.btn-approve:hover { opacity: 0.85; }
.btn-reject {
  padding: 5px 12px; border-radius: var(--radius-sm);
  background: transparent; color: var(--color-negative);
  border: 1px solid var(--color-negative);
  font-size: 0.75rem; font-weight: 600;
  cursor: pointer; transition: background 0.15s;
}
.btn-reject:hover { background: rgba(255,77,77,0.1); }
```

---

## COMPONENT 8 — PREMIUM / UPGRADE CTA CARD

**Sits in bottom-right of main content (beside the table or below):**

```css
.premium-card {
  background: linear-gradient(135deg, #1A1A1A 0%, #0D1A00 100%);
  border: 1px solid var(--color-accent);
  box-shadow: var(--shadow-glow);
  border-radius: var(--radius-card);
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.premium-card::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: var(--color-accent-glow);
  pointer-events: none;
}
```

**Content inside:**
- Badge pill: "⚡ Premium Plan" — `background: var(--color-accent); color: #000; border-radius: 99px; padding: 3px 12px; font-size: 0.75rem; font-weight: 700;`
- Price: "$30" — `font-size: 3rem; font-weight: 700; color: var(--color-text-primary);`
- Sub-label: "Per Month / Per User" — text-secondary
- Description text — text-secondary, font-size 0.875rem
- CTA button: "Get Started" — `background: var(--color-accent); color: #000; font-weight: 700; border-radius: var(--radius-btn); padding: 12px; width: 100%; font-size: 0.9375rem; cursor: pointer; border: none;`
- CTA hover: `box-shadow: 0 0 16px rgba(170,255,0,0.4); opacity: 0.92;`

---

## COMPONENT 9 — RIGHT PANEL

### Section A: Notifications
```css
.notification-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}
.notification-item:last-child { border-bottom: none; }
.notification-text { font-size: 0.8125rem; color: var(--color-text-primary); line-height: 1.4; }
.notification-time { font-size: 0.6875rem; color: var(--color-text-muted); margin-top: 2px; }
```

Notification entries (map to your real data):
1. "56 New users registered." — Just now
2. "132 Opportunities posted." — 59 Minutes ago
3. "Funds have been withdrawn." — 12 Hours ago
4. "5 Unread messages." — Today, 11:59 PM

### Section B: Activities
Same styling as notifications. Entries:
1. "Changed the style." — Just now
2. "177 New products added." — 47 Minutes ago
3. "11 Posts have been archived." — 1 Days ago
4. "Category 'Jobs' was updated." — Feb 2, 2024

### Section C: Manager Contacts / Users List
```css
.contact-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.contact-item.highlighted {
  background: var(--color-accent);
  color: #000;
  padding: 8px 10px;
  margin: 0 -10px;
  border-radius: var(--radius-sm);
}
.contact-item.highlighted .contact-name { color: #000; font-weight: 600; }
.contact-name { font-size: 0.875rem; color: var(--color-text-primary); flex: 1; }
.contact-actions { display: flex; gap: 6px; }
.contact-action-btn {
  width: 28px; height: 28px;
  border-radius: 6px; background: rgba(0,0,0,0.2);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: none; color: #000;
}
```

---

## PAGE MODULES — MAP EXISTING PAGES TO NEW DESIGN

For each existing admin page, apply the design system. The layout shell (sidebar + topbar + right panel) is the same on every page. Only `main-content` changes.

### Page: Dashboard Overview (/)
Content in main-content:
1. KPI cards row (4 cards)
2. Two-column row: [Sales/Activity Chart 60%] | [Metric cards stack 40%]
3. Profit area chart (full width)
4. Two-column row: [Data table 60%] | [Premium CTA card 40%]

### Page: Organizer Applications (/organizer-applications)
Content in main-content:
1. Page title + action button "Export CSV" (accent button, top right)
2. Filter bar: status filter tabs (All | Pending | Approved | Rejected) — pill tabs using accent for active
3. Full-width data table with columns: Name, Email, Category, Status, Submitted Date, Actions

### Page: Opportunities / eCommerce (/opportunities)
Content in main-content:
1. KPI row: Total Active, Total Pending, Total Closed, Revenue
2. Full-width opportunities table
3. Optional: opportunity detail side-drawer (slide in from right, 400px, bg-surface)

### Page: Categories (/categories)
Content in main-content:
1. "Add Category" button (accent) top right
2. Categories grid: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;`
3. Each category card: bg-card, rounded-card, padding 20px, category icon, name, count badge

### Page: Users (/users)
Content in main-content:
1. Search bar + filter + "Add User" button row
2. Full-width users table: Avatar | Name | Email | Role | Status | Joined | Actions

### Page: Messages (/messages)
Two-column layout inside main-content:
- Left: conversation list (40%, bg-card, rounded-card)
- Right: message thread (60%, bg-card, rounded-card)

### Page: Settings (/settings)
Content in main-content:
- Settings card sections: Profile, Appearance (theme toggle), Notifications, Security
- Each section: bg-card, rounded-card, padding 24px, section title, form fields

---

## REUSABLE UI COMPONENT LIBRARY

Build these as shared components (React components / Blade partials / Vue components):

### Button variants:
```css
/* Primary */
.btn-primary {
  background: var(--color-accent); color: #000; font-weight: 700;
  padding: 8px 18px; border-radius: var(--radius-btn);
  border: none; cursor: pointer; font-size: 0.875rem;
  transition: opacity 0.15s, box-shadow 0.15s;
}
.btn-primary:hover { opacity: 0.88; box-shadow: 0 0 12px var(--color-accent-glow); }

/* Secondary */
.btn-secondary {
  background: transparent; color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 8px 18px; border-radius: var(--radius-btn);
  cursor: pointer; font-size: 0.875rem;
  transition: background 0.15s, border-color 0.15s;
}
.btn-secondary:hover { background: var(--color-bg-card); border-color: var(--color-border-hover); }

/* Danger */
.btn-danger {
  background: rgba(255,77,77,0.12); color: #FF4D4D;
  border: 1px solid rgba(255,77,77,0.3);
  padding: 8px 18px; border-radius: var(--radius-btn);
  cursor: pointer; font-size: 0.875rem;
}
.btn-danger:hover { background: rgba(255,77,77,0.2); }
```

### Form input:
```css
.form-input {
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  padding: 10px 14px;
  font-size: 0.875rem;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-dim); }
.form-input::placeholder { color: var(--color-text-muted); }
```

### Card wrapper:
```css
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
}
.card-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.card-title { font-size: 0.9375rem; font-weight: 600; color: var(--color-text-primary); }
.card-menu-btn {
  width: 28px; height: 28px; border-radius: 6px; background: transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: none; color: var(--color-text-muted);
  transition: background 0.15s;
}
.card-menu-btn:hover { background: var(--color-bg-card-hover); color: var(--color-text-primary); }
```

### Section divider in right panel:
```css
.panel-divider {
  height: 1px;
  background: var(--color-border);
  margin: 16px 0;
}
.panel-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}
```

---

## SCROLLBAR STYLING
```css
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }
```

---

## MICRO-INTERACTIONS (all transitions must be present)
```css
/* Apply these globally */
*, *::before, *::after {
  box-sizing: border-box;
  transition-property: background-color, border-color, color, box-shadow, opacity;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}
/* But NOT on layout properties (causes jank): */
/* Do NOT transition: width, height, padding, margin on layout elements */
```

---

## TAILWIND CONFIG (if using Tailwind)

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'bg-base':     'var(--color-bg-base)',
        'bg-surface':  'var(--color-bg-surface)',
        'bg-card':     'var(--color-bg-card)',
        'accent':      'var(--color-accent)',
        'accent-dim':  'var(--color-accent-dim)',
        'txt-primary': 'var(--color-text-primary)',
        'txt-secondary':'var(--color-text-secondary)',
        'txt-muted':   'var(--color-text-muted)',
        'border-sub':  'var(--color-border)',
        'positive':    'var(--color-positive)',
        'negative':    'var(--color-negative)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'btn':  'var(--radius-btn)',
      },
    },
  },
  plugins: [],
}
```

---

## FILE STRUCTURE TO CREATE/MODIFY

```
resources/
├── css/
│   └── app.css              ← ADD all CSS variables and global styles here
├── js/
│   ├── app.js               ← ADD theme init logic
│   └── components/
│       ├── Sidebar.jsx (or Sidebar.vue / sidebar.blade.php)
│       ├── TopBar.jsx
│       ├── RightPanel.jsx
│       ├── KPICard.jsx
│       ├── DataTable.jsx
│       ├── DonutChart.jsx
│       ├── AreaChart.jsx
│       ├── Avatar.jsx
│       ├── Button.jsx
│       └── StatusBadge.jsx
└── views/
    └── layouts/
        └── dashboard.blade.php  ← MASTER LAYOUT wrapping all pages
```

---

## QUALITY CHECKLIST — VERIFY BEFORE FINISHING

- [ ] Dark mode is the default; light mode works via data-theme="light"
- [ ] All CSS uses var(--color-*) tokens, zero hardcoded hex values in components
- [ ] Sidebar is exactly 220px wide, right panel exactly 280px wide
- [ ] Active nav item has lime green background, black text
- [ ] All avatars use initials only (no broken image tags)
- [ ] Charts render with lime green color and gradient fill
- [ ] KPI cards are in a 4-column grid on the overview page
- [ ] Table rows highlight on hover
- [ ] Status badges use correct colors (pending=amber, active=green, rejected=red)
- [ ] Theme toggle button works and persists via localStorage
- [ ] No layout breaks at 1280px+ viewport width
- [ ] Scrollbars are styled (thin, subtle)
- [ ] All transitions are 150ms ease

---

## IMPORTANT RULES FOR TRAE

1. **READ ALL EXISTING FILES FIRST** — understand the stack before writing
2. **DO NOT change any backend logic** — only frontend
3. **DO NOT create new routes** — use existing routes, just redesign the views
4. **DO NOT use placeholder images** — always use initials avatars
5. **DO NOT use Bootstrap** — if Tailwind is installed, use it with the config above; otherwise use pure CSS variables
6. **WRITE COMPLETE FILES** — no "// ... rest of the code" shortcuts
7. **APPLY THE DESIGN TO EVERY PAGE** — not just the overview page
8. **START WITH THE LAYOUT SHELL** — build Sidebar + TopBar + RightPanel first, then fill in each page

BEGIN by reading: all view/layout files, all component files, package.json, tailwind.config.js
THEN: implement the layout shell
THEN: implement the overview page
THEN: implement all other pages one by one
```
