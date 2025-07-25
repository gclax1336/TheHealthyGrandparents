const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, requireRole('owner', 'coach'), async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
});

router.patch('/:id/role', authenticate, requireRole('owner', 'coach'), async (req, res) => {
  const { role } = req.body;
  await userModel.updateUserRole(req.params.id, role);
  res.json({ success: true });
});

router.delete('/:id', authenticate, requireRole('owner', 'coach'), async (req, res) => {
  await userModel.deleteUser(req.params.id);
  res.json({ success: true });
});

module.exports = router;