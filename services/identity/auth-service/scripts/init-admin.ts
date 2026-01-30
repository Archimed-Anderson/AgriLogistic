import dotenv from 'dotenv';
import path from 'path';
import { Database } from '../src/config/database';
import { UserRepository } from '../src/repositories/user.repository';
import { PasswordService } from '../src/services/password.service';

// Load environment variables from .env file in the project root
// __dirname points to dist/scripts when compiled, or scripts/ when running with ts-node
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Debug: Show loaded DB_PASSWORD (first 3 chars only for security)
if (process.env.DB_PASSWORD) {
  console.log(`✅ DB_PASSWORD loaded: ${process.env.DB_PASSWORD.substring(0, 3)}...`);
} else {
  console.error('❌ DB_PASSWORD not found in environment variables');
  console.error(`💡 Looking for .env at: ${envPath}`);
}

/**
 * Initialize default admin user
 */
async function initAdmin() {
  try {
    console.log('🔐 Initializing admin user...');

    // Test database connection
    const dbConnected = await Database.testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    const userRepository = new UserRepository();
    const passwordService = new PasswordService();

    const adminEmail = process.env.ADMIN_EMAIL || 'admintest@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const adminRole = process.env.ADMIN_ROLE || 'admin';

    // Check if admin user already exists
    const existingUser = await userRepository.findByEmail(adminEmail);
    if (existingUser) {
      console.log(`✅ Admin user already exists: ${adminEmail}`);
      
      // Update password if needed
      if (adminPassword) {
        const passwordHash = await passwordService.hashPassword(adminPassword);
        await userRepository.updatePassword(existingUser.id, passwordHash);
        console.log('✅ Admin password updated');
      }
      
      // Ensure role is admin
      if (existingUser.role !== 'admin') {
        // Note: We can't update role directly, but we can log a warning
        console.warn(`⚠️  Warning: Existing user ${adminEmail} has role ${existingUser.role}, expected admin`);
      }
      
      process.exit(0);
    }

    // Create admin user
    if (!adminPassword) {
      console.error('❌ ADMIN_PASSWORD environment variable is required');
      process.exit(1);
    }

    const passwordHash = await passwordService.hashPassword(adminPassword);

    const adminUser = await userRepository.create({
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'AgroLogistic',
      role: adminRole as 'admin',
      passwordHash,
    });

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);

    // Close database connection
    await Database.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
    await Database.close();
    process.exit(1);
  }
}

// Run initialization
initAdmin();
