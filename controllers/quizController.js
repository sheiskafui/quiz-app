import { Quiz, Question, QuizAttempt } from '../models/quiz.js';
import User from '../models/user.js';

export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions } = req.body;
    
    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      createdBy: req.user.user_uuid,
    });

    if (questions && questions.length > 0) {
      const questionsData = questions.map(q => ({
        ...q,
        quizId: quiz.quiz_uuid,
      }));
      await Question.bulkCreate(questionsData);
    }

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['email'] },
        { model: Question, as: 'questions', attributes: ['question_uuid', 'questionText', 'points'] }
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['email'] },
        { model: Question, as: 'questions', attributes: ['question_uuid', 'questionText', 'options', 'points'] }
      ],
    });
    
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    
    const questions = await Question.findAll({ where: { quizId } });
    if (questions.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    questions.forEach(q => {
      if (answers[q.question_uuid] === q.correctAnswer) {
        score += q.points;
      }
    });

    const attempt = await QuizAttempt.create({
      userId: req.user.user_uuid,
      quizId,
      score,
      totalQuestions: questions.length,
      answers,
    });

    res.json({ 
      message: 'Quiz submitted successfully', 
      score, 
      totalQuestions: questions.length,
      attempt 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const getUserQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { userId: req.user.user_uuid },
      include: [{ model: Quiz, attributes: ['title', 'category'] }],
      order: [['completedAt', 'DESC']],
    });
    res.json(attempts);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};