# Supabase Setup for Job House Production

This document describes how the Supabase database has been configured for the Job House Production project.

## Connection Details

- **URL**: https://svkhumefxncdtoellmns.supabase.co
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a2h1bWVmeG5jZHRvZWxsbW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTQ3MjAsImV4cCI6MjA4NjQ3MDcyMH0.cZDtYSR0D_oHUOTsBwzrayYQkWQTaBGsPhIkPDb2uWA`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a2h1bWVmeG5jZHRvZWxsbW5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5NDcyMCwiZXhwIjoyMDg2NDcwNzIwfQ.0lLNO13GeYnKItAjhur6g64YBxpvMVHJNqTV724PLlg`

## Database Tables

The following tables have been created:

| Table | Description |
|-------|-------------|
| `artists` | Artist profiles and information |
| `songs` | Song tracks with lyrics and metadata |
| `news` | News articles and updates |
| `categories` | Product categories for the store |
| `products` | Digital products for sale |
| `orders` | Order records |
| `order_items` | Order line items |
| `studio_leads` | Studio service inquiries |
| `downloads` | Download tracking |

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/run-migration.js` | Creates database schema |
| `scripts/run-seed.js` | Seeds database with initial data |
| `scripts/verify.js` | Verifies database connection and data |

## Usage

### Verify Connection
```bash
node scripts/verify.js
```

### Run Migrations
```bash
node scripts/run-migration.js
```

### Seed Database
```bash
node scripts/run-seed.js
```

## Storage Buckets

The following storage buckets need to be created in the Supabase Dashboard:

1. **avatars** - For artist avatars
2. **covers** - For song/album covers
3. **products** - For product files
4. **news** - For news images

## Environment Variables

The following environment variables are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://svkhumefxncdtoellmns.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.svkhumefxncdtoellmns:ys1DrdTnYrz8RUl1@...
```

## Seeded Data

The following data has been seeded:

- **4 Artists**: Grace Mugabe, David Kwizera, Moses Kabanda, Sarah Mukamana
- **6 Songs**: Imana Yanjye, Ubwenge Bwanjye, Nzibire, Ushindi, Yambaye Ubwenge, Amahoro Ashira
- **5 News Articles**: Gospel Music Conference, Streaming Platform, Award, Recording Tips, Trends
- **6 Products**: Gospel Hymns, Kinyarwanda Worship, Production Kit, Theory Guide, Video Templates, Vocal Arrangements
- **6 Categories**: Hymns, Original Compositions, Production Resources, Educational Materials, Digital Resources, Sheet Music
- **2 Orders**: Sample orders for testing
- **6 Studio Leads**: Sample leads for CRM

## Row Level Security (RLS)

RLS policies have been configured:

- Public read access for: artists, songs, news, products, categories
- Authenticated insert access for: orders, order_items, studio_leads
- Admin full access using service_role

## Troubleshooting

### Connection Issues
If the database connection fails, verify:
1. The `.env.local` file exists and has correct values
2. The DATABASE_URL is properly formatted
3. Network connectivity to Supabase

### Migration Issues
If migrations fail:
1. Check if tables already exist
2. Verify PostgreSQL extensions are enabled
3. Check for UUID conflicts

## Support

For Supabase-related issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.gg/supabase)
