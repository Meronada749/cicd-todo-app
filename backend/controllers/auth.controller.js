const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/keys');

// remove password from user object
const cleanUser = (user) => {
  const { password, ...cleanedUser } = user.toObject();
  return cleanedUser;
};

const AuthController = {
  loginUser: async (req, res) => {
    try {
      const { User } = req.app.locals.models;
      const email = req.body.email.toLowerCase();
      const password = req.body.password;

      // find user by email (Mongoose)
      const userDoc = await User.findOne({ email });

      if (!userDoc) {
        return res.status(404).json({
          message: "Ce compte n'existe pas !"
        });
      }

      // check password
      const validPassword = await bcrypt.compare(password, userDoc.password);
      if (!validPassword) {
        return res.status(400).json({
          message: 'Mauvais email ou mot de passe!'
        });
      }

      // generate JWT
      const token = jsonwebtoken.sign({}, JWT_SECRET, {
        subject: userDoc._id.toString(), // <-- IMPORTANT
        expiresIn: 60 * 60 * 24 * 30 * 6, // 6 months
        algorithm: 'RS256'
      });

      return res.status(200).json({ user: cleanUser(userDoc), token });
    } catch (error) {
      console.error('LOGIN USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = AuthController;
