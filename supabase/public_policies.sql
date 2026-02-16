-- ============================================
-- PUBLIC READ ACCESS POLICIES
-- ============================================

-- Enable RLS on all public tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read policies for all public tables
CREATE POLICY "Public read access artists" ON artists 
FOR SELECT USING (true);

CREATE POLICY "Public read access songs" ON songs 
FOR SELECT USING (true);

CREATE POLICY "Public read access news" ON news 
FOR SELECT USING (true);

CREATE POLICY "Public read access events" ON events 
FOR SELECT USING (true);

CREATE POLICY "Public read access products" ON products 
FOR SELECT USING (true);

CREATE POLICY "Public read access categories" ON categories 
FOR SELECT USING (true);

-- ============================================
-- PROTECTED WRITE POLICIES (Authenticated Users Only)
-- ============================================

-- Artists table - only authenticated users can modify
CREATE POLICY "Authenticated users can insert artists" ON artists 
FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can update own artists" ON artists 
FOR UPDATE USING (auth.uid = created_by OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete artists" ON artists 
FOR DELETE USING (auth.role() = 'service_role');

-- Songs table - only authenticated users can modify
CREATE POLICY "Authenticated users can insert songs" ON songs 
FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can update own songs" ON songs 
FOR UPDATE USING (auth.uid = created_by OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete songs" ON songs 
FOR DELETE USING (auth.role() = 'service_role');

-- News table - only authenticated users can modify
CREATE POLICY "Authenticated users can insert news" ON news 
FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can update own news" ON news 
FOR UPDATE USING (auth.uid = created_by OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete news" ON news 
FOR DELETE USING (auth.role() = 'service_role');

-- Events table - only authenticated users can modify
CREATE POLICY "Authenticated users can insert events" ON events 
FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can update own events" ON events 
FOR UPDATE USING (auth.uid = created_by OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete events" ON events 
FOR DELETE USING (auth.role() = 'service_role');

-- Products table - only authenticated users can modify
CREATE POLICY "Authenticated users can insert products" ON products 
FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can update own products" ON products 
FOR UPDATE USING (auth.uid = created_by OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete products" ON products 
FOR DELETE USING (auth.role() = 'service_role');

-- Categories table - only authenticated users can modify
CREATE POLICY "Authenticated users can insert categories" ON categories 
FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Authenticated users can update categories" ON categories 
FOR UPDATE USING (auth.uid = created_by OR auth.role() = 'service_role');

CREATE POLICY "Admins can delete categories" ON categories 
FOR DELETE USING (auth.role() = 'service_role');
