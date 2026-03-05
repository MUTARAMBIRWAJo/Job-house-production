# Role-Based Access Control System

## Overview

Job House Production Platform implements a comprehensive role-based access control (RBAC) system that manages content and platform administration based on user roles.

## User Roles

### 1. **ADMIN** - Full Platform Control
- **Access:** Complete control over all platform features
- **Permissions:**
  - Create, read, update, delete all content
  - Manage users and roles
  - View analytics and reports
  - Publish/unpublish content
  - Manage platform settings
  
- **Dashboard:** `/dashboard/admin`
- **Key Pages:**
  - Song Management: `/dashboard/admin/songs`
  - Artist Management: `/dashboard/admin/artists`
  - News Management: `/dashboard/admin/news`
  - Event Management: `/dashboard/admin/events`
  - User Management: `/dashboard/admin/users`
  - Revenue/Orders: `/dashboard/admin/orders`

---

### 2. **EDITOR** - Content Publishing Control
- **Access:** Manage and publish platform content
- **Permissions:**
  - Create and edit news articles
  - Review and approve user submissions
  - Feature content on homepage
  - View content analytics
  - Cannot delete content
  
- **Dashboard:** `/dashboard/editor`
- **Key Pages:**
  - News Management: `/dashboard/editor/news`
  - Lyrics Review: `/dashboard/editor/lyrics`
  - Featured Content: `/dashboard/editor/featured`
  - Analytics: `/dashboard/editor/analytics`

---

### 3. **ARTIST** - Content Creator
- **Access:** Manage only their own music and profile
- **Permissions:**
  - Create, edit, publish songs
  - Manage artist profile
  - View personal analytics
  - Create events
  - View downloads
  
- **Dashboard:** `/dashboard/artist/dashboard`
- **Key Pages:**
  - My Songs: `/dashboard/artist/songs`
  - My Profile: `/dashboard/artist/profile`
  - My Events: `/dashboard/artist/events`
  - Analytics: `/dashboard/artist/analytics`

---

### 4. **CUSTOMER** - End User
- **Access:** Read-only access to public content
- **Permissions:**
  - View songs and lyrics
  - View artist profiles
  - Purchase products
  - Download resources
  
- **Dashboard:** `/dashboard/customer`
- **Key Pages:**
  - Wishlist: `/dashboard/customer/wishlist`
  - Downloads: `/dashboard/customer/downloads`
  - Orders: `/dashboard/customer/orders`

---

## Permission Matrix

| Permission | Admin | Editor | Artist | Customer |
|-----------|-------|--------|--------|----------|
| Create    | ✓     | ✓      | ✓      | ✗        |
| Read      | ✓     | ✓      | ✓      | ✓        |
| Update    | ✓     | ✓      | ✓      | ✗        |
| Delete    | ✓     | ✗      | ✗      | ✗        |
| Publish   | ✓     | ✓      | ✓      | ✗        |
| Moderate  | ✓     | ✗      | ✗      | ✗        |
| Manage Users | ✓  | ✗      | ✗      | ✗        |
| Analytics | ✓     | ✓      | ✓      | ✗        |

---

## Implementation Details

### 1. Database Structure
```sql
-- Profile table with role field
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'artist', 'customer', 'editor')),
  -- ... other fields
);
```

### 2. Permission Utilities

#### `lib/permissions.ts`
- Define role-based permissions
- Check user permissions
- Control resource access
- Get available actions for roles

```typescript
// Check if user has permission
hasPermission(role: UserRole, permission: string): boolean

// Check if user can access resource
canAccessResource(role: UserRole, resourceType: string): boolean

// Get available actions
getAvailableActions(role: UserRole): string[]
```

#### Usage Example:
```typescript
if (hasPermission(userRole, 'publish')) {
  // Show publish button
}

if (canAccessResource(userRole, 'songs')) {
  // Allow access to songs section
}
```

### 3. API Middleware

#### `lib/api-middleware.ts`
- Authenticate users
- Check permissions on API routes
- Protect endpoints

```typescript
// In API route handler
const auth = await protectedRoute('publish', 'news')
if (auth.status === 401 || auth.status === 403) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### 4. React Hook

#### `hooks/useRoleAccess.ts`
- Client-side permission checking
- Role detection
- Conditional rendering

```typescript
const { can, canAccess, isAdmin, isEditor, isArtist } = useRoleAccess(userRole)

if (can('publish')) {
  // Render publish button
}

