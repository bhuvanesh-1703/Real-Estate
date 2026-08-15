const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Admin Login Controller
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const jwtSecret = process.env.JWT_SECRET || 'aetheria_secret_key_2026';

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and Password are required.'
      });
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Generate JWT valid for 7 days
    const token = jwt.sign(
      { role: 'admin', username: expectedUsername },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = { login };
