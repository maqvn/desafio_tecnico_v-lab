import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '../components/PageHeader';
import { CourseForm } from '../components/CourseForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../services/api';

export function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', description: '', startDate: '', endDate: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const response = await api.get(`/courses/${id}`);
        const course = response.data;

        setValues({
          name: course.name,
          description: course.description,
          startDate: course.start_date.split('T')[0],
          endDate: course.end_date.split('T')[0],
        });

      } catch (error) {
        toast.error('Erro ao buscar dados do curso.');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    loadCourse();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, description, startDate, endDate } = values;

    if (new Date(endDate) < new Date(startDate)) {
      return toast.warning('A data de término não pode ser menor que a de início.');
    }

    try {
      setIsSaving(true);

      await api.put(`/courses/${id}`, {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
      });

      toast.success('Curso atualizado com sucesso!');
      navigate(`/courses/${id}`);

    } catch (error) {
      const mensagem = error.response?.data?.error || 'Erro ao atualizar curso.';
      toast.error(mensagem);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Editar Curso" backTo={`/courses/${id}`} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <CourseForm
            values={values}
            onChange={setValues}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        </div>
      </main>
    </div>
  );
}