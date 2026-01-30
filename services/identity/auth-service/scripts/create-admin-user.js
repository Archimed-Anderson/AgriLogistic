/**
 * Script to create an admin user with proper password hashing
 */

const bcrypt = require('bcrypt');
const { Client } = require('pg');

const ADMIN_EMAIL = 'admintest@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const SALT_ROUNDS = 10;

async function createAdminUser() {
  // Database connection
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433, // Port of auth-db
    database: process.env.DB_NAME || 'AgriLogistic_auth',
    user: process.env.DB_USER || 'AgriLogistic',
    password: process.env.DB_PASSWORD || 'AgriLogistic123',
  });

  try {
    await client.connect();
    console.log('âœ… Connected to database');

    // Generate password hash
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    console.log(`ðŸ” Password hash generated for: ${ADMIN_PASSWORD}`);
    console.log(`Hash: ${passwordHash}`);

    // Delete existing admin if exists
    await client.query('DELETE FROM users WHERE email = $1', [ADMIN_EMAIL]);
    console.log(`ðŸ—‘ï¸  Deleted existing user: ${ADMIN_EMAIL}`);

    // Create admin user
    const result = await client.query(
      `INSERT INTO users (
        id, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        role, 
        email_verified,
        created_at, 
        updated_at
      ) VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        NOW(),
        NOW()
      )
      RETURNING id, email, first_name, last_name, role, email_verified`,
      [ADMIN_EMAIL, passwordHash, 'Admin', 'Test', 'admin', true]
    );

    console.log('âœ… Admin user created successfully:');
    console.log(result.rows[0]);

    // Verify login
    const user = await client.query(
      'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (user.rows.length > 0) {
      const isPasswordValid = await bcrypt.compare(ADMIN_PASSWORD, user.rows[0].password_hash);
      console.log(`ðŸ”‘ Password verification: ${isPasswordValid ? 'âœ… VALID' : 'âŒ INVALID'}`);
    }

  } catch (error) {
    console.error('âŒ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nâœ… Script completed!');
    console.log(`\nYou can now login with:`);
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
  }
}

createAdminUser();

