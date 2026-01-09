# Private Opportunity Access Control Documentation

## Overview

Private opportunities require users to be authenticated before they can apply. This feature ensures that only registered and logged-in users can access and apply for certain sensitive or exclusive volunteer opportunities.

## Implementation

### 1. **Opportunity Data Structure**

Each opportunity in `mockOpportunities.js` now includes:

```javascript
{
  visibility: "public" | "private",  // Controls access
  requiresApproval: true | false     // Optional: requires organizer approval
}
```

### 2. **Access Control Flow**

#### Public Opportunities

- ✅ Accessible to everyone (logged in or not)
- ✅ Apply page is open to all users
- ✅ No authentication check required

#### Private Opportunities

- 🔒 Requires authentication
- 🔒 Redirects to access denied page if not logged in
- 🔒 Shows login/register options
- ✅ Accessible only after successful authentication

### 3. **Technical Implementation**

#### File: `src/app/opportunities/[id]/apply/page.jsx`

```javascript
// Check authentication status
const { data: session, status } = useSession();

// Validate access on mount
useEffect(() => {
  if (oppData.visibility === "private" && status !== "authenticated") {
    setAccessDenied(true);
  }
}, [status]);
```

#### Access Denied UI

When a non-authenticated user tries to access a private opportunity:

1. Shows lock icon with warning message
2. Displays explanation in Khmer and English
3. Provides three action buttons:
   - **Login** → Redirects to `/auth/login`
   - **Register** → Redirects to `/auth/register`
   - **Go Back** → Returns to opportunities list

### 4. **User Experience**

#### For Logged-Out Users:

```
User clicks "Apply" on private opportunity
     ↓
System checks authentication status
     ↓
If not authenticated → Access Denied Page
     ↓
User can:
  - Login (redirects to login page)
  - Register (redirects to registration)
  - Go back to opportunities list
```

#### For Logged-In Users:

```
User clicks "Apply" on private opportunity
     ↓
System checks authentication status
     ↓
If authenticated → Normal Apply Form
     ↓
User fills form and submits application
```

### 5. **Admin/Organizer Controls**

In the admin panel (`/admin/opportunities`), organizers can set:

- **Visibility**: Public or Private
- **Status**: Active, Pending, or Closed

Example from admin page:

```javascript
<select value={editData.visibility}>
  <option value="public">Public</option>
  <option value="private">Private</option>
</select>
```

## Benefits

1. **Security**: Ensures only registered users access sensitive opportunities
2. **Quality Control**: Better tracking of volunteer applications
3. **Privacy**: Protects exclusive opportunities from public view
4. **Flexibility**: Organizers can choose access level per opportunity

## Future Enhancements

- [ ] Add invitation-based access for private opportunities
- [ ] Implement role-based access (e.g., only "verified volunteers")
- [ ] Add notification system for private opportunity invitations
- [ ] Track user access attempts for analytics
- [ ] Allow organizers to whitelist specific users

## Testing

### Test Case 1: Public Opportunity

1. Log out
2. Navigate to public opportunity
3. Click "Apply"
4. ✅ Should show apply form

### Test Case 2: Private Opportunity (Not Logged In)

1. Log out
2. Navigate to private opportunity
3. Click "Apply"
4. ✅ Should show access denied page

### Test Case 3: Private Opportunity (Logged In)

1. Log in as user
2. Navigate to private opportunity
3. Click "Apply"
4. ✅ Should show apply form

## Related Files

- `src/app/opportunities/[id]/apply/page.jsx` - Apply page with access control
- `src/data/mockOpportunities.js` - Opportunity data with visibility field
- `src/app/admin/opportunities/page.jsx` - Admin CRUD for opportunities
- `src/app/api/auth/[...nextauth]/route.js` - NextAuth configuration

## Notes

- Currently uses NextAuth session management
- Mock data includes `visibility` field for all opportunities
- Default visibility is set to "public" if not specified
- Access control is client-side; implement server-side validation in production
