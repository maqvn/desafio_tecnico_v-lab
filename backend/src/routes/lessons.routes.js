import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
  listLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById
} from '../controllers/lesson.controller.js';

const lessonRoutes = Router();

lessonRoutes.use(requireAuth);

lessonRoutes.get('/:id', getLessonById);
lessonRoutes.get('/course/:courseId', listLessonsByCourse);
lessonRoutes.post('/', createLesson);
lessonRoutes.put('/:id', updateLesson);
lessonRoutes.delete('/:id', deleteLesson);

export default lessonRoutes;