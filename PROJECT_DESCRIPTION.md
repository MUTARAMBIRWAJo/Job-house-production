# JOB HOUSE PRODUCTION - Complete Project Description

## 📋 Project Overview

**JOB HOUSE PRODUCTION** is a comprehensive, production-ready gospel music platform built for Rwanda's music industry. It serves as a centralized hub for gospel lyrics, artist profiles, music production services, digital product sales, and community engagement.

### Core Purpose
- **Music Discovery**: Browse and search gospel lyrics in Kinyarwanda and English
- **Artist Connection**: Connect with verified gospel artists and their music
- **Studio Services**: Book professional recording, mixing, and production services
- **Digital Store**: Purchase digital music products, educational resources, and production kits
- **News & Updates**: Stay informed about gospel music industry news
- **CRM System**: Admin dashboard for managing leads, orders, and platform content

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.1.6 with App Router |
| **Runtime** | React 19.2.3 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui |
| **Forms** | React Hook Form + Zod validation |
| **Icons** | Lucide React |
| **Database** | Mock data (Supabase-ready architecture) |
| **Payments** | Stripe integration (webhooks configured) |
| **Package Manager** | pnpm |

---

## 🎯 Core Modules & Features

### 1. **Music & Lyrics Module**
- Full gospel lyrics database with Kinyarwanda and English songs
- View counts and trending algorithms
- Song detail pages with artist attribution
- Search and filter by language/trending

### 2. **Artist Directory Module**
- Verified artist profiles with bios
- Social media integration (Instagram, Facebook, WhatsApp)
- Song listings per artist
- Collaboration CTAs

### 3. **Studio Services Module**
- Multi-step booking form with validation
- Service packages: Recording, Production, Mixing & Mastering
- Budget estimation and timeline selection
- Lead capture and CRM integration

### 4. **Digital Store Module (E-commerce)**
- Product catalog with categories
- Shopping cart-less checkout (direct purchase)
- Stripe payment integration
- Digital download management
- Customer order history

### 5. **Admin CRM Module**
- Dashboard with KPI cards
- Lead management with status tracking
- Order management
- Platform statistics

### 6. **News & Blog Module**
- Gospel music industry news
- Category filtering
- Featured articles

---

## 📄 All Pages & Routes

### Public Pages (14 pages)

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page with hero, featured songs/artists, services overview, news highlights |
| `/lyrics` | `app/lyrics/page.tsx` | Gospel lyrics directory with search, pagination, sort options |
| `/lyrics/[id]` | `app/lyrics/[id]/page.tsx` | Individual song detail with full lyrics, view counter, share options |
| `/artists` | `app/artists/page.tsx` | Artist directory with verification filters, search, pagination |
| `/artists/[id]` | `app/artists/[id]/page.tsx` | Artist profile with bio, songs, contact info, social links |
| `/news` | `app/news/page.tsx` | News articles listing with categories, featured highlights |
| `/news/[id]` | `app/news/[id]/page.tsx` | Article detail page with related posts |
| `/store` | `app/store/page.tsx` | Digital products catalog with filters, search, pagination |
| `/store/[slug]` | `app/store/[slug]/page.tsx` | Individual product detail with purchase option |
| `/checkout` | `app/checkout/page.tsx` | Checkout page with email capture, Stripe integration |
| `/success` | `app/success/page.tsx` | Order confirmation page with download links |
| `/my-downloads` | `app/my-downloads/page.tsx` | Customer order history and downloads by email |
| `/studio` | `app/studio/page.tsx` | Studio services overview with booking form |
| `/search` | `app/search/page.tsx` | Unified search results across songs, artists, news |

### Static Pages (4 pages)

