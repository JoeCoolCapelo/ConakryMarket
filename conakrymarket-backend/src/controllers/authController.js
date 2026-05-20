const Client = require('../models/Client');
const { signToken } = require('../config/jwt');

exports.register = async (req, res, next) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;
    const existing = await Client.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });

    const uid = `C${Date.now()}`;
    const client = await Client.create({ uid, nom, email, mot_de_passe, role });
    
    const token = signToken({ uid: client.uid });
    
    // Remove password from user object before sending
    const user = client.toObject();
    delete user.mot_de_passe;

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;
    const client = await Client.findOne({ email });
    if (!client || !(await client.comparePassword(mot_de_passe))) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    const token = signToken({ uid: client.uid });
    
    // Remove password from user object before sending
    const user = client.toObject();
    delete user.mot_de_passe;

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { nom, telephone, ville, age, mot_de_passe } = req.body;
    const client = await Client.findOne({ uid: req.user.uid });
    if (!client) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (nom) client.nom = nom;
    if (telephone !== undefined) client.telephone = telephone;
    if (ville !== undefined) client.ville = ville;
    if (age !== undefined) client.age = age;
    if (mot_de_passe) client.mot_de_passe = mot_de_passe;

    if (req.file) {
      client.photo_profil = `http://localhost:5000/uploads/profiles/${req.file.filename}`;
    }

    await client.save();

    const user = client.toObject();
    delete user.mot_de_passe;

    res.json({ message: 'Profil mis à jour avec succès', user });
  } catch (error) {
    next(error);
  }
};

