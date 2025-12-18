const { DataTypes } = require('sequelize');

<<<<<<< HEAD
module.exports = { User, Todo };

=======
const UserModel = require('./user.model');
const TodoModel = require('./todo.model');

function initModels(sequelize) {
  const User = UserModel(sequelize, DataTypes);
  const Todo = TodoModel(sequelize, DataTypes);

  return { User, Todo };
}

module.exports = { initModels };
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