| Route | File | Description |
|-------|------|-------------|
| `/about` | `app/about/page.tsx` | Company mission, vision, values, team profiles |
| `/contact` | `app/contact/page.tsx` | Contact form, business hours, contact information |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/not-found` | `app/not-found.tsx` | Custom 404 error page |

### Admin Pages (7 routes)

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `app/admin/page.tsx` | Main dashboard with CRM stats, recent leads, KPI cards |
| `/admin/leads` | `app/admin/leads/page.tsx` | Lead management table with filters, search, pagination |
| `/admin/leads/[id]` | `app/admin/leads/[id]/page.tsx` | Individual lead detail with edit capabilities |
| `/admin/store` | `app/admin/store/page.tsx` | Store overview with stats |
| `/admin/store/orders` | `app/admin/store/orders/page.tsx` | Order management, export options |

---

## 🔌 API Routes

### Core API Endpoints

| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | `/api/songs` | `app/api/songs/route.ts` | List songs with pagination, filtering, sorting |
| GET | `/api/songs/[id]` | `app/api/songs/[id]/route.ts` | Get single song details |
| POST | `/api/songs` | `app/api/songs/route.ts` | Increment view count |
| GET | `/api/artists` | `app/api/artists/route.ts` | List artists with filters |
| GET | `/api/artists/[id]` | `app/api/artists/[id]/route.ts` | Get artist with songs |
| GET | `/api/news` | `app/api/news/route.ts` | List news articles |
| GET | `/api/news/[id]` | `app/api/news/[id]/route.ts` | Get article details |
| GET | `/api/studio` | `app/api/studio/route.ts` | List studio services |
| POST | `/api/studio` | `app/api/studio/route.ts` | Submit studio booking request |
| GET | `/api/feed` | `app/api/feed/route.ts` | RSS feed for news |
| GET | `/api/search` | `app/api/search/route.ts` | Unified search across content |

### Store API Endpoints

| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | `/api/store/products` | `app/api/store/products/route.ts` | List products with filters |
| GET | `/api/store/products/[identifier]` | `app/api/store/products/[identifier]/route.ts` | Get product by slug or ID |
| POST | `/api/store/products/create` | `app/api/store/products/create/route.ts` | Create new product |
| GET | `/api/store/products/related/[id]` | `app/api/store/products/related/[id]/route.ts` | Get related products |
| GET | `/api/store/categories` | `app/api/store/categories/route.ts` | Get all categories |
| GET | `/api/store/orders` | `app/api/store/orders/route.ts` | Get orders by email |
| GET | `/api/store/orders/[id]` | `app/api/store/orders/[id]/route.ts` | Get order details |
| POST | `/api/store/orders` | `app/api/store/orders/route.ts` | Create order |
| POST | `/api/store/checkout` | `app/api/store/checkout/route.ts` | Create Stripe checkout session |
| GET | `/api/store/stats` | `app/api/store/stats/route.ts` | Get store statistics |
| GET | `/api/store/download/[...file]` | `app/api/store/download/[...file]/route.ts` | Secure file download |

### Admin API Endpoints

| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | `/api/admin/stats` | `app/api/admin/stats/route.ts` | Dashboard statistics |
| GET | `/api/admin/leads` | `app/api/admin/leads/route.ts` | List leads with filters |
| GET | `/api/admin/leads/[id]` | `app/api/admin/leads/[id]/route.ts` | Get lead details |
| PUT | `/api/admin/leads/[id]` | `app/api/admin/leads/[id]/route.ts` | Update lead status |

### Webhooks

| Method | Route | File | Description |
|--------|-------|------|-------------|
| POST | `/api/webhooks/stripe` | `app/api/webhooks/stripe/route.ts` | Handle Stripe payment events |

---

## 🧩 Components

### Core Components (7)

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `components/Navbar.tsx` | Sticky navigation with mobile menu, logo, CTA buttons |
| `Footer` | `components/Footer.tsx` | Multi-column footer with links, social media, copyright |
| `SongCard` | `components/SongCard.tsx` | Song display with title, artist, view count |
| `ArtistCard` | `components/ArtistCard.tsx` | Artist profile with verified badge |
| `ProductCard` | `components/ProductCard.tsx` | Product display with price, category |
| `MultiStepForm` | `components/MultiStepForm.tsx` | 3-step studio booking form |
| `WhatsAppButton` | `components/WhatsAppButton.tsx` | Floating WhatsApp contact button |
| `VerifiedBadge` | `components/VerifiedBadge.tsx` | Visual indicator for verified artists |

### Search Components

| Component | File | Purpose |
|-----------|------|---------|
| `SearchResults` | `components/search/SearchResults.tsx` | Unified search results display |

### UI Components (30+ shadcn/ui)
Located in `components/ui/`:
- Button, Card, Input, Dialog, Select, Dropdown, Toast, Alert, Badge
- Table, Pagination, Tabs, Accordion, Form, Calendar, Chart
- Navigation Menu, Sheet (drawer), Resizable panels, and more

---

## 📊 Data Types & Models

### Core Types (`lib/types.ts`)

```typescript
// Music Types
Song, Artist, Lyric, NewsArticle, StudioLead, StudioService

