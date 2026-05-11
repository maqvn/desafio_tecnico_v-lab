import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../components/NavBar';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="w-20 h-6 bg-gray-200 rounded" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      <Navbar userName={user?.name} />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={20} className="text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Plataforma</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Todos os Cursos</h2>
            <p className="text-gray-500 mt-1">Explore, gerencie e crie novos cursos</p>
          </div>
          <Link
            to="/courses/new"
            id="btn-new-course"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Novo Curso
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-8 max-w-md">
          <input
            type="text"
            id="search-courses"
            placeholder="Buscar por nome do curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm text-sm"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        </form>

        {/* Course grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
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