# Verification Checklist - Database & Routing Implementation

## ✅ Public Pages - Songs

- [x] `/songs/page.tsx` created - Server-side listing with search
- [x] `/songs/[slug]/page.tsx` created - Server-side detail with slug routing
- [x] Proper Supabase query with artist relationship
- [x] Metadata generation for SEO
- [x] Error handling with notFound()
- [x] Status filtering (published only)

**To Test:**
- [ ] Visit `/songs` - see list of all songs
- [ ] Click on a song - see detail page with correct data
- [ ] Search for song by title - returns filtered results
- [ ] Try invalid slug `/songs/non-existent` - shows 404
- [ ] Check metadata (page title, description) in browser

---

## ✅ Public Pages - Artists

- [x] `/artists/page.tsx` updated - Fixed schema to use `image_url` not `avatar_url`
- [x] `/artists/[slug]/page.tsx` created - Server-side detail with slug routing
- [x] Proper Supabase query with song relationship
- [x] Uses correct field: `image_url` (not `avatar_url`)
- [x] Error handling with notFound()

**To Test:**
- [ ] Visit `/artists` - see list of all artists
- [ ] Click on an artist - see detail page with correct image
- [ ] Verify artist profile image displays (using `image_url`)
- [ ] Verify related songs show for artist
- [ ] Try invalid slug `/artists/non-existent` - shows 404

---

## ✅ Public Pages - News

- [x] `/news/page.tsx` updated - Converted to SSR with category filter
- [x] `/news/[slug]/page.tsx` updated - Converted from CSR to SSR
- [x] Proper Supabase queries
- [x] Metadata generation for SEO
- [x] Error handling with notFound()
- [x] Status filtering (published only)

**To Test:**
- [ ] Visit `/news` - see list of all news articles
- [ ] Filter by category using form
- [ ] Search for news by title
- [ ] Click on article - see detail page with content
- [ ] Verify images load correctly
- [ ] Try invalid slug `/news/non-existent` - shows 404

---

## ✅ Public Pages - Products

- [x] `/products/page.tsx` created - Server-side listing with search
- [x] `/products/[slug]/page.tsx` created - Server-side detail with slug routing
- [x] Proper Supabase queries
- [x] Metadata generation for SEO
- [x] Error handling with notFound()
- [x] Status filtering (active only)

**To Test:**
- [ ] Visit `/products` - see list of all products
- [ ] Search for product by name
- [ ] Click on product - see detail page with price
- [ ] Verify images load correctly
- [ ] Try invalid slug `/products/non-existent` - shows 404

---

## ✅ Public Pages - Events

- [x] `/events-ssr/page.tsx` created - Server-side listing page
- [x] `/events/[slug]/page.tsx` updated - Converted from CSR to SSR
- [x] Proper Supabase queries
- [x] Metadata generation for SEO
- [x] Error handling with notFound()
- [x] Status filtering (active only)
- [x] Date formatting and sorting

**To Test:**
- [ ] Visit `/events-ssr` - see list of upcoming events
- [ ] Search for event by title
- [ ] Click on event - see detail page with date/location
- [ ] Verify date/time formatting
- [ ] Try invalid slug `/events/non-existent` - shows 404

---

## ✅ Error & Status Pages

- [x] `app/error.tsx` created - Global error boundary
- [x] `app/loading.tsx` created - Global loading state
- [x] `app/not-found.tsx` updated - 404 page with links

**To Test:**
- [ ] Navigate to non-existent route - see 404 page
- [ ] Check for error boundary in console
- [ ] Verify loading skeleton appears while data loads

---

## ✅ Navigation & Components

- [x] `Navbar.tsx` updated - Links point to new routes
  - [x] `/lyrics` → `/songs`
  - [x] `/events` → `/events-ssr`
  - [x] `/store` → `/products`
- [x] `SongCard.tsx` updated - Uses slug-based routing
- [x] `ArtistCard.tsx` updated - Uses slug-based routing and `image_url`

**To Test:**
- [ ] Click "Songs" in navbar - goes to `/songs`
- [ ] Click "Events" in navbar - goes to `/events-ssr`
- [ ] Click "Store" in navbar - goes to `/products`
- [ ] Click song card - goes to `/songs/[slug]`
- [ ] Click artist card - goes to `/artists/[slug]`
- [ ] All card images load correctly

---

## ✅ Dashboard Pages

### Admin Dashboard
- [x] `/dashboard/admin/page.tsx` - Admin overview with stats
- [x] `/dashboard/admin/songs/page.tsx` - Manage songs
- [x] `/dashboard/admin/artists/page.tsx` - Manage artists
- [x] `/dashboard/admin/news/page.tsx` - Manage news
- [x] `/dashboard/admin/events/page.tsx` - Manage events
- [x] `/dashboard/admin/orders/page.tsx` - View orders
- [x] `/dashboard/admin/users/page.tsx` - Manage users

### Artist Dashboard
- [x] `/dashboard/artist/page.tsx` - Artist's personal dashboard