// Store Types
Product, Order, OrderItem, StoreStats

// CRM Types
CRMStats, LeadStatus ('new' | 'contacted' | 'in_progress' | 'completed' | 'lost')
LeadPriority ('low' | 'medium' | 'high')

// Search Types
SearchResult { songs, artists, news }
```

---

## 🔄 Data Flow & Logic

### 1. **Home Page Flow**
```
User visits / → Fetches featured songs (trending) → Fetches featured artists (verified)
→ Displays hero with search → Shows sections: Trending Songs, Featured Artists, Services, News
```

### 2. **Lyrics Flow**
```
User visits /lyrics → Fetches songs with pagination → User searches/filters
→ Click song → Fetches song details → Increments view count → Displays lyrics
```

### 3. **Studio Booking Flow**
```
User visits /studio → Views service cards → Clicks "Request Services"
→ Opens MultiStepForm:
  Step 1: Project Type, Budget Range
  Step 2: Project Description
  Step 3: Contact Info (Name, Email, Phone)
→ Submit → API saves lead → Success message
```

### 4. **Store Purchase Flow**
```
User browses /store → Filters by category/search → Views product /store/[slug]
→ Clicks "Buy Now" → Redirects to /checkout?productId=XXX
→ Enters email → Clicks "Continue to Payment"
→ Creates Stripe checkout session → Redirects to Stripe
→ After payment → Redirects to /success?orderId=XXX
→ User can download from /success or /my-downloads
```

### 5. **Admin CRM Flow**
```
Admin logs in → Visits /admin → Sees dashboard with:
  - KPI cards (Total Leads, New Leads, In Progress, Completed)
  - Platform stats (Songs, Artists, News)
  - Recent Activity list
→ Clicks "Leads" → Views lead table with filters
→ Clicks lead → Edits status/notes → Saves updates
```

### 6. **Search Flow**
```
User enters search → Visits /search?q=query
→ API searches: songs, artists, news simultaneously
→ Displays categorized results with tabs/filters
```

---

## 🎨 Design System

### Color Palette (Navy & Gold Theme)
- **Primary**: Deep Navy `#001f3f`
- **Secondary**: Gold `#D4AF37`
- **Background**: White variants
- **Foreground**: Dark text

### Design Tokens (`app/globals.css`)
- CSS variables for colors, typography, spacing
- Mobile-first responsive breakpoints
- Dark mode support via next-themes

---

## 📁 Project Structure

```
job-house-production/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout (Navbar + Footer)
│   ├── globals.css                 # Global styles + design tokens
│   ├── (pages)/
│   │   ├── lyrics/                 # Lyrics routes
│   │   ├── artists/                # Artist routes
│   │   ├── news/                   # News routes
│   │   ├── store/                  # E-commerce routes
│   │   ├── studio/                 # Studio services
│   │   ├── about/, contact/        # Static pages
│   │   └── search/                 # Search results
│   ├── admin/                      # Admin CRM routes
│   ├── api/                        # API routes
│   └── not-found.tsx               # 404 page
├── components/
│   ├── Navbar.tsx, Footer.tsx      # Layout components
│   ├── SongCard.tsx, ArtistCard.tsx # Display cards
│   ├── ProductCard.tsx              # Store cards
│   ├── MultiStepForm.tsx            # Studio booking form
│   ├── search/SearchResults.tsx     # Search UI
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── mock-data.ts                # Sample data
│   ├── db-actions.ts               # Data operations (mock)
│   ├── utils-custom.ts             # Utility functions
│   └── supabase-*.ts               # Supabase clients (optional)
├── public/
│   └── robots.txt                  # SEO
├── app/sitemap.ts                  # Dynamic sitemap
├── tailwind.config.ts              # Tailwind config
└── package.json                    # Dependencies
```