if (isAdmin()) {
  // Admin-only UI
}
```

---

## Admin Management Pages

### Dashboard (`/dashboard/admin`)
- Overview stats
- Quick access to management sections

### Songs Management (`/dashboard/admin/songs`)
- View all songs
- **Create new:** `/dashboard/admin/songs/new`
- **Edit song:** `/dashboard/admin/songs/[id]/edit`
- Update status, metadata, music details
- Delete songs

### Artists Management (`/dashboard/admin/artists`)
- View all artists
- **Create artist:** `/dashboard/admin/artists/new`
- Update artist profiles
- Mark as verified/featured
- Manage social links

### Users Management (`/dashboard/admin/users`)
- View all platform users
- Change user roles
- Update user status
- Delete users

---

## Editor Management Pages

### Dashboard (`/dashboard/editor`)
- Pending content count
- Recent submissions for review
- Quick links to management sections

### News Management (`/dashboard/editor/news`)
- Create articles: `/dashboard/editor/news/new`
- Edit articles: `/dashboard/editor/news/[id]/edit`
- Publish/unpublish
- Feature on homepage
- Search and filter articles

### Lyrics Review (`/dashboard/editor/lyrics`)
- View pending lyrics submissions
- Approve/reject
- Provide feedback
- View analytics

### Featured Content (`/dashboard/editor/featured`)
- Manage homepage featured content
- Rotate featured items
- View engagement metrics

---

## Artist Dashboard Pages

### Dashboard (`/dashboard/artist/dashboard`)
- Personal stats
  - Total songs
  - Total views
  - Total downloads
  - Featured songs count
- Quick action links
- Recent songs display

### Songs Management (`/dashboard/artist/songs`)
- View all my songs
- **Create song:** `/dashboard/artist/songs/new`
- **Edit song:** `/dashboard/artist/songs/[id]/edit`
- Track views and downloads
- Publish/unpublish

### Profile Management (`/dashboard/artist/profile`)
- Update artist information
- Manage social media links
- Update bio and website
- View verification status

### Analytics (`/dashboard/artist/analytics`)
- Song performance metrics
- View statistics
- Track engagement

---

## Frontend Components

### RoleGate Component
```jsx
<RoleGate roles={['admin', 'editor']}>
  <AdminPanel />
</RoleGate>
```

### withRoleProtection HoC
```jsx
const ProtectedComponent = withRoleProtection(Component, ['admin'])
```

### useRoleAccess Hook
```jsx
const { can, isAdmin } = useRoleAccess(userRole)

return (
  <>
    {can('publish') && <PublishButton />}
    {isAdmin() && <AdminSettings />}
  </>
)
```

---

## Security Features

1. **Server-Side Validation**
   - All API routes validate user permissions
   - Database policies prevent unauthorized access

2. **Database Row-Level Security (RLS)**
   - Songs: Artists can only see their own songs
   - Artists: Can only update their own profile
   - Orders: Users can only see their own orders

3. **Client-Side Checks**
   - Hide UI elements user shouldn't access
   - Prevent navigation to unauthorized pages

4. **API Protection**
   - Required authentication
   - Permission-based endpoints
   - Rate limiting (future)

---

## Adding New Permissions

### Step 1: Update `lib/permissions.ts`
```typescript
export interface Permission {
  // ... existing permissions
  moderate: boolean
  new_permission: boolean
}

export const rolePermissions: RolePermissions = {
  admin: {
    // ...
    new_permission: true
  },
  editor: {
    // ...
    new_permission: true
  },
  // ...
}
```

### Step 2: Use in Components
```typescript
if (hasPermission(userRole, 'new_permission')) {
  // Show feature
}
```

---

## File Structure

```
├── lib/
│   ├── permissions.ts          # Role permissions definitions
│   ├── api-middleware.ts       # API route protection
│   └── types.ts                # Type definitions
├── hooks/
│   └── useRoleAccess.ts        # Client-side hook
└── app/
    └── dashboard/
        ├── admin/              # Admin pages
        │   ├── page.tsx
        │   ├── songs/
        │   ├── artists/
        │   ├── users/
        │   └── ...
        ├── editor/             # Editor pages
        │   ├── page.tsx
        │   ├── news/
        │   ├── lyrics/
        │   └── ...
        └── artist/             # Artist pages
            ├── dashboard/
            ├── songs/
            ├── profile/
            └── ...
```

---

## Best Practices

1. **Always check permissions server-side** - Don't rely only on client checks
2. **Use consistent permission naming** - 'create', 'read', 'update', 'delete'
3. **Lock down by default** - Start restrictive, open up as needed
4. **Log permission changes** - Track who changed roles and when
5. **Regular audits** - Review user roles and permissions quarterly

---

## Testing Roles Locally

### Create test users with different roles:
```sql
-- Admin user
UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com'

-- Editor user
UPDATE profiles SET role = 'editor' WHERE email = 'editor@test.com'

-- Artist user
UPDATE profiles SET role = 'artist' WHERE email = 'artist@test.com'

-- Customer user
UPDATE profiles SET role = 'customer' WHERE email = 'customer@test.com'
```

Navigate to respective dashboards to test role-based features.

---

## Future Enhancements

- [ ] Custom role creation
- [ ] Granular permission management
- [ ] Permission delegation
- [ ] Audit logging
- [ ] Two-factor authentication for admins
- [ ] IP whitelisting for admin access
- [ ] Session management
- [ ] API key management
