import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '../components/PageHeader';
import { CourseForm } from '../components/CourseForm';
import api from '../services/api';

const EMPTY_FORM = { name: '', description: '', startDate: '', endDate: '' };

export function CreateCourse() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, description, startDate, endDate } = values;

    if (new Date(endDate) < new Date(startDate)) {
      return toast.warning('A data de término não pode ser anterior à data de início.');
    }

    try {
      setIsLoading(true);

      await api.post('/courses', {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
      });

      toast.success('Curso criado com sucesso!');
      navigate('/dashboard');

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Erro ao criar o curso.';
      toast.error(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Criar Novo Curso" backTo="/dashboard" />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <CourseForm
            values={values}
            onChange={setValues}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}