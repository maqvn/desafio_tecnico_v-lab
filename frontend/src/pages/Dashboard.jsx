import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Search, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

export function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('@CourseSphere:user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchCourses();
  }, []);

  async function fetchCourses(searchTerm = '') {
    try {
      setIsLoading(true);
      const response = await api.get('/courses', {
        params: { search: searchTerm }
      });
      setCourses(response.data);
      
    } catch (error) {
      toast.error('Erro ao carregar cursos.');

    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchCourses(search);
  }

  function handleLogout() {
    localStorage.removeItem('@CourseSphere:token');
    localStorage.removeItem('@CourseSphere:user');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CourseSphere</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              Olá, <span className="font-semibold">{user?.name}</span>
            </span>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Meus Cursos</h2>
            <p className="text-gray-500">Gerencie seus cursos e conteúdos</p>
          </div>

          <Link 
            to="/courses/new"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={20} />
            Novo Curso
          </Link>
        </div>

        <form onSubmit={handleSearch} className="relative mb-8 max-w-md">
          <input 
            type="text"
            placeholder="Buscar por nome do curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
        </form>

        {isLoading ? (
          <div className="flex justify-center py-20 text-gray-400">Carregando cursos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div 
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    ID: #{course.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {course.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {course.description || 'Sem descrição disponível.'}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(course.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>até</span>
                    <span>{new Date(course.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum curso encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}