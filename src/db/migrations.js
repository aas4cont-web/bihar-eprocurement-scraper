// src/db/migrations.js
const { Pool } = require('pg');
const logger = require('../utils/logger');

async function runMigrations() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'bihar_tenders',
    user: process.env.DB_USER || 'scraper',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenders (
        id SERIAL PRIMARY KEY,
        tender_number VARCHAR(255) UNIQUE NOT NULL,
        reference_number VARCHAR(255),
        department VARCHAR(255),
        description TEXT,
        emd NUMERIC,
        tender_fee NUMERIC,
        processing_fee NUMERIC,
        publish_date DATE,
        submission_start DATE,
        submission_end DATE,
        opening_date DATE,
        fingerprint VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tender_number ON tenders(tender_number);
      CREATE INDEX IF NOT EXISTS idx_reference ON tenders(reference_number);
      CREATE INDEX IF NOT EXISTS idx_department ON tenders(department);
    `);
    
    logger.info('✅ Migrations completed');
    client.release();
  } catch (error) {
    logger.error('Migration failed', { error: error.message });
  } finally {
    await pool.end();
  }
}

runMigrations();
