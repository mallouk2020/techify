#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const sqlPath = path.resolve(__dirname, 'add_password_protections.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('SQL file not found:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Please set DATABASE_URL in the environment before running this script.');
    process.exit(1);
  }

  // Safety: require explicit force flag to avoid accidental production runs
  if (process.env.FORCE_APPLY !== '1') {
    console.error('Safety check: set FORCE_APPLY=1 in the environment to actually apply the SQL (prevents accidental runs).');
    console.error('Example (PowerShell): $env:FORCE_APPLY = "1"; $env:DATABASE_URL = "<your db url>"; node apply_password_protections.js');
    process.exit(2);
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log('Connected to DB, starting transaction...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('SQL applied successfully.');
  } catch (err) {
    console.error('Error applying SQL, rolling back:', err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(3);
  } finally {
    await client.end();
  }
}

main();
