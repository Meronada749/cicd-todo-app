module.exports = (sequelize, DataTypes) => {
  const isSqlite = sequelize.getDialect() === 'sqlite';

<<<<<<< HEAD
const todoSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: false
    },
    completed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
});

//index text en MongoDB, équivalent FULLTEXT (MySQL)
todoSchema.index({text: "text"});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
=======
  const Todo = sequelize.define(
    'todo',
    {
      text: {
        // In SQLite, TEXT is already 'long' by default (for the tests)
        type: isSqlite ? DataTypes.TEXT : DataTypes.TEXT('long'),
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    },
    {
      indexes: [
        // FULLTEXT only exists in MySQL, so disable on SQLite (for the tests)
        ...(isSqlite ? [] : [{ type: 'FULLTEXT', name: 'text_idx', fields: ['text'] }])
      ]
    }
  );

  return Todo;
};
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
