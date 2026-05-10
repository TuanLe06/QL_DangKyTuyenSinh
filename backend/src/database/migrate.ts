import pool, { testConnection } from '../config/database';

const migrate = async (): Promise<void> => {
  await testConnection();

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role)
    )`,
    // Add more CREATE TABLE statements here as needed
  ];

  for (const query of queries) {
    await pool.execute(query);
    console.log('✅ Migration executed');
  }

  console.log('🎉 All migrations completed');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
