const bcrypt = require('bcrypt');

const cleanUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.get({ plain: true });
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    const { User } = req.app.locals.models;

    await User.create({
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 8)
    })
      .then((result) => {
        return res.status(201).json({ user: cleanUser(result) });
      })
      .catch((error) => {
        console.error('ADD USER: ', error);
        let errorMsg = "Erreur lors de l'inscription !";
        if (error && error.name === 'SequelizeUniqueConstraintError') {
          errorMsg = 'Un compte avec cet email exist déjà !';
        }
        return res.status(409).json({ message: errorMsg });
      });
<<<<<<< HEAD

      return res.status(201).json({ user: cleanUser(user) });
    } catch (error) {
      console.error("ADD USER:", error.code);

      let errorMsg = "Erreur lors de l'inscription !";

      if (error.code === 11000) {
        errorMsg = "Un compte avec cet email existe déjà !";
      }

      return res.status(409).json({ message: errorMsg });
    }
=======
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
  },
  getUser: async (req, res) => {
    const user_id = req.sub;
    const { User } = req.app.locals.models;

<<<<<<< HEAD
      const user = await User.findById(user_id).select("-password -__v");

      if (!user) return res.sendStatus(404);

      return res.status(200).json({ user });
    } catch (error) {
      console.error("GET USER:", error);
      return res.sendStatus(500);
    }
=======
    await User.findOne({
      where: { id: user_id },
      attributes: { exclude: ['id', 'password'] }
    })
      .then((result) => {
        if (result) {
          return res.status(200).json({ user: result });
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('GET USER: ', error);
        return res.status(500);
      });
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
  },
  editUser: async (req, res) => {
    const user_id = req.sub;
    const query = { id: user_id };
    const data = req.body;
    const { User } = req.app.locals.models;

<<<<<<< HEAD
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
      console.error("UPDATE USER:", error);
      return res.sendStatus(500);
=======
    const user = await User.findOne({ where: query });
    if (user) {
      user.name = data.name ? data.name : null;
      user.address = data.address ? data.address : null;
      user.zip = data.zip ? data.zip : null;
      user.location = data.location ? data.location : null;
      await user
        .save()
        .then((result) => {
          return res.status(200).json({ user: cleanUser(result) });
        })
        .catch((error) => {
          console.error('UPDATE USER: ', error);
          return res.status(500);
        });
    } else {
      return res.status(404);
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
    }
  },
  deleteCurrentUser: (req, res) => {
    const user_id = req.sub;
    const query = { id: user_id };
    const { User } = req.app.locals.models;

<<<<<<< HEAD
  deleteCurrentUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const { User } = req.app.locals.models;

      const result = await User.findByIdAndDelete(user_id);

      if (!result) return res.sendStatus(404);

      return res.status(200).json({ id: user_id });
    } catch (error) {
      console.error("DELETE USER:", error);
      return res.sendStatus(500);
    }
=======
    User.destroy({
      where: query
    })
      .then(() => {
        return res.status(200).json({ id: user_id });
      })
      .catch((error) => {
        console.error('DELETE USER: ', error);
        return res.status(500);
      });
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
  }
};

module.exports = UserController;
