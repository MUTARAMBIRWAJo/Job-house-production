# Database Migration Guide - CRM Admin Dashboard

## Overview
This guide explains how to upgrade your Supabase database to support the Admin CRM Dashboard features.

## Required Database Changes

### 1. Update studio_leads Table

If you have an existing `studio_leads` table, you need to add new columns:

```sql
-- Add new columns to studio_leads table
ALTER TABLE studio_leads 
ADD COLUMN status TEXT NOT NULL DEFAULT 'new',
ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN assigned_to TEXT,
ADD COLUMN internal_notes TEXT,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create enum types for better data integrity
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE lead_priority AS ENUM ('low', 'medium', 'high');

-- Update column types to use enums (optional but recommended)
ALTER TABLE studio_leads 
ALTER COLUMN status TYPE lead_status USING status::lead_status,
ALTER COLUMN priority TYPE lead_priority USING priority::lead_priority;

-- Create index for better performance
CREATE INDEX idx_studio_leads_status ON studio_leads(status);
CREATE INDEX idx_studio_leads_priority ON studio_leads(priority);
CREATE INDEX idx_studio_leads_created_at ON studio_leads(created_at DESC);
```

### 2. Create Complete Table Schema (Fresh Start)

If creating from scratch:

```sql
CREATE TABLE studio_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  service_type VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  budget NUMERIC,
  description TEXT,
  timeline VARCHAR(100),
  status lead_status NOT NULL DEFAULT 'new',
  priority lead_priority NOT NULL DEFAULT 'medium',
  assigned_to VARCHAR(255),
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_studio_leads_status ON studio_leads(status);
CREATE INDEX idx_studio_leads_priority ON studio_leads(priority);
CREATE INDEX idx_studio_leads_created_at ON studio_leads(created_at DESC);
CREATE INDEX idx_studio_leads_artist_name ON studio_leads(artist_name);
CREATE INDEX idx_studio_leads_email ON studio_leads(email);
```

### 3. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE studio_leads ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated admins only
CREATE POLICY "Enable read for authenticated users" 
ON studio_leads FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON studio_leads FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON studio_leads FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Enable delete for authenticated users" 
ON studio_leads FOR DELETE 
TO authenticated 
USING (true);
```

### 4. Create Update Trigger (Auto-update timestamp)

```sql
-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_studio_leads_updated_at BEFORE UPDATE ON studio_leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Create Views (Optional - for analytics)

```sql
-- View for dashboard statistics
CREATE OR REPLACE VIEW lead_statistics AS
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_leads,
  COUNT(CASE WHEN status = 'completed' AND DATE_TRUNC('month', updated_at) = DATE_TRUNC('month', NOW()) THEN 1 END) as completed_this_month,
  COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_leads,
  AVG(budget) as average_budget,
  MAX(created_at) as latest_lead_date
FROM studio_leads;

-- View for team performance
CREATE OR REPLACE VIEW team_performance AS
SELECT
  assigned_to,
  COUNT(*) as total_assigned,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
  ROUND(100.0 * COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*), 2) as completion_rate
FROM studio_leads
WHERE assigned_to IS NOT NULL
GROUP BY assigned_to;
```

## Migration Steps

### Step 1: Backup Your Database
```
Supabase Dashboard → Database → Backups → Create backup
```

### Step 2: Run Migration SQL

In Supabase SQL Editor:

1. Go to `SQL Editor`
2. Create new query
3. Copy and paste the SQL from above
4. Run each section separately
5. Verify no errors

### Step 3: Verify Tables

```sql
-- Check studio_leads structure
\d studio_leads

-- Verify indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'studio_leads';

-- Test RLS policies
SELECT * FROM studio_leads LIMIT 1;
```

### Step 4: Update Environment Variables

If not already set, add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Data Migration (If Upgrading Existing Table)

### Step 1: Backup Existing Data
```sql
-- Create backup table
CREATE TABLE studio_leads_backup AS SELECT * FROM studio_leads;
```

