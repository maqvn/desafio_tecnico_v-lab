import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

export function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const response = await api.get(`/courses/${id}`);
        const course = response.data;

        setName(course.name);
        setDescription(course.description);
        
        setStartDate(course.start_date.split('T')[0]);
        setEndDate(course.end_date.split('T')[0]);
        
      } catch (error) {
        toast.error('Erro ao buscar dados do curso.');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    loadCourse();
  }, [id, navigate]);

  // 2. Função para salvar as alterações
  async function handleUpdateCourse(e) {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      return toast.warning('A data de término não pode ser menor que a de início.');
    }

    try {
      setIsSaving(true);

      await api.put(`/courses/${id}`, {
        name,
        description,
        start_date: startDate,
        end_date: endDate
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to={`/courses/${id}`} className="p-2 hover:bg-blue-50 rounded-full text-gray-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Editar Curso</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6">
        <div className="bg-white p-8 rounded-xl bor'de'r border-gray-200 shadow-sm">
          <form onSubmit={handleUpdateCourse} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:bg-blue-400"
              >
                <Save size={20} />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}