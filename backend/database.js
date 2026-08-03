const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  // Do not set `database` here. The database may not exist yet.
  // We'll switch to the database with `USE` after ensuring it exists.
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  let sysConnection;
  try {
    sysConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    await sysConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✓ Database '${process.env.DB_NAME}' verified or created`);
  } catch (error) {
    console.error('Unable to create or verify database:', error);
    throw error;
  } finally {
    if (sysConnection) {
      await sysConnection.end();
    }
  }

  const connection = await pool.getConnection();
  try {
    // Make sure the pool connection is using the target database.
    await connection.query(`USE \`${process.env.DB_NAME}\``);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ contacts table verified');
  } catch (error) {
    console.error('Unable to create contacts table:', error);
    throw error;
  } finally {
    connection.release();
  }
}

const databaseReady = initializeDatabase();
module.exports = { pool, databaseReady };