---

## 📈 Key Features Summary

### ✅ Implemented Features
- [x] Responsive design (mobile-first)
- [x] Full-text search across all content
- [x] Multi-step forms with validation
- [x] Pagination and filtering
- [x] SEO optimization (sitemap, meta tags)
- [x] Stripe payment integration (webhooks)
- [x] Digital product delivery
- [x] Admin CRM dashboard
- [x] Lead management workflow
- [x] Order management
- [x] View/download tracking
- [x] WhatsApp integration

### 🔜 Future Enhancements
- [ ] User authentication
- [ ] Supabase database integration
- [ ] Email notifications
- [ ] Dark/light theme toggle
- [ ] User favorites/bookmarks
- [ ] Payment integration for studio services
- [ ] Artist analytics dashboard
- [ ] Multi-language support (Kinyarwanda)
- [ ] Social sharing
- [ ] Comments/reviews system

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

**Visit**: http://localhost:3000

---

## 📄 License

This project is proprietary software of JOB HOUSE PRODUCTION.

---

**Built with ❤️ for Gospel Music in Rwanda**

---

## 🔐 AUTHENTICATION INFRASTRUCTURE (PHASE 0)

### 1️⃣ Database Schema & Supabase Setup

```sql
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'artist', 'customer', 'editor');

-- Profiles table extending auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification requests table (Phase 2 ready)
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id)
);

-- Update orders table to link to user accounts
ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;

-- Update downloads table for user-based access
ALTER TABLE downloads ADD COLUMN user_id UUID REFERENCES profiles(id);
ALTER TABLE downloads ADD COLUMN signed_url TEXT;
ALTER TABLE downloads ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2️⃣ Auth Pages & Components

**Routes to Create:**

| Route | File | Purpose |
|-------|------|---------|
| `/login` | `app/(auth)/login/page.tsx` | User sign in |
| `/register` | `app/(auth)/register/page.tsx` | User registration |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Password reset request |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | New password entry |
| `/verify` | `app/(auth)/verify/page.tsx` | Email verification |

**Requirements:**
- Zod schema validation
- React Hook Form integration
- Error boundaries
- Loading skeletons
- Redirect logic (already authenticated → dashboard)
- Email verification flow
- Password reset flow
- Remember me functionality
- Rate limiting protection

**Components to Create:**

| Component | Purpose |
|-----------|---------|
| `AuthFormWrapper` | Consistent auth layout |
| `SocialAuthButtons` | Google/GitHub ready |
| `AuthGuard` | Client-side protection |
| `RoleGuard` | Role-based rendering |

### 3️⃣ Middleware Protection (`middleware.ts`)

```typescript
// Protected route patterns
const protectedRoutes = [
  '/dashboard',
  '/artist',
  '/admin',
  '/checkout',
  '/my-downloads',
  '/studio/requests',
  '/profile'
];

// Role-specific routes
const adminRoutes = ['/admin'];
const artistRoutes = ['/artist'];

