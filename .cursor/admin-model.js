const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'thehealthygrandparent-db.cxkssu8mgrgw.us-east-2.rds.amazonaws.com',
  user: process.env.DB_USER || 'Pops',
  password: process.env.DB_PASSWORD || 'Grandparent#21',
  database: process.env.DB_NAME || 'thehealthygrandparent',
});

module.exports = {
  // Get all users with pagination
  async getAllUsers(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT id, phone, email, first_name, last_name, has_paid, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  },

  // Get total user count
  async getTotalUsers() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  },

  // Get paid users count
  async getPaidUsersCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM users WHERE has_paid = 1');
    return rows[0].total;
  },

  // Get users by date range
  async getUsersByDateRange(startDate, endDate) {
    const [rows] = await pool.query(
      'SELECT id, phone, email, first_name, last_name, has_paid, created_at FROM users WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC',
      [startDate, endDate]
    );
    return rows;
  },

  // Get daily signups for the last 30 days
  async getDailySignups(days = 30) {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as signups,
        SUM(CASE WHEN has_paid = 1 THEN 1 ELSE 0 END) as paid_users
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [days]);
    return rows;
  },

  // Get conversion rate (paid vs total users)
  async getConversionRate() {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN has_paid = 1 THEN 1 ELSE 0 END) as paid_users,
        ROUND((SUM(CASE WHEN has_paid = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as conversion_rate
      FROM users
    `);
    return rows[0];
  },

  // Get recent activity (last 7 days)
  async getRecentActivity() {
    const [rows] = await pool.query(`
      SELECT 
        'new_user' as activity_type,
        phone,
        created_at as timestamp,
        'User registered' as description
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      UNION ALL
      SELECT 
        'payment' as activity_type,
        phone,
        updated_at as timestamp,
        'User paid' as description
      FROM users 
      WHERE has_paid = 1 AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY timestamp DESC
      LIMIT 50
    `);
    return rows;
  },

  // Get user details by ID
  async getUserById(userId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  },

  // Update user payment status
  async updateUserPaymentStatus(userId, hasPaid) {
    await pool.query('UPDATE users SET has_paid = ?, updated_at = NOW() WHERE id = ?', [hasPaid, userId]);
  },

  // Get analytics summary
  async getAnalyticsSummary() {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN has_paid = 1 THEN 1 ELSE 0 END) as paid_users,
        SUM(CASE WHEN has_paid = 0 THEN 1 ELSE 0 END) as unpaid_users,
        ROUND((SUM(CASE WHEN has_paid = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as conversion_rate,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as new_users_today,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_users_this_week,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_this_month
      FROM users
    `);
    return rows[0];
  },

  // Search users
  async searchUsers(query) {
    const searchQuery = `%${query}%`;
    const [rows] = await pool.query(`
      SELECT id, phone, email, first_name, last_name, has_paid, created_at 
      FROM users 
      WHERE phone LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?
      ORDER BY created_at DESC
      LIMIT 50
    `, [searchQuery, searchQuery, searchQuery, searchQuery]);
    return rows;
  },

  // Get top performing days (most signups)
  async getTopPerformingDays(limit = 10) {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as signups,
        SUM(CASE WHEN has_paid = 1 THEN 1 ELSE 0 END) as paid_users
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
      GROUP BY DATE(created_at)
      ORDER BY signups DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }
}; 