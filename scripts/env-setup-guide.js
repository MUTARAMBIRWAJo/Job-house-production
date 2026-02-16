#!/usr/bin/env node

/**
 * Environment Setup Guide for JOB HOUSE PRODUCTION
 */

console.log('🔧 ENVIRONMENT FILE SETUP GUIDE\n');

console.log('✅ .env file created successfully!');
console.log('📁 Location: c:/Users/Joseph/Music/Job project/Job House Production/.env\n');

console.log('🔑 REQUIRED ENVIRONMENT VARIABLES:');
console.log('=====================================');

console.log('\n📋 Supabase Configuration:');
console.log('  1. NEXT_PUBLIC_SUPABASE_URL');
console.log('     - Your Supabase project URL');
console.log('     - Format: https://[project-ref].supabase.co');
console.log('     - Get from: Supabase Dashboard → Settings → API');

console.log('\n  2. NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('     - Public anonymous key for client-side access');
console.log('     - Get from: Supabase Dashboard → Settings → API');
console.log('     - Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

console.log('\n  3. SUPABASE_SERVICE_ROLE_KEY');
console.log('     - Service role key for server-side operations');
console.log('     - Get from: Supabase Dashboard → Settings → API');
console.log('     - Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

console.log('\n  4. DATABASE_URL');
console.log('     - PostgreSQL connection string');
console.log('     - Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres');
console.log('     - Get from: Supabase Dashboard → Settings → Database → Connection string');

console.log('\n🔧 SETUP STEPS:');
console.log('=====================================');

console.log('\n1️⃣ Open your Supabase Dashboard');
console.log('   - Go to https://supabase.com/dashboard');
console.log('   - Select your project');

console.log('\n2️⃣ Get API Keys:');
console.log('   - Navigate to Settings → API');
console.log('   - Copy the Project URL');
console.log('   - Copy the anon key');
console.log('   - Copy the service_role key');

console.log('\n3️⃣ Get Database URL:');
console.log('   - Navigate to Settings → Database');
console.log('   - Copy the Connection string');
console.log('   - Replace [password] with your actual database password');

console.log('\n4️⃣ Update .env file:');
console.log('   - Replace placeholder values with actual keys');
console.log('   - Save the file');

console.log('\n5️⃣ Restart development server:');
console.log('   - npm run dev');
console.log('   - The server will pick up the new environment variables');

console.log('\n🚀 OPTIONAL VARIABLES:');
console.log('=====================================');

console.log('\n📱 Contact Information:');
console.log('  NEXT_PUBLIC_STUDIO_PHONE=+250788123456');
console.log('  NEXT_PUBLIC_STUDIO_EMAIL=studio@jobhouseproduction.com');
console.log('  NEXT_PUBLIC_STUDIO_WHATSAPP=+250788123456');

console.log('\n🎯 Application Configuration:');
console.log('  NODE_ENV=development');
console.log('  NEXT_PUBLIC_APP_NAME=JOB HOUSE PRODUCTION');
console.log('  NEXT_PUBLIC_APP_DESCRIPTION=Gospel Music Platform');

console.log('\n⚠️ SECURITY NOTES:');
console.log('=====================================');

console.log('\n🔒 Never commit .env file to version control!');
console.log('  - Add .env to .gitignore');
console.log('  - Use .env.example for template');

console.log('\n🔐 Keep service role key secure!');
console.log('  - Only used server-side');
console.log('  - Never expose in client code');

console.log('\n🌐 Anon key is safe for client use');
console.log('  - Limited permissions by RLS policies');
console.log('  - Can be exposed in browser');

console.log('\n✅ ENVIRONMENT SETUP COMPLETE!');
console.log('\n💡 Next Steps:');
console.log('  1. Fill in the actual Supabase values');
console.log('  2. Restart the development server');
console.log('  3. Test the application with real database connection');
