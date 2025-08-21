// Migration script to update database schema
// Run this script to migrate from roundDuration to fightTime

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { timerSessions } from './shared/schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/jits_timer';

async function migrateSchema() {
  console.log('Starting schema migration...');
  
  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Add fightTime column if it doesn't exist
    await client`
      ALTER TABLE timer_sessions 
      ADD COLUMN IF NOT EXISTS fight_time INTEGER DEFAULT 360
    `;

    // Add isFinished column if it doesn't exist
    await client`
      ALTER TABLE timer_sessions 
      ADD COLUMN IF NOT EXISTS is_finished BOOLEAN DEFAULT FALSE
    `;

    // Migrate existing data: convert roundDuration to fightTime
    await client`
      UPDATE timer_sessions 
      SET fight_time = round_duration * 60 
      WHERE fight_time = 360 AND round_duration IS NOT NULL
    `;

    // Drop the old roundDuration column (optional - comment out if you want to keep it)
    // await client`ALTER TABLE timer_sessions DROP COLUMN IF EXISTS round_duration`;

    console.log('Schema migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrateSchema().catch(console.error);
