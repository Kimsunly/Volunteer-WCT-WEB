# Authentication Flow & Dynamic Navbar Setup

## 📋 Overview

Your app now has a **single dynamic MainNavbar** that changes based on authentication state.

---

## 🔐 Authentication States

### **Guest Users (Not Logged In)**

**Navbar shows:**

- ✅ Navigation links (Home, Opportunities, Events, etc.)
- ✅ Search icon
- ✅ **Login button** ("ចូលគណនី")
- ✅ **Register button** ("បង្កើតគណនី")
- ❌ No profile icon
- ❌ No notifications

**Routes:**

- `/` → Landing page (with same content as homepage)
- Redirected to `/auth/login` if trying to access protected routes

---

### **Authenticated Users (Logged In)**

**Navbar shows:**

- ✅ Navigation links (Home, Opportunities, Events, etc.)
- ✅ Search icon
- ✅ **Notification dropdown** (with unread count badge)
- ✅ **Profile dropdown** (with avatar)
- ❌ No login/register buttons

**Routes:**

- `/homepage` → Homepage (same content as landing, but user is logged in)
- Access to protected routes (`/user`, `/organizer`, `/admin`)
- Redirected from `/` to `/homepage` automatically

---

## 📁 File Structure

```
src/
├── app/
│   ├── (landing)/
│   │   ├── page.js              ← Landing page (guest users)
│   │   └── components/          ← Shared components
│   ├── homepage/
│   │   ├── page.js              ← Homepage (authenticated users)
│   │   └── layout.js
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   └── layout.js                ← Root layout with AuthProvider
│
├── components/
│   └── nav/
│       ├── MainNavbar.jsx       ← Dynamic navbar (ONE FILE)
│       ├── ProfileDropdown.jsx  ← User profile menu
│       ├── NotificationDropdown.jsx  ← Notification bell
│       └── TopHeader.jsx
│
├── context/
│   └── AuthContext.js           ← Auth state management
│
└── middleware.js                ← Route protection & redirects
```

---

## 🔧 How It Works

### **1. AuthContext (`src/context/AuthContext.js`)**

```javascript
const { user, setUser, loading } = useAuth();

// user object structure:
{
  id: 123,
  name: "John Doe",
  email: "john@example.com",
  role: "user", // or "organizer", "admin"
  profileImage: "/images/profile.jpg"
}
```

### **2. MainNavbar Dynamic Rendering**

```jsx
// Guest view - Shows login/register
{
  !loading && !user && (
    <ul className="nav-authentication">
      <li>
        <a href="/auth/login">ចូលគណនី</a>
      </li>
      <li>
        <a href="/auth/register">បង្កើតគណនី</a>
      </li>
    </ul>
  );
}

// Authenticated view - Shows notifications + profile
{
  !loading && user && (
    <>
      <NotificationDropdown />
      <ProfileDropdown />
    </>
  );
}
```

### **3. Middleware (`src/middleware.js`)**

Automatically redirects users based on auth state:

- Guest at `/` → Stays on landing page
- **Authenticated at `/`** → Redirected to `/homepage` ✅
- Guest at `/homepage` → Redirected to `/` (landing)
- Guest at protected routes → Redirected to `/auth/login`

### **4. Content Sharing**

Both pages use **the same components**:

```javascript
// (landing)/page.js and /homepage/page.js
import HeroBanner from "../(landing)/components/HeroBanner";
import AboutUs from "../(landing)/components/AboutUs";
import LandingOpportunities from "../(landing)/components/LandingOpportunities";
// ... etc
```

---

## 🎯 User Flow Examples

### **Scenario 1: New Visitor**

1. Visit `yoursite.com/` → Landing page
2. See login/register buttons in navbar
3. Click "បង្កើតគណនី" → Goes to `/auth/register`
4. After registration → Logged in
5. Automatically redirected to `/homepage`
6. Now sees profile icon + notifications (no login buttons)

### **Scenario 2: Returning User**

1. Visit `yoursite.com/` → Middleware detects auth token
2. Automatically redirected to `/homepage`
3. Sees profile icon + notifications in navbar

### **Scenario 3: Logout**

1. Click profile dropdown → Click "ចាកចេញ"
2. Token cleared, `user` set to `null`
3. Navbar updates immediately (shows login/register buttons)
4. Stays on current page or redirected to `/`

---

## 📊 Navbar Components

### **ProfileDropdown.jsx**

```jsx
✓ User avatar image
✓ "មើលគណនី" → Dashboard (/user, /organizer, or /admin)
✓ "ការកំណត់" → Settings
✓ "ចាកចេញ" → Logout
```

### **NotificationDropdown.jsx**

```jsx
✓ Bell icon with unread count badge
✓ Notification list (3 mock notifications)
✓ Mark as read functionality
✓ "មើលការជូនដំណឹងទាំងអស់" link
```

---

## ✅ Testing Checklist

### **As Guest:**

- [ ] Visit `/` → See landing page with login/register buttons
- [ ] Click login → Go to `/auth/login`
- [ ] Try `/homepage` → Redirected to `/`
- [ ] Try `/user` → Redirected to `/auth/login`

### **As Authenticated User:**

- [ ] Visit `/` → Auto-redirected to `/homepage`
- [ ] See profile icon + notification bell (no login buttons)
- [ ] Click notification bell → See dropdown
- [ ] Click profile → See dropdown menu
- [ ] Click logout → Login buttons reappear
- [ ] Access `/user`, `/organizer`, `/admin` based on role

---

## 🚀 Next Steps

1. **Connect to Real API:**
   - Update `AuthContext.js` to call your backend API
   - Update notification data from API
2. **Add Loading States:**
   - Show skeleton while `loading === true`
3. **Add Protected Route Logic:**
   - Check user roles in middleware
   - Redirect based on permissions

4. **Update Logout:**
   - Call `/api/auth/logout` endpoint
   - Clear cookies properly

---

## 📝 Key Files Modified

1. ✅ `MainNavbar.jsx` - Added NotificationDropdown import and conditional rendering
2. ✅ `NotificationDropdown.jsx` - Created new component
3. ✅ `homepage/page.js` - Created homepage for authenticated users
4. ✅ `homepage/layout.js` - Created layout
5. ✅ `middleware.js` - Added route protection and redirects

---

## 💡 Tips

- **Same Content, Different Routes:**
  - `/` (landing) = Guest users
  - `/homepage` = Authenticated users
  - Same components, different navbar state

- **Dynamic Navbar:**
  - ONE `MainNavbar.jsx` file
  - Uses `useAuth()` hook to check user state
  - Automatically updates when login/logout happens

- **No Duplication:**
  - All page components in `(landing)/components/`
  - Both routes import from there
  - Easy to maintain

---

Everything is now set up and ready to use! 🎉
