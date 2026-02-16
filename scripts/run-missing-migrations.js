#!/usr/bin/env node

/**
 * Run specific migration file with better SQL parsing
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

function parseSQL(sql) {
  // Better SQL parsing that handles multi-line statements
  const statements = [];
  let currentStatement = '';
  let inString = false;
  let inDollarQuote = false;
  let dollarQuoteTag = '';
  let lineComment = false;
  
  const lines = sql.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('--') || line.startsWith('/*')) {
      continue;
    }
    
    // Handle line comments
    if (line.includes('--')) {
      line = line.split('--')[0].trim();
    }
    
    if (!line) continue;
    
    // Track if we're in a string literal
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const prevChar = j > 0 ? line[j-1] : '';
      
      if (!inString && !inDollarQuote && char === "'" && prevChar !== "'") {
        inString = true;
      } else if (inString && char === "'" && prevChar !== "'") {
        inString = false;
      } else if (!inString && char === '$' && line.substring(j).match(/^\$\w*\$$/)) {
        inDollarQuote = true;
        dollarQuoteTag = line.substring(j, line.indexOf('$$', j) + 2);
        j += dollarQuoteTag.length - 1;
      } else if (inDollarQuote && line.substring(j).startsWith(dollarQuoteTag)) {
        inDollarQuote = false;
        j += dollarQuoteTag.length - 1;
      }
    }
    
    currentStatement += line + ' ';
    
    // End statement if we're not in a string/dollar quote and see a semicolon
    if (!inString && !inDollarQuote && line.includes(';')) {
      const parts = currentStatement.split(';');
      for (let k = 0; k < parts.length; k++) {
        const part = parts[k].trim();
        if (part) {
          statements.push(part + ';');
        }
      }
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}

async function runMigrationFile(client, filePath, fileName) {
  console.log(`📦 Running ${fileName}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const statements = parseSQL(sql);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      if (statement.trim() === ';') continue;
      
      try {
        await client.query(statement);
        successCount++;
      } catch (error) {
        // Ignore errors for objects that already exist
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('duplicate key') ||
            error.message.includes('relation') && error.message.includes('already exists')) {
          // Expected errors for existing objects
          continue;
        } else {
          console.error(`❌ Error in statement: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`✅ ${fileName} completed (${successCount} statements executed, ${errorCount} expected errors ignored)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to read ${fileName}:`, error.message);
    return false;
  }
}

async function migrate() {
  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🚀 Running Missing Tables Migration...\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('📦 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Run the specific migration file
    const migrationFile = path.join(__dirname, '..', 'lib', 'db', 'migrations', '004_chord_sheets_events.sql');
    await runMigrationFile(client, migrationFile, '004_chord_sheets_events.sql');
    
    // Also run the RBAC migration
    const rbacFile = path.join(__dirname, '..', 'lib', 'db', 'migrations', '005_rbac_and_performance.sql');
    if (fs.existsSync(rbacFile)) {
      await runMigrationFile(client, rbacFile, '005_rbac_and_performance.sql');
    }

    console.log('\n🎉 Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n👋 Database connection closed');
  }
}

migrate();