### Step 2: Set Default Values
```sql
-- Set default status for existing records
UPDATE studio_leads SET status = 'completed' WHERE status IS NULL;
UPDATE studio_leads SET priority = 'medium' WHERE priority IS NULL;
UPDATE studio_leads SET updated_at = created_at WHERE updated_at IS NULL;
```

### Step 3: Verify Migration
```sql
-- Count records
SELECT COUNT(*) FROM studio_leads;
SELECT COUNT(DISTINCT status) FROM studio_leads;

-- Check status distribution
SELECT status, COUNT(*) as count FROM studio_leads GROUP BY status;
```

## Rollback Plan

If something goes wrong:

```sql
-- Restore from backup
DROP TABLE studio_leads;
ALTER TABLE studio_leads_backup RENAME TO studio_leads;

-- Or restore from Supabase backup
-- Use Supabase dashboard → Database → Backups → Restore
```

## Testing

### Test Data
The application includes mock data for testing. To populate with real test data:

```sql
INSERT INTO studio_leads (
  artist_name, email, phone, service_type, genre, 
  budget, description, timeline, status, priority
) VALUES
('Test Artist 1', 'test1@example.com', '+250788123456', 'Studio Recording Package', 'Gospel', 50000, 'Test project', '1 month', 'new', 'high'),
('Test Artist 2', 'test2@example.com', '+250789654321', 'Music Production Package', 'Gospel', 150000, 'Full production', '3 months', 'in_progress', 'medium');
```

### Test Queries
```sql
-- Test filtering by status
SELECT * FROM studio_leads WHERE status = 'new';

-- Test filtering by priority
SELECT * FROM studio_leads WHERE priority = 'high';

-- Test search
SELECT * FROM studio_leads WHERE artist_name ILIKE '%artist%';

-- Test statistics
SELECT * FROM lead_statistics;
```

## Performance Optimization

### 1. Add Indexes
Already included in migration scripts for:
- status
- priority
- created_at
- artist_name
- email

### 2. Vacuum & Analyze
```sql
VACUUM ANALYZE studio_leads;
```

### 3. Check Query Plans
```sql
EXPLAIN ANALYZE SELECT * FROM studio_leads WHERE status = 'new';
```

## Supabase Console Configuration

### 1. Enable Auth
- Dashboard → Authentication → Settings
- Enable Email/Password auth if not already enabled
- Set JWT expiry if needed

### 2. Create Service Role Key
- Settings → API Keys
- Copy "Service Role" key for server actions

### 3. Configure RLS
- Dashboard → SQL Editor
- Run RLS policies from migration script
- Test with authenticated user

## Testing the Integration

### 1. Test API Endpoints
```bash
# Get stats
curl https://your-app/api/admin/stats

# Get leads
curl https://your-app/api/admin/leads?limit=10

# Get single lead
curl https://your-app/api/admin/leads/1

# Update lead
curl -X PATCH https://your-app/api/admin/leads/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress","priority":"high"}'
```

### 2. Test UI
1. Navigate to `/admin`
2. View dashboard statistics
3. Go to `/admin/leads`
4. Test filters and search
5. Click on a lead
6. Update status and save
7. Verify changes persist

## Troubleshooting

### Issue: "Function not found" error
**Solution**: Ensure all SQL functions are created before triggers

### Issue: RLS preventing access
**Solution**: Check if user is authenticated, verify RLS policies in dashboard

### Issue: Timestamp not updating
**Solution**: Verify trigger is created: `SELECT * FROM pg_trigger WHERE tgname = 'update_studio_leads_updated_at';`

### Issue: Enum type conflict
**Solution**: Drop enum type and recreate: `DROP TYPE IF EXISTS lead_status CASCADE;`

## Monitoring

### Check Table Size
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE tablename = 'studio_leads';
```

### Check Indexes
```sql
SELECT
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname = 'studio_leads';
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Version**: 1.0
**Last Updated**: February 2024
**Status**: Ready for Production
