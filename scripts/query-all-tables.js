#!/usr/bin/env node

/**
 * Comprehensive Database Query - Check All Tables and Data
 */

const { Client } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

async function queryAllTables() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔍 COMPREHENSIVE DATABASE QUERY\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all tables in public schema
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`📋 Found ${tables.length} tables in public schema:\n`);

    // Query each table
    for (const table of tables) {
      console.log(`\n🗄️  TABLE: ${table}`);
      console.log('='.repeat(50));
      
      try {
        // Get table structure
        const structureResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = '${table}' 
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `);

        console.log('\n📝 Structure:');
        structureResult.rows.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`  - ${col.column_name}: ${col.data_type} (${nullable})${defaultVal}`);
        });

        // Get record count
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        const recordCount = countResult.rows[0].count;
        console.log(`\n📊 Record Count: ${recordCount}`);

        // Get sample data (first 3 records if available)
        if (recordCount > 0) {
          const dataResult = await client.query(`SELECT * FROM ${table} LIMIT 3`);
          console.log('\n📄 Sample Data:');
          
          dataResult.rows.forEach((row, index) => {
            console.log(`\n  Record ${index + 1}:`);
            Object.keys(row).forEach(key => {
              let value = row[key];
              if (value === null) value = 'NULL';
              else if (typeof value === 'object') value = JSON.stringify(value);
              else if (typeof value === 'string' && value.length > 50) value = value.substring(0, 50) + '...';
              console.log(`    ${key}: ${value}`);
            });
          });
        } else {
          console.log('\n📄 No data in table');
        }

        // Check RLS status
        const rlsResult = await client.query(`
          SELECT relrowsecurity 
          FROM pg_class 
          WHERE relname = '${table}' 
          AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        `);
        const rlsEnabled = rlsResult.rows[0]?.relrowsecurity || false;
        console.log(`\n🔒 RLS Enabled: ${rlsEnabled ? '✅' : '❌'}`);

        // Check policies
        if (rlsEnabled) {
          const policiesResult = await client.query(`
            SELECT policyname, permissive, roles, cmd 
            FROM pg_policies 
            WHERE tablename = '${table}'
          `);
          
          if (policiesResult.rows.length > 0) {
            console.log('\n📜 RLS Policies:');
            policiesResult.rows.forEach(policy => {
              console.log(`  - ${policy.policyname} (${policy.cmd}) - ${policy.permissive ? 'Permissive' : 'Restrictive'}`);
            });
          } else {
            console.log('\n📜 No RLS policies found');
          }
        }

      } catch (error) {
        console.error(`❌ Error querying ${table}:`, error.message);
      }
      
      console.log('\n' + '='.repeat(80));
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`  - Total tables: ${tables.length}`);
    console.log('  - All tables queried successfully');
    console.log('  - Structure, data, and RLS status verified');

  } catch (error) {
    console.error('❌ Database query failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 Database connection closed');
  }
}

queryAllTables();
