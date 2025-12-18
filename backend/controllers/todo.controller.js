const cleanTodo = (todo) => {
  // Convert Mongoose document to plain object if needed
  const obj = todo.toObject ? todo.toObject() : { ...todo };

  // Replace _id with id as string
  obj.id = obj._id.toString();
  delete obj._id;

  // Convert user_id to string
  if (obj.user_id && typeof obj.user_id.toString === 'function') {
    obj.user_id = obj.user_id.toString();
  }

  return obj;
};

const TodoController = {
  createTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { text, date } = req.body;
      const { Todo } = req.app.locals.models;

      const todo = await Todo.create({
        text,
        date,
        completed: false,
        user_id
      });

      return res.status(201).json(todo);
    } catch (error) {
      console.error('ADD TODO: ', error);
      return res.sendStatus(500);
    }
  },
  getAllTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { Todo } = req.app.locals.models;

      const todos = await Todo.find({ user_id }).sort({ date: 1 }).select('-user_id -__v');
      console.log("todos", todos.map(t => cleanTodo(t)));
      if (todos) return res.status(200).json(todos.map(t => cleanTodo(t)));
      else return res.sendStatus(404);
    } catch (error) {
      console.error('GET ALL TODO: ', error);
      return res.sendStatus(500);
    }
  },
  editTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;
      const data = req.body;
      const { Todo } = req.app.locals.models;

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
  deleteTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;
      const { Todo } = req.app.locals.models;

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
        .sort({ date: 1 })
        .select('-user_id');

      if (todos.length > 0) return res.status(200).json(todos);
      else return res.sendStatus(404);
    } catch (error) {
      console.error('SEARCH TODO: ', error);
      return res.sendStatus(500);
    }
  }
};

module.exports = TodoController;
