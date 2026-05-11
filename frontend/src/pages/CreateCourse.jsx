import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

export function CreateCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCreateCourse(e) {
    e.preventDefault();

    if (!name || !description || !startDate || !endDate) {
      return toast.warning('Preencha todos os campos do curso.');
    }

    if (new Date(endDate) < new Date(startDate)) {
      return toast.warning('A data de término não pode ser anterior à data de início.');
    }

    try {
      setIsLoading(true);

      await api.post('/courses', {
        name,
        description,
        start_date: startDate,
        end_date: endDate
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
      <nav className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Criar Novo Curso</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <form onSubmit={handleCreateCourse} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Curso
              </label>
              <input
                type="text"
                placeholder="Ex: Introdução à Lógica"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                placeholder="Sobre o que é este curso?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Término
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {isLoading ? 'Salvando...' : 'Salvar Curso'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}