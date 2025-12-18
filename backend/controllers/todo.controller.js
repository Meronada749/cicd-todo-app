const mongoose = require('mongoose');

const cleanTodo = (todo) => {
  // Convert Mongoose document to plain object if needed
  const obj = todo.toObject ? todo.toObject() : { ...todo };

  return {
    id: obj._id.toString(),
    text: obj.text,
    date: obj.date,
    completed: obj.completed
  };
};

const TodoController = {
  createTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { text, date } = req.body;
      const { Todo } = req.app.locals.models;

      const todo = await Todo.create({
        text: text,
        date: date,
        completed: false,
        user_id: user_id
      });
      return res.status(201).json(todo);
    } catch (error) {
      console.error('ADD TODO: ', error);
      return res.sendStatus(500);
    }
  },
  getAllTodo: async (req, res) => {
    const user_id = req.sub;
    const { Todo } = req.app.locals.models;

    await Todo.findAll({
      where: { user_id: user_id },
      order: [['date', 'ASC']],
      attributes: { exclude: ['user_id'] }
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('GET ALL TODO: ', error);
        return res.status(500);
      });
  },
  editTodo: async (req, res) => {
    const user_id = req.sub;
    const query = { id: req.params.id, user_id: user_id };
    const data = req.body;
    const { Todo } = req.app.locals.models;

      // // Vérification ObjectId
      // if (!mongoose.Types.ObjectId.isValid(todo_id)) {
      //   return res.status(400).json({ message: 'ID invalide, update impossible' });
      // }

      const todo = await Todo.findOne({ _id: todo_id, user_id });
      if (!todo) return res.sendStatus(404);

      todo.completed = data.completed ?? todo.completed;
      todo.text = data.text ?? todo.text;
      todo.date = data.date ?? todo.date;

      await todo.save();
      return res.status(200).json(todo);
    } catch (error) {
      console.error('UPDATE TODO: ', error);
      return res.sendStatus(500);
    }
  },
  deleteTodo: (req, res) => {
    const user_id = req.sub;
    const todo_id = req.params.id;
    const query = { id: todo_id, user_id: user_id };
    const { Todo } = req.app.locals.models;

      // ✅ Vérifier si l'ID est un ObjectId MongoDB valide
      if (!mongoose.Types.ObjectId.isValid(todo_id)) {
        return res.status(400).json({ message: 'ID invalide' });
      }

      const result = await Todo.deleteOne({ _id: todo_id, user_id });
      if (result.deletedCount === 0) return res.sendStatus(404);

      return res.status(200).json({ id: todo_id });
    } catch (error) {
      console.error('DELETE TODO: ', error);
      return res.sendStatus(500);
    }
  },

  getSearchTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const query = req.query.q;
      const { Todo } = req.app.locals.models;

      const todos = await Todo.find({
        user_id,
        $text: { $search: query }
      })
      .catch((error) => {
        console.error('DELETE TODO: ', error);
        return res.status(500);
      });
  },
  getSearchTodo: async (req, res) => {
    const user_id = req.sub;
    const query = req.query.q;
    const { Todo } = req.app.locals.models;

    await Todo.findAll({
      where: [
        {
          user_id: user_id
        },
        Sequelize.literal(`MATCH (text) AGAINST ('*${query}*' IN BOOLEAN MODE)`)
      ],
      order: [['date', 'ASC']],
      attributes: { exclude: ['user_id'] }
    })
      .then((result) => {
        if (result) {
          return res.status(200).json(result);
        } else {
          return res.status(404);
        }
      })
      .catch((error) => {
        console.error('SEARCH TODO: ', error);
        return res.status(500);
      });
  }
};

module.exports = TodoController;