// Public routes that redirect if authenticated
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  // Session validation
  // Role-based redirects
  // Token refresh logic
  // Path rewrites for clean URLs
}
```

### 4️⃣ Server-Side Auth Utilities

**`/lib/auth/session.ts`**
- Get current user (server component safe)
- Get user role
- Check permissions
- Create authenticated Supabase client

**`/lib/auth/actions.ts`**
- Sign up
- Sign in
- Sign out
- Reset password
- Update profile
- Server actions with error handling

**`/lib/auth/guards.ts`**
- `requireAuth()` - Redirect or throw
- `requireRole(role)` - Role validation
- `withAuth` - HOC for pages router compatibility

### 5️⃣ Auth Provider & Hooks

**`components/providers/auth-provider.tsx`**
- Client context for auth state
- Hydration-safe
- Role exposure
- Permission helpers

**Custom Hooks:**

| Hook | Purpose |
|------|---------|
| `useUser()` | Get current user |
| `useRole()` | Get user role |
| `usePermissions()` | Check abilities |
| `useRequireAuth()` | Component-level protection |

---

## 👥 PHASE 1 — USER DASHBOARDS

### 1️⃣ Customer Dashboard (`/dashboard`)

**Access:** Authenticated users with role 'customer'

**Components:**
- `OrderHistory` - List of past purchases with status badges
- `DownloadManager` - Secure download links with signed URLs
- `StudioRequests` - Booking history and status tracking
- `AccountSettings` - Profile management, password change, delete account
- `Favorites` - Saved lyrics/artists (Phase 4 ready)

**Features:**
- View order status (paid, pending, failed, refunded)
- Re-download purchased items with expiry tracking
- Track studio booking status (new, contacted, in_progress, completed)
- Update personal information (name, email, phone)
- Change password with validation
- Delete account option with confirmation

**Dashboard Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  CUSTOMER DASHBOARD                                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │ Quick Stats     │  │ Recent Orders                   │   │
│  │ ├ Orders: 5     │  │ ├ Order #1001 - Paid           │   │
│  │ │ Downloads: 12  │  │ ├ Order #1002 - Paid           │   │
│  │ │ Requests: 2    │  │ └ Order #1003 - Pending        │   │
│  └─────────────────┘  └─────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ My Downloads                                          │    │
│  │ ├ Product A - Download (expires in 2h)               │    │
│  │ ├ Product B - Download (expires in 5h)               │    │
│  │ └ Product C - Download (expires in 1d)               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Studio Requests                                       │    │
│  │ ├ Request #1 - In Progress (Assigned: James)         │    │
│  │ └ Request #2 - Completed (Feb 10, 2024)             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2️⃣ Artist Dashboard (`/artist/dashboard`)

**Access:** Authenticated users with role 'artist' OR 'admin'

**Access Control:**
- Verification status displayed prominently
- Limited features if not verified (show verification CTA)
- Admin can access all artist dashboards

**Sections:**

#### A. Profile Management
- Bio editor with formatting
- Photo gallery upload
- Social links (Instagram, Facebook, WhatsApp, YouTube)
- Genre selection
- Location settings

#### B. Content Upload
- Lyrics submission form with Kinyarwanda/English toggle
- News/articles submission with moderation flag
- Audio file upload (future)
- Draft vs. Published status

#### C. Verification Status
```
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION STATUS                                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │ [Badge]     │  │ Status: Pending                    │   │
│  │ Verified    │  │ Submitted: Feb 15, 2024            │   │
│  │ Artist      │  │ Expected review: 3-5 business days │   │
│  └─────────────┘  └─────────────────────────────────────┘   │
│                                                             │
│  [Continue Verification Request]                            │
└─────────────────────────────────────────────────────────────┘
```

#### D. Stats Preview (Coming Soon)
- Total views across all songs
- Download counts
- Monthly listener growth
- Geographic distribution

#### E. Studio Projects
- Active collaborations
- Past projects history
- Producer assignments
- Project status tracking

**Artist Dashboard Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ARTIST DASHBOARD - Grace Mugabe                    [Edit]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │ Profile Card    │  │ Quick Stats                     │   │
│  │ [Avatar]        │  │ ├ Songs: 15                     │   │
│  │ [Verified ✓]    │  │ │ Views: 12,450                 │   │
│  │ Gospel Artist   │  │ │ Downloads: 342                 │   │
│  └─────────────────┘  └─────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ My Content                                             │    │
│  │ ┌──────────┬────────────┬────────────┬────────────┐ │   │
│  │ │ Title    │ Type       │ Status     │ Views      │ │   │
│  │ ├──────────┼────────────┼────────────┼────────────┤ │   │
│  │ │ Imana... │ Lyric      │ Published  │ 2,451      │ │   │
│  │ │ Amahoro..│ Lyric      │ Published  │ 1,876      │ │   │
│  │ │ New Song │ Draft      │ -          │ -          │ │   │
│  │ └──────────┴────────────┴────────────┴────────────┘ │   │
│  │ [Upload New Content]                                 │   │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Verification Progress                                │    │
│  │ [███████████████░░░░░░] 80% Complete                │    │
│  │ [Submit Verification Request]                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 3️⃣ Admin Dashboard (`/admin`)

**Access:** Authenticated users with role 'admin' ONLY

#### Dashboard Home (`/admin`)

**KPI Cards Section:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Total Leads│  New Leads  │ In Progress │ Completed   │
│      47     │      12     │      8      │      27     │
│             │             │             │  this month │
│ All studio  │ Awaiting    │ Active      │ This month  │
│ inquiries   │ contact     │ projects    │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Platform Stats Section:**
```
┌──────────────┬──────────────┬──────────────┐
│  Total Songs │Total Artists │ News Posts   │
│      156     │      89      │      42      │
└──────────────┴──────────────┴──────────────┘
```

**Recent Activity:**
```
Card-based list with status badges:
├─ Emmanuel Nshimiyimana - Music Production - [New]
├─ Theresa Uwitonze - Recording - [Contacted]
├─ Paul Kabisibo - Mixing - [In Progress]
├─ Claudette Nkubito - Production - [In Progress]
└─ Innocent Ntiranyibanza - Recording - [Completed]
```

#### Leads Management (`/admin/leads`)

**Filter Bar:**
```
┌──────────────┬───────────────┬──────────────┬──────────────┐
│ [Search...]  │ [All Status ▼] │ [All Priority▼]│ [Newest ▼]  │
└──────────────┴───────────────┴──────────────┴──────────────┘
Showing 1-10 of 47              [Clear filters]
```

**Desktop Table View:**
```
┌────────┬────────┬────────────┬──────────┬────────┬──────────────┬──────────┐
│ Name   │ Email  │ Project    │ Budget   │ Status │ Priority     │ Created  │
├────────┼────────┼────────────┼──────────┼────────┼──────────────┼──────────┤
│Lead 1  │email@… │Production  │150K RWF  │[New]   │High          │Feb 20    │
│Lead 2  │email@… │Recording   │50K RWF   │[Ctd]   │Medium        │Feb 18    │
│Lead 3  │email@… │Mixing      │75K RWF   │[Prog]  │High          │Feb 15    │
│Lead 4  │email@… │Production  │120K RWF  │[Prog]  │Medium        │Feb 12    │
│Lead 5  │email@… │Recording   │50K RWF   │[Compl] │Low           │Feb 8     │
└────────┴────────┴────────────┴──────────┴────────┴──────────────┴──────────┘
```

**Mobile Card View:**
```
┌──────────────────────────────────┐
│ Lead Name 1              [Status] │
│ email@example.com                │
│                                  │
│ Service Type    │    Budget      │
│ 50K RWF         │ Created: Feb 20│
│ Priority: High  │ View →        │
└──────────────────────────────────┘
```

#### Lead Detail Page (`/admin/leads/[id]`)

**Left Section - Lead Information:**
```
┌─ CONTACT INFORMATION
│  Name: Emmanuel Nshimiyimana
│  Genre: Gospel
│  📧 Email: emmanuel@example.com
│  📞 Phone: +250788123456
│
├─ PROJECT DETAILS
│  Service: Music Production Package
│  Budget: RWF 150,000
│  Timeline: 3 months
│  Description: Long text describing...
│
├─ TIMELINE
│  Created: Feb 20, 2024, 10:30 AM
│  Updated: Feb 20, 2024, 10:30 AM
│
└─ ACTIONS
   [📧 Email] [📞 Call] [💬 WhatsApp]
