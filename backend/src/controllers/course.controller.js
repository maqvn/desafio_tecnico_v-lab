import {
  getAllCourses,
  findCourseById,
  insertCourse,
  modifyCourse,
  removeCourse
} from '../models/course.model.js';

export const listCourses = async (request, response) => {
  try {
    const { search } = request.query;
    const courses = await getAllCourses(search);
    return response.status(200).json(courses);

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao listar cursos.' });
  }
};

export const getCourseById = async (request, response) => {
  try {
    const { id } = request.params;
    const course = await findCourseById(id);

    if (!course) {
      return response.status(404).json({ error: 'Curso não encontrado.' });
    }
    return response.status(200).json(course);

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao buscar curso.' });
  }
};
    
export const createCourse = async (request, response) => {
  try {
    const { name, description, start_date, end_date } = request.body;
    const creatorId = request.userId;

    const hasInvalidName = !name || name.length < 3;
    const isMissingDates = !start_date || !end_date;

    if (isMissingDates) {
      return response.status(400).json({ error: 'Dados inválidos: Datas de início e fim são obrigatórias.' });
    }
    if(hasInvalidName) {
        return response.status(400).json({ error: 'Dados inválidos: Nome é obrigatório e deve ter ao menos 3 caracteres.' });
    }

    const startDateValue = new Date(start_date);
    const endDateValue = new Date(end_date);

    if (endDateValue < startDateValue) {
      return response.status(400).json({ error: 'Dados inválidos: A data de término não pode ser anterior à data de início.' });
    }

    const newCourse = await insertCourse({
      name,
      description,
      start_date,
      end_date,
      creator_id: creatorId
    });

    return response.status(201).json(newCourse);

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao criar curso.' });
  }
};

export const updateCourse = async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.userId;
    const updateData = request.body;

    const course = await findCourseById(id);

    if (!course) {
      return response.status(404).json({ error: 'Curso não encontrado.' });
    }

    const isNotCourseCreator = course.creator_id !== userId;
    if (isNotCourseCreator) {
      return response.status(403).json({ error: 'Apenas o criador pode editar este curso.' });
    }

    const updatedCourse = await modifyCourse(id, updateData);
    return response.status(200).json(updatedCourse);

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao atualizar curso.' });
  }
};

export const deleteCourse = async (request, response) => {
  try {
    const { id } = request.params;
    const userId = request.userId;

    const course = await findCourseById(id);

    if (!course) {
      return response.status(404).json({ error: 'Curso não encontrado.' });
    }

    const isNotCourseCreator = course.creator_id !== userId;

    if (isNotCourseCreator) {
      return response.status(403).json({ error: 'Apenas o criador pode excluir este curso.' });
    }

    await removeCourse(id);
    return response.status(204).send();

  } catch (error) {
    return response.status(500).json({ error: 'Erro ao excluir curso.' });
  }
};