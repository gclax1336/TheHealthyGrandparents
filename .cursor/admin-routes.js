const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminModel = require('./admin-model');

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Admin token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin (you can add admin field to users table)
    // For now, we'll use a simple admin check
    if (decoded.phone === process.env.ADMIN_PHONE || decoded.isAdmin) {
      req.admin = decoded;
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  const { phone, otp } = req.body;
  
  // For admin login, you might want to use a different verification method
  // For now, we'll use a simple admin check
  if (phone === process.env.ADMIN_PHONE && otp === process.env.ADMIN_OTP) {
    const token = jwt.sign({ 
      phone, 
      isAdmin: true 
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, isAdmin: true });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Get analytics summary
router.get('/analytics/summary', authenticateAdmin, async (req, res) => {
  try {
    const summary = await adminModel.getAnalyticsSummary();
    res.json(summary);
  } catch (err) {
    console.error('[Admin Analytics] Error:', err);
    res.status(500).json({ error: 'Failed to get analytics summary' });
  }
});

// Get all users with pagination
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const users = await adminModel.getAllUsers(page, limit);
    const total = await adminModel.getTotalUsers();
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[Admin Users] Error:', err);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Search users
router.get('/users/search', authenticateAdmin, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const users = await adminModel.searchUsers(q);
    res.json({ users });
  } catch (err) {
    console.error('[Admin Search] Error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get user details
router.get('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const user = await adminModel.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('[Admin User Details] Error:', err);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

// Update user payment status
router.put('/users/:userId/payment', authenticateAdmin, async (req, res) => {
  try {
    const { hasPaid } = req.body;
    await adminModel.updateUserPaymentStatus(req.params.userId, hasPaid);
    res.json({ message: 'User payment status updated' });
  } catch (err) {
    console.error('[Admin Update Payment] Error:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Get daily signups
router.get('/analytics/daily-signups', authenticateAdmin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const signups = await adminModel.getDailySignups(days);
    res.json({ signups });
  } catch (err) {
    console.error('[Admin Daily Signups] Error:', err);
    res.status(500).json({ error: 'Failed to get daily signups' });
  }
});

// Get conversion rate
router.get('/analytics/conversion-rate', authenticateAdmin, async (req, res) => {
  try {
    const conversion = await adminModel.getConversionRate();
    res.json(conversion);
  } catch (err) {
    console.error('[Admin Conversion Rate] Error:', err);
    res.status(500).json({ error: 'Failed to get conversion rate' });
  }
});

// Get recent activity
router.get('/analytics/recent-activity', authenticateAdmin, async (req, res) => {
  try {
    const activity = await adminModel.getRecentActivity();
    res.json({ activity });
  } catch (err) {
    console.error('[Admin Recent Activity] Error:', err);
    res.status(500).json({ error: 'Failed to get recent activity' });
  }
});

// Get top performing days
router.get('/analytics/top-days', authenticateAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topDays = await adminModel.getTopPerformingDays(limit);
    res.json({ topDays });
  } catch (err) {
    console.error('[Admin Top Days] Error:', err);
    res.status(500).json({ error: 'Failed to get top performing days' });
  }
});

// Get users by date range
router.get('/analytics/users-by-date', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date required' });
    }
    
    const users = await adminModel.getUsersByDateRange(startDate, endDate);
    res.json({ users });
  } catch (err) {
    console.error('[Admin Users By Date] Error:', err);
    res.status(500).json({ error: 'Failed to get users by date range' });
  }
});

// Export users data (CSV format)
router.get('/export/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await adminModel.getAllUsers(1, 10000); // Get all users
    
    const csvHeader = 'ID,Phone,Email,First Name,Last Name,Has Paid,Created At,Updated At\n';
    const csvData = users.map(user => 
      `${user.id},${user.phone || ''},${user.email || ''},${user.first_name || ''},${user.last_name || ''},${user.has_paid ? 'Yes' : 'No'},${user.created_at},${user.updated_at || ''}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
    res.send(csvHeader + csvData);
  } catch (err) {
    console.error('[Admin Export] Error:', err);
    res.status(500).json({ error: 'Failed to export users data' });
  }
});

module.exports = router; 