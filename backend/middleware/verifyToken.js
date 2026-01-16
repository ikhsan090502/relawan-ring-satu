const jwt = require('jsonwebtoken');

/**
 * AUTHENTICATE TOKEN (JWT)
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Format: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access token diperlukan'
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Token tidak valid atau sudah kedaluwarsa'
      });
    }

    // decoded = payload dari jwt.sign()
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };

    next();
  });
};

/**
 * AUTHORIZE ROLES
 * contoh: authorizeRoles('Admin/Dispatcher')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Anda tidak memiliki izin'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
