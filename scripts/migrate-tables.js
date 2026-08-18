const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*['"]?(.*?)['"]?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2];
      if (value.endsWith("'") || value.endsWith('"')) {
        value = value.slice(0, -1);
      }
      process.env[key] = value;
    }
  });
}

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  console.log("Connecting to PostgreSQL database...");
  const client = await pool.connect();
  try {
    console.log("Executing tables and order_tables DDL migration...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS tables (
        id SERIAL PRIMARY KEY,
        table_no VARCHAR(50) NOT NULL UNIQUE,
        capacity INT NOT NULL DEFAULT 4,
        status VARCHAR(50) DEFAULT 'available'
          CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
        location VARCHAR(100) DEFAULT 'Main Dining',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_tables_table_no ON tables(table_no);
      CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(status);

      CREATE TABLE IF NOT EXISTS order_tables (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES restaurant_orders(id) ON DELETE CASCADE,
        table_id INT REFERENCES tables(id) ON DELETE CASCADE,
        table_no VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_order_tables_order_id ON order_tables(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_tables_table_id ON order_tables(table_id);
    `);
    console.log("✓ DDL Migration successful! 'tables' and 'order_tables' created.");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
