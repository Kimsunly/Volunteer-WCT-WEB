# Component Organization Complete ✅

## Directory Structure Overview

### Landing Page (Homepage)

```
/src/app/(landing)/
├── layout.js                    # Landing group layout
├── page.js                      # Home page (replaces old /src/app/page.js)
└── components/
    ├── HeroBanner.jsx          # Landing-specific hero with carousel
    ├── AboutUs.jsx             # Landing mission section
    ├── BenefitsGrid.jsx        # Landing benefits display
    ├── CTAJoin.jsx             # Landing CTA section
    ├── FAQAccordion.jsx        # Landing FAQ section
    ├── LandingOpportunities.jsx # Landing opportunities filter
    ├── TestimonialsSlider.jsx  # Landing testimonials carousel
    └── UpcomingEvents.jsx      # Landing events section
```

### Reusable Base Components

```
/src/components/base/
├── SectionHeading.jsx      # Generic section header (align, badge, title, subtitle)
├── CTASection.jsx          # Generic CTA section (customizable props)
├── StatsStrip.jsx          # Generic stats display (flexible data)
└── StatsStripModern.jsx    # Reusable modern stats with counters
```

### User Dashboard

```
/src/app/user/
├── layout.js               # User dashboard layout with sidebar
├── page.js                 # User dashboard index page
└── components/             # User-specific components (dashboard cards, lists, etc.)
    ├── UserStats.jsx
    ├── UserRegistrations.jsx
    └── ...
```

### Organizer Dashboard

```
/src/app/organizer/
├── layout.js               # Organizer dashboard layout with sidebar
├── page.js                 # Organizer dashboard index page
└── components/             # Organizer-specific components
    ├── OrganizerStats.jsx
    ├── OrganizerOpportunities.jsx
    ├── CommunityManagement.jsx
    └── ...
```

### Shared Components (Unchanged)

```
/src/components/
├── cards/                  # OpportunityCard, EventCard, BlogCard, etc.
├── nav/                    # MainNavbar, AdminSidebar
├── layout/                 # SiteLayout, SiteFooter, AdminLayout
├── forms/                  # FormField, DateRangePicker, etc.
├── common/                 # AOSInit, BootstrapClient, StatusBadge, etc.
├── filters/                # CategoryChips, FilterBar
├── modals/                 # BaseModal, ConfirmModal
└── admin/                  # Admin-specific cards and tables
```

---

## Import Path Examples

### From Landing Page Components

```jsx
// ✅ Correct
import HeroBanner from "@/app/(landing)/components/HeroBanner";
import LandingOpportunities from "@/app/(landing)/components/LandingOpportunities";

// Using reusable base components
import StatsStripModern from "@/components/base/StatsStripModern";
```

### From User/Organizer Pages

```jsx
// User dashboard
import UserLayout from "@/app/user/layout";
import { useRouter } from "next/navigation";

// Reusable components for dashboards
import StatsStrip from "@/components/base/StatsStrip";
import SectionHeading from "@/components/base/SectionHeading";

// Shared UI components
import OpportunityCard from "@/components/cards/OpportunityCard";
```

### For Other Pages (About, Contact, etc.)

```jsx
// Can use reusable base components
import CTASection from "@/components/base/CTASection";
import SectionHeading from "@/components/base/SectionHeading";
import StatsStrip from "@/components/base/StatsStrip";

// Can also create page-specific components
import AboutHero from "@/app/about/components/AboutHero";
```

---

## Base Component Props Reference

### SectionHeading.jsx

```jsx
<SectionHeading
  badge="Features"
  title="What We Offer"
  subtitle="A description of our offerings"
  align="center" // 'left', 'center', 'right'
/>
```

### CTASection.jsx

```jsx
<CTASection
  title="Join Us Today"
  description="Make a difference in the community"
  primaryBtnText="Sign Up"
  primaryBtnHref="/auth/login"
  secondaryBtnText="Learn More"
  backgroundImage="/images/cta-bg.jpg"
/>
```

### StatsStrip.jsx

```jsx
<StatsStrip
  stats={[
    { icon: "bi-people-fill", value: "650+", label: "Volunteers" },
    { icon: "bi-tree-fill", value: "1000+", label: "Trees Planted" },
    // ...
  ]}
/>
```

### StatsStripModern.jsx

```jsx
<StatsStripModern />
// Uses hardcoded data, perfect for landing page
```

---

## Migration Checklist

- ✅ Landing page sections moved to `(landing)/components/`
- ✅ Reusable components moved to `components/base/`
- ✅ `(landing)` route group created with layout & page
- ✅ User dashboard structure created
- ✅ Organizer dashboard structure created
- ✅ All imports updated in landing page
- ⏳ Next: Build user/organizer dashboard components

---

## Next Steps

1. **Create User Dashboard Components:**
   - UserProfile card
   - UserRegistrations list
   - UserStats widget
   - Favorites section

2. **Create Organizer Dashboard Components:**
   - OrganizerStats widget
   - OpportunitiesList (CRUD interface)
   - CommunityManagement section
   - VolunteersList for each opportunity

3. **Create Admin Dashboard Components:**
   - UserManagement table
   - OrganizerVerification list
   - CategoryManagement interface
   - TipManagement (for blog/tips)

4. **Create Shared Dashboard Layout:**
   - Sidebar navigation for all dashboards
   - Profile dropdown
   - Breadcrumbs

---

## Benefits of This Structure

✅ **Landing page is isolated** - Easy to modify without affecting dashboards
✅ **Reusable components are centralized** - Can be used across all pages
✅ **Dashboard-specific components are organized** - Each role has its own folder
✅ **Scalable** - Easy to add new pages or features
✅ **Maintainable** - Clear separation of concerns
✅ **Testing** - Easier to test isolated components
