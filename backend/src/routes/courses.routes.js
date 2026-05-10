import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/course.controller.js';

const courseRoutes = Router();

courseRoutes.use(requireAuth);

courseRoutes.get('/', listCourses);
courseRoutes.get('/:id', getCourseById);
courseRoutes.post('/', createCourse);
courseRoutes.put('/:id', updateCourse);
courseRoutes.delete('/:id', deleteCourse);

export default courseRoutes;  