```

**Right Section - Management:**
```
┌─ Status Dropdown
│  [new / contacted / in_progress / completed / cancelled]
│
├─ Priority Dropdown
│  [low / medium / high]
│
├─ Assigned To
│  [Text input: type name]
│
├─ Internal Notes
│  [TextArea for team notes...]
│
└─ [Save Changes]
```

#### Admin Dashboard Layout (Full):
```
┌──────────┬────────────────────────────────────────────────────┐
│ SIDEBAR  │  MAIN CONTENT                                     │
│          │                                                    │
│ ☰ Menu   │  ┌──────┬──────┬──────┬──────┐                   │
│          │  │KPI 1 │KPI 2 │KPI 3 │KPI 4 │                   │
│ Dashboard│  └──────┴──────┴──────┴──────┘                   │
│          │                                                    │
│ Studio   │  Recent Activity Cards                            │
│ Leads    │  ├─ Lead 1 [Status]                              │
│          │  ├─ Lead 2 [Status]                              │
│ Orders   │  ├─ Lead 3 [Status]                              │
│ Products │  └─ Lead 4 [Status]                              │
│ Users    │                                                    │
│ Settings │  [View All Leads →]                              │
│          │                                                    │
│ ──────── │                                                    │
│ Logout   │                                                    │
└──────────┴────────────────────────────────────────────────────┘
```

### 4️⃣ Store Admin Dashboard (`/admin/store`)

**Access:** Authenticated users with role 'admin'

**KPI Cards:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Total      │  Active     │  Total      │  Revenue    │
│ Products    │  Products   │  Orders     │             │
│      47     │      42     │      156    │  $2,459.00  │
│             │             │             │             │
│ All items   │ Listed      │ All time    │  This month │
│ in store    │ for sale    │ purchases   │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Order Management (`/admin/store/orders`):**
```
┌─────────────────────────────────────────────────────────────┐
│  STORE ORDERS                                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┬────────────┬──────────┬─────────────────┐    │
│  │ Order ID │ Customer   │ Amount   │ Status          │    │
│  ├──────────┼────────────┼──────────┼─────────────────┤    │
│  │ #1001    │ user@ex.c  │ $9.99    │ [Paid ✓]        │    │
│  │ #1002    │ john@ex.c │ $44.98   │ [Paid ✓]        │    │
│  │ #1003    │ info@ex.c  │ $19.99   │ [Pending ⏳]    │    │
│  └──────────┴────────────┴──────────┴─────────────────┘    │
│                                                             │
│  [Export as CSV] [Export as PDF]                            │
└─────────────────────────────────────────────────────────────┘
```

**Product Management (`/admin/products`):**
- List all products with CRUD operations
- Create new product form
- Edit existing products
- Toggle active/inactive status

---

## ✅ PHASE 2 PREPARATION — ARTIST VERIFICATION SYSTEM

### 1️⃣ Customer Dashboard (`/dashboard`)

**Components:**
- `OrderHistory` - List of past purchases
- `DownloadManager` - Secure download links
- `StudioRequests` - Booking history
- `AccountSettings` - Profile management
- `Favorites` - Saved lyrics/artists (Phase 4 ready)

**Features:**
- View order status
- Re-download purchased items
- Track studio booking status
- Update personal information
- Change password
- Delete account option

### 2️⃣ Artist Dashboard (`/artist/dashboard`)

**Access Control:** Role = 'artist' OR 'admin'

**Sections:**
- **Profile Management**: Bio, photos, social links
- **Content Upload**: Lyrics submission, news/articles
- **Verification Status**: Progress tracker
- **Stats Preview**: Views, downloads (coming soon)
- **Studio Projects**: Active/past collaborations

**Forms:**
- Artist verification request
- Profile completion checklist
- Content submission with moderation flag

### 3️⃣ Admin Dashboard Enhancements

Update existing `/admin` routes:
- Add user management table
- Role assignment interface
- Verification request queue
- Content moderation panel
- System logs viewer

---

## ✅ PHASE 2 PREPARATION — ARTIST VERIFICATION SYSTEM

### Data Models Ready:

```typescript
interface VerificationRequest {
  id: string;
  artistId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[]; // Social links, portfolio
  adminNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

interface VerifiedArtist {
  userId: string;
  verifiedAt: Date;
  verifiedBy: string;
  badgeType: 'standard' | 'premium';
  expiresAt?: Date; // For subscription model
}
```

### UI Components (Stubbed):
- Verification badge component
- Verification request form
- Admin approval workflow
- Expiration handling

---

## 📊 PHASE 3-4 READY STRUCTURE

### Analytics Schema Ready:

```sql
-- Prepare for analytics phase
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT,
  page_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notification System Schema:

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT,
  title TEXT,
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔄 EXISTING INTEGRATIONS TO UPDATE

### 1️⃣ Store Checkout Flow

**Modify `/checkout`:**
- Guest checkout optional
- After purchase: link order to user if logged in
- Store user_id in orders table
- Generate secure signed URLs for downloads

**Update `/my-downloads`:**
- Authenticated only
- Fetch by user_id
- Signed URL generation with expiration
- Download tracking

### 2️⃣ Studio Booking

**Update `/studio`:**
- Pre-fill forms if authenticated
- Link requests to user account
- Booking history in dashboard
- Status notifications

### 3️⃣ Artist Profiles

**Update `/artists/[id]`:**
- Show verification badge
- Link to artist dashboard if owner
- Admin edit controls

---

## 🧪 TESTING REQUIREMENTS

**Test Scenarios:**

| Category | Tests |
|----------|-------|
| **Registration Flow** | New account creation, Email verification, Default role assignment, Profile creation |
| **Login Flow** | Successful login, Failed attempts, Password reset, Session persistence |
| **Authorization** | Admin accessing admin routes, Artist accessing artist routes, Customer blocked from admin, Unauthenticated redirected |
| **Data Isolation** | User A cannot see User B's orders, Artists only edit own content, Admins see everything |
| **Download Security** | Signed URLs expire, Cannot access without ownership, Guest downloads linked properly |

---

## 📁 FILE STRUCTURE TO CREATE

```
app/
  /(auth)/
    /login/
      page.tsx
    /register/
      page.tsx
    /forgot-password/
      page.tsx
    /reset-password/
      page.tsx
    layout.tsx
  
  /(dashboard)/
    /dashboard/
      page.tsx
      /orders/
        page.tsx
      /downloads/
        page.tsx
      /studio-requests/
        page.tsx
      /settings/
        page.tsx
    /artist/
      /dashboard/
        page.tsx
      /profile/
        page.tsx
      /verification/
        page.tsx
    layout.tsx

  /api/
    /auth/
      /callback/
        route.ts
      /verify/
        route.ts
    /users/
      route.ts
      /[id]/
        route.ts

lib/
  /auth/
    session.ts
    actions.ts
    guards.ts
    middleware.ts
  /db/
    /migrations/
      001_initial_auth.sql
  /validations/
    auth.ts
  /hooks/
    useAuth.ts
    useRole.ts

components/
  /auth/
    LoginForm.tsx
    RegisterForm.tsx
    AuthGuard.tsx
    RoleGuard.tsx
    VerificationBadge.tsx
  
  /dashboard/
    DashboardLayout.tsx
    OrderCard.tsx
    DownloadItem.tsx
```

---

## 🚫 DO NOT BREAK

- All existing public routes must remain accessible
- Store purchase flow for guests must work
- Existing admin CRM functionality
- SEO-optimized lyric pages
- Current API contracts

---

## ✅ SUCCESS CRITERIA

- [ ] `next build` passes with zero errors
- [ ] All auth pages render correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] Admin routes only accessible by admin role
- [ ] Artist dashboard accessible only by artist/admin
- [ ] Orders linked to user accounts
- [ ] Downloads secured with signed URLs
- [ ] RLS policies working (tested)
- [ ] No regressions in existing features
- [ ] Type-safe across all new implementations
