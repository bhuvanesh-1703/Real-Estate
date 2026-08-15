const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Admin Login Controller
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_DB === 'true';
    const expectedUsername = process.env.ADMIN_USERNAME || (!isProduction ? 'admin' : '');
    const expectedPassword = process.env.ADMIN_PASSWORD || (!isProduction ? 'admin123' : '');
    const jwtSecret = process.env.JWT_SECRET || (!isProduction ? 'aetheria_secret_key_2026' : '');

    if (!jwtSecret || !expectedUsername || !expectedPassword) {
      console.error('[Auth Error] Missing required admin credentials or JWT secret in configuration.');
      return res.status(500).json({
        success: false,
        message: 'Authentication system misconfigured on server.'
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and Password are required.'
      });
    }

    if (username.trim() !== expectedUsername || password !== expectedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Generate JWT valid for 7 days with role claim
    const token = jwt.sign(
      { role: 'admin', username: expectedUsername },
      jwtSecret,
      { expiresIn: '7d', algorithm: 'HS256' }
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
