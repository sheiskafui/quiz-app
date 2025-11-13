import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./user.js";

const Quiz = sequelize.define("Quiz", {
  quiz_uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  createdBy: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'user_uuid',
    },
  },
}, {
  timestamps: true,
});

const Question = sequelize.define("Question", {
  question_uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.UUID,
    references: {
      model: Quiz,
      key: 'quiz_uuid',
    },
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  timestamps: true,
});

const QuizAttempt = sequelize.define("QuizAttempt", {
  attempt_uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'user_uuid',
    },
  },
  quizId: {
    type: DataTypes.UUID,
    references: {
      model: Quiz,
      key: 'quiz_uuid',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Quiz, { foreignKey: 'createdBy' });

QuizAttempt.belongsTo(User, { foreignKey: 'userId' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId' });
User.hasMany(QuizAttempt, { foreignKey: 'userId' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId' });

export { Quiz, Question, QuizAttempt };