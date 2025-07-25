const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Update these with your RDS credentials or use environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'thehealthygrandparent-db.cxkssu8mgrgw.us-east-2.rds.amazonaws.com',
  user: process.env.DB_USER || 'YOUR_DB_USER',
  password: process.env.DB_PASS || 'YOUR_DB_PASSWORD',
  database: process.env.DB_NAME || 'thehealthygrandparent',
});

module.exports = {
  async createUser(email, password, verificationToken, firstName, lastName, phone, address, city, state, zipCode) {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, verification_token, first_name, last_name, phone, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, password_hash, verificationToken, firstName, lastName, phone, address, city, state, zipCode]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async setVerified(email) {
    await pool.query('UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ?', [email]);
  },

  async findByVerificationToken(token) {
    const [rows] = await pool.query('SELECT * FROM users WHERE verification_token = ?', [token]);
    return rows[0];
  },

  async findByPhone(phone) {
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    return rows[0];
  },

  async createUserWithPhone(phone) {
    const [result] = await pool.query(
      'INSERT INTO users (phone) VALUES (?)',
      [phone]
    );
    return result.insertId;
  },

  async markUserAsPaid(phone) {
    await pool.query('UPDATE users SET has_paid = 1 WHERE phone = ?', [phone]);
  },
}; 