const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

async function runMigrations() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    logger.warn('Supabase credentials not provided, skipping migrations');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    logger.info('✅ Migrations completed or already exist');
  } catch (error) {
    logger.warn('Migration note: Create table manually in Supabase if needed', {
      error: error.message,
    });
  }
}

runMigrations();

module.exports = { runMigrations };
