import {
  getLessonsByCourseAuth,
  getLessonsByCourseNotAuth,
  findLessonById,
  insertLesson,
  modifyLesson,
  removeLesson
} from '../models/lesson.model.js';
import { findCourseById } from '../models/course.model.js';


const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;

  } catch (error) {
    return false;
  }
};

export const getLessonById = async (request, response) => {
  try {
    const { id } = request.params;
    const lesson = await findLessonById(id);

    if(!lesson) {
      return response.status(404).json({ error: 'Aula não encontrada.' });
    }
  
    return response.status(200).json(lesson);

  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: 'Erro ao buscar aula.' });
  }
}

export const listLessonsByCourse = async (request, response) => {
  try {
    const { courseId } = request.params;
    const userId = request.userId;
    
    const course = await findCourseById(courseId);
    if (!course) {
        return response.status(404).json({ error: 'Curso não encontrado.' });
    }

    let lessons;

    if(course.creator_id !== userId) {
      lessons = await getLessonsByCourseNotAuth(courseId);
    }
    else {
      lessons = await getLessonsByCourseAuth(courseId);
    }
    
    
    return response.status(200).json(lessons);

  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: 'Erro ao listar aulas.' });
  }
};


export const createLesson = async (request, response) => {
  try {
    const { title, video_url, status, course_id } = request.body;
    const userId = request.userId;

    
    if (!title || title.length < 3) {
      return response.status(400).json({ error: 'Título deve ter pelo menos 3 caracteres.' });
    }
    
    if (!['draft', 'published'].includes(status)) {
      return response.status(400).json({ error: 'Status deve ser draft ou published.' });
    }
    
    if(video_url && !isValidUrl(video_url)) {
      return response.status(400).json({ error: 'O link do vídeo informado não é uma URL válida.' });  
    }

    const course = await findCourseById(course_id);
    if (!course) {
      return response.status(404).json({ error: 'Curso não encontrado.' });
    }
    if (course.creator_id !== userId) {
      return response.status(403).json({ error: 'Só o criador do curso pode adicionar aulas.' });
    }

    const newLesson = await insertLesson({ title, video_url, status, course_id });
    return response.status(201).json(newLesson);

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao criar aula.' });
  }
};

export const updateLesson = async (request, response) => {
  try {
    const { id } = request.params;
    const { title, video_url, status } = request.body;
    const userId = request.userId;

    if(video_url && !isValidUrl(video_url)) {
      return response.status(400).json({ error: 'O link do vídeo informado não é uma URL válida.' });  
    }

    const lesson = await findLessonById(id);
    if (!lesson)  {
        return response.status(404).json({ error: 'Aula não encontrada.' });
    }

    const course = await findCourseById(lesson.course_id);
    if (course.creator_id !== userId) {
      return response.status(403).json({ error: 'Permissão negada para editar esta aula.' });
    }

    const updatedLesson = await modifyLesson(id, { title, video_url, status });
    return response.status(200).json(updatedLesson);

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao atualizar aula.' });
  }
};

export const deleteLesson = async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.userId;

    const lesson = await findLessonById(id);
    if (!lesson) return response.status(404).json({ error: 'Aula não encontrada.' });

    const course = await findCourseById(lesson.course_id);

    if (course.creator_id !== userId) {
      return response.status(403).json({ error: 'Permissão negada para eliminar esta aula.' });
    }

    await removeLesson(id);
    return response.status(204).send();

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao eliminar aula.' });
  }
};