### Customer Dashboard
- [x] `/dashboard/customer/page.tsx` - Customer's account dashboard

**To Test:**
- [ ] Navigate to `/dashboard/admin` (should redirect to login if not authenticated)
- [ ] After login as admin, verify all stats load
- [ ] Verify sidebar navigation works
- [ ] Try different roles (artist, customer) - should see different dashboards

---

## ✅ Schema Alignment

### Songs Table
- [x] Query uses: `id`, `slug`, `title`, `description`, `lyrics`, `cover_image`, `view_count`, `artist_id`, `status`, `created_at`
- [x] Joins with: `artists` via `artist_id`
- [x] Filters: `status = 'published'`

### Artists Table
- [x] Query uses: `id`, `slug`, `name`, `bio`, **`image_url`** (NOT avatar_url), `verified_status`, `genres`, `created_at`
- [x] Filters: No specific status filter (shows all)
- [x] Note: Fixed from `avatar_url` to `image_url`

### News Table
- [x] Query uses: `id`, `slug`, `title`, `content`, `category`, `featured_image`, `excerpt`, `status`, `created_at`
- [x] Filters: `status = 'published'`

### Products Table
- [x] Query uses: `id`, `slug`, `name`, `description`, `price`, `image_url`, `category`, `status`, `created_at`
- [x] Filters: `status = 'active'`

### Events Table
- [x] Query uses: `id`, `slug`, `title`, `description`, `event_date`, `location`, `image_url`, `status`, `ticket_price`, `capacity`, `created_at`
- [x] Filters: `status = 'active'`

---

## ✅ Database Data Requirements

Before testing, ensure your database has:

```sql
-- Songs
INSERT INTO songs (slug, title, status, artist_id) VALUES ...

-- Artists  
INSERT INTO artists (slug, name, image_url) VALUES ...
-- Note: Use image_url NOT avatar_url

-- News
INSERT INTO news (slug, title, status, category) VALUES ...

-- Products
INSERT INTO products (slug, name, status, price) VALUES ...

-- Events
INSERT INTO events (slug, title, status, event_date) VALUES ...
```

**Key Points:**
- All slug fields must be populated (used for routing)
- Status fields must be set correctly: `published` or `active`
- `image_url` is used (not `avatar_url`, `image`, or `photo`)
- Foreign key relationships must be valid

---

## ✅ Performance Checklist

After deployment, verify:

- [ ] Lighthouse score improved (check before/after)
- [ ] Time to First Contentful Paint (FCP) reduced
- [ ] Largest Contentful Paint (LCP) improved
- [ ] Core Web Vitals passing
- [ ] Images optimized with Next.js Image component
- [ ] No console errors in browser
- [ ] No database connection errors in logs
- [ ] Server response times are reasonable

---

## ✅ SEO Checklist

- [ ] Page titles are descriptive
- [ ] Meta descriptions are present
- [ ] Open Graph tags populated (for social sharing)
- [ ] Images have alt text
- [ ] No broken links
- [ ] URLs are human-readable (slugs)
- [ ] Structured data (schema.org) if applicable

---

## 🔍 Common Issues & Solutions

### Issue: Images not displaying
- [ ] Check if field is `image_url` (not `image` or `photo`)
- [ ] Verify image URLs are accessible
- [ ] Check browser console for CORS errors

### Issue: 404 on detail pages
- [ ] Verify slug exists in database
- [ ] Check slug field is not null
- [ ] Verify status is `published` or `active`

### Issue: Database query fails
- [ ] Check Supabase env vars in Settings → Vars
- [ ] Verify table name is correct
- [ ] Check field names match database schema
- [ ] Verify foreign key relationships

### Issue: Navbar links don't work
- [ ] Check link `href` values in Navbar.tsx
- [ ] Verify routes exist in app directory
- [ ] Check for typos in paths

### Issue: Dashboard won't load
- [ ] Verify user is authenticated
- [ ] Check browser has session cookie
- [ ] Verify user has required role

---

## 📋 Pre-Launch Checklist

Before going live:

- [ ] All pages tested in development
- [ ] All links verified working
- [ ] Database data validated (slugs, status, images)
- [ ] Performance metrics reviewed
- [ ] SEO metadata verified
- [ ] Error handling tested
- [ ] Mobile responsive design checked
- [ ] Cross-browser compatibility tested
- [ ] Accessibility (a11y) reviewed
- [ ] Security checks performed
- [ ] Backup created before deployment
- [ ] Monitoring/analytics configured
- [ ] Team notified of changes
- [ ] Documentation updated

---

## 📞 Support

If issues arise:

1. Check the implementation files created in `/app`
2. Review database schema in Supabase dashboard
3. Check environment variables in Settings → Vars
4. Look for error messages in browser console
5. Check server logs for database errors
6. Verify all relationships are configured correctly

---

**Last Updated**: 2/28/2026
**Status**: Ready for Testing & Deployment ✅
