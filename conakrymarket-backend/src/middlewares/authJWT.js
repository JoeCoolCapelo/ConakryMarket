const { verifyToken } = require('../config/jwt');
const Client = require('../models/Client');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Non autorisé' });

  try {
    const decoded = verifyToken(token);
    req.user = await Client.findOne({ uid: decoded.uid }).select('-mot_de_passe');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès interdit pour ce rôle' });
    }
    next();
  };
};
