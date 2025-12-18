const bcrypt = require('bcrypt');

const cleanUser = (user) => {
  const { password, ...cleanedUser } = user.toObject();
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { User } = req.app.locals.models;

      const user = await User.create({
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 8)
      });

      return res.status(201).json({ user: cleanUser(user) });
    } catch (error) {
      console.error('ADD USER:', error.code);

      let errorMsg = "Erreur lors de l'inscription !";

      if (error.code === 11000) {
        errorMsg = 'Un compte avec cet email existe déjà !';
      }

      return res.status(409).json({ message: errorMsg });
    }
  },

  getUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const { User } = req.app.locals.models;

      const user = await User.findById(user_id).select('-password -__v');

      if (!user) return res.sendStatus(404);

      return res.status(200).json({ user });
    } catch (error) {
      console.error('GET USER:', error);
      return res.sendStatus(500);
    }
  },

  editUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const data = req.body;
      const { User } = req.app.locals.models;

      // Equivalent findOne
      const user = await User.findById(user_id);
      if (!user) return res.sendStatus(404);

      user.name = data.name ?? null;
      user.address = data.address ?? null;
      user.zip = data.zip ?? null;
      user.location = data.location ?? null;

      await user.save();

      return res.status(200).json({ user: cleanUser(user) });
    } catch (error) {
      console.error('UPDATE USER:', error);
      return res.sendStatus(500);
    }
  },

  deleteCurrentUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const { User } = req.app.locals.models;

      const result = await User.findByIdAndDelete(user_id);

      if (!result) return res.sendStatus(404);

      return res.status(200).json({ id: user_id });
    } catch (error) {
      console.error('DELETE USER:', error);
      return res.sendStatus(500);
    }
  }
};

module.exports = UserController;
