import bcrypt from 'bcryptjs';
import pool, { testConnection } from '../config/database';

const seed = async (): Promise<void> => {
  await testConnection();

  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  await pool.execute(
    `INSERT IGNORE INTO users (name, email, password, role) VALUES
     ('Admin User', 'admin@example.com', ?, 'admin'),
     ('Regular User', 'user@example.com', ?, 'user')`,
    [adminPassword, userPassword]
  );

  console.log('🌱 Seed data inserted');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User:  user@example.com / user123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
