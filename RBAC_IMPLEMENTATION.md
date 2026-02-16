# ROLE-BASED ACCESS CONTROL (RBAC) IMPLEMENTATION

## Overview

The JOB HOUSE PRODUCTION platform now implements full role-based access control with four user roles.

## User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `admin` | System Administrator | Full access to all features |
| `editor` | Content Editor | Manage news, lyrics, moderate content |
| `artist` | Music Artist | Manage own songs, view personal stats |
| `customer` | Regular User | View orders, download purchases |

## Role Permission Matrix

```
Permission                    | Admin | Editor | Artist | Customer
-----------------------------|-------|--------|--------|---------
manage_users                 |   ✓   |   ✗   |   ✗   |    ✗
manage_artists               |   ✓   |   ✗   |   ✗   |    ✗
manage_orders                |   ✓   |   ✗   |   ✗   |    ✗
manage_products              |   ✓   |   ✗   |   ✗   |    ✗
manage_leads                 |   ✓   |   ✗   |   ✗   |    ✗
manage_news                  |   ✓   |   ✓   |   ✗   |    ✗
manage_lyrics                |   ✓   |   ✓   |   ✗   |    ✗
view_stats                   |   ✓   |   ✓   |   ✗   |    ✗
view_financials              |   ✓   |   ✗   |   ✗   |    ✗
assign_roles                 |   ✓   |   ✗   |   ✗   |    ✗
approve_lyrics               |   ✓   |   ✓   |   ✗   |    ✗
create_news                  |   ✓   |   ✓   |   ✗   |    ✗
moderate_content             |   ✓   |   ✓   |   ✗   |    ✗
manage_own_songs             |   ✓   |   ✗   |   ✓   |    ✗
view_own_stats               |   ✓   |   ✓   |   ✓   |    ✗
request_verification         |   ✓   |   ✗   |   ✓   |    ✗
view_orders                  |   ✓   |   ✗   |   ✓   |    ✓
download_content             |   ✓   |   ✓   |   ✓   |    ✓
view_studio_requests         |   ✓   |   ✗   |   ✓   |    ✓
edit_own_profile             |   ✓   |   ✓   |   ✓   |    ✓
```

## Login Flow Diagram

```
User Login Request
       │
       ▼
┌─────────────────┐
│ Validate       │
│ Credentials    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Authenticate    │
│ via Supabase   │
└────────┬────────┘
         │
    Success/Failure
         │
         ▼
┌─────────────────┐
│ Get User Role  │
│ from profiles  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Role-based     │
│ Redirect       │
└────────┬────────┘
    ┌────┴────┬─────────┬──────┐
    ▼         ▼         ▼      ▼
 admin     editor    artist  customer
    │         │         │       │
    ▼         ▼         ▼       ▼
 /admin   /editor  /artist/  /dashboard
                   dashboard
```

## Dashboard Access Diagram

```
                    ┌─────────────────┐
                    │   Login Page    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌────────┐    ┌──────────┐  ┌──────────┐
         │ Admin  │    │  Editor  │  │ Customer │
         └────┬───┘    └────┬─────┘  └────┬─────┘
              │              │              │
              ▼              ▼              ▼
        /admin          /editor        /dashboard
              │              │              │
              │    ┌────────┴────────┐    │
              │    ▼                 ▼    │
              │ ┌──────────┐  ┌──────────┐ │
              │ │  Artist  │  │  Other   │ │
              │ │Dashboard │  │  Pages   │ │
              │ └──────────┘  └──────────┘ │
              │                            │
              └────────────────────────────┘
```

## Protected Routes

| Route | Required Role | Notes |
|-------|---------------|-------|
| `/admin/*` | admin | Full admin access |
| `/editor` | admin, editor | Content management |
| `/artist/dashboard` | admin, artist | Artist-only area |
| `/dashboard` | any authenticated | Customer dashboard |
| `/checkout` | any authenticated | Purchase flow |
| `/my-downloads` | any authenticated | Download access |

## API Routes Secured

| API Route | Required Role | Notes |
|-----------|---------------|-------|
| `/api/admin/*` | admin | Admin endpoints |
| `/api/store/orders` | authenticated | User's own orders |
| `/api/store/download/*` | authenticated + purchased | Secure downloads |

## Implementation Files

### Core Files
- `lib/auth/roles.ts` - Role helper functions and permissions
- `lib/auth/actions.ts` - Login/register with role redirects
- `middleware.ts` - Route protection middleware

### Dashboards
- `app/admin/page.tsx` - Admin dashboard
- `app/editor/page.tsx` - Editor dashboard
- `app/artist/dashboard/page.tsx` - Artist dashboard
- `app/dashboard/page.tsx` - Customer dashboard

## Security Notes

1. **Server-side validation** - All role checks happen on the server
2. **RLS policies** - Database-level security via Supabase RLS
3. **Middleware enforcement** - Route-level access control
4. **No client-only checks** - UI hiding is not relied upon for security
