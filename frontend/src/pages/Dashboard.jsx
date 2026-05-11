import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../components/NavBar';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';

export function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('@CourseSphere:user');
    if (savedUser) setUser(JSON.parse(savedUser));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} />

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
        ) : courses.length === 0 ? (
          <EmptyState message="Nenhum curso encontrado." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} userId={user?.id} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}