const jwt = require('jsonwebtoken');

/**
 * Express Middleware to verify JWT token for Admin protected endpoints
 */
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is empty.'
    });
  }

  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_DB === 'true';
    const jwtSecret = process.env.JWT_SECRET || (!isProduction ? 'aetheria_secret_key_2026' : '');

    if (!jwtSecret) {
      console.error('[Auth Error] JWT_SECRET is not configured on server.');
      return res.status(500).json({
        success: false,
        message: 'Server authentication misconfigured.'
      });
    }

    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Admin privileges required.'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

module.exports = verifyAdmin;
