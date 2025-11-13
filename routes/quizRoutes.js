import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getUserQuizHistory,
} from '../controllers/quizController.js';

const router = express.Router();

router.use(protect);

router.post('/', createQuiz);
router.get('/', getAllQuizzes);
router.get('/history', getUserQuizHistory);
router.get('/:id', getQuizById);
router.post('/submit', submitQuiz);

export default router;