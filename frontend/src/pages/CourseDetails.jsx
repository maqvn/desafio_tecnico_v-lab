import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../components/PageHeader';
import { LessonModal } from '../components/LessonModal';
import { LessonItem } from '../components/LessonItem';
import { EmptyState } from '../components/EmptyState';
import api from '../services/api';

const NEW_LESSON = { title: '', video_url: '', status: 'published' };

export function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [modalLesson, setModalLesson] = useState(null);

  const [guestInstructor, setGuestInstructor] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('@CourseSphere:user');
    if (savedUser) setUserId(JSON.parse(savedUser).id);
    loadData();
    fetchGuestInstructor();
  }, [id]);

  async function fetchGuestInstructor() {
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      setGuestInstructor(data.results[0]);
    } catch (error) {
      console.error('Erro ao buscar instrutor externo:', error);
    }
  }

  async function loadData() {
    try {
      setIsLoading(true);
      const [courseRes, lessonsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/lessons/course/${id}`)
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do curso.');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteCourse() {
    if (!confirm('Tem certeza que deseja excluir este curso e todas as suas aulas?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Curso excluído com sucesso.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao excluir curso.');
    }
  }

  async function handleSubmitLesson(e) {
    e.preventDefault();
    const isEditing = Boolean(modalLesson?.id);

    try {
      if (isEditing) {
        const response = await api.put(`/lessons/${modalLesson.id}`, {
          title: modalLesson.title,
          video_url: modalLesson.video_url,
          status: modalLesson.status,
        });
        setLessons(lessons.map(l => l.id === modalLesson.id ? response.data : l));
        toast.success('Aula atualizada!');
      } else {
        const response = await api.post('/lessons', {
          ...modalLesson,
          course_id: Number(id),
        });
        setLessons([...lessons, response.data]);
        toast.success('Aula adicionada!');
      }
      setModalLesson(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar aula.');
    }
  }

  async function handleDeleteLesson(lessonId) {
    if (!confirm('Excluir esta aula?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons(lessons.filter(l => l.id !== lessonId));
      toast.success('Aula removida.');
    } catch (error) {
      toast.error('Erro ao excluir aula.');
    }
  }

  function handleCloseModal() {
    setModalLesson(null);
  }

  if (isLoading) return <div className="p-10 text-center text-gray-500">Carregando conteúdo...</div>;

  const isOwner = course?.creator_id === userId;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader
        title={course?.name}
        backTo="/dashboard"
        actions={isOwner && (
          <>
            <Link to={`/courses/${id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Edit size={20} />
            </Link>
            <button onClick={handleDeleteCourse} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={20} />
            </button>
          </>
        )}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sobre o Curso</h2>
            <p className="text-gray-600 leading-relaxed">{course?.description}</p>
          </div>

          {guestInstructor && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                Palestrante Convidado
              </h2>
              <div className="flex flex-col items-center text-center">
                <img
                  src={guestInstructor.picture.large}
                  className="w-20 h-20 rounded-full mb-3 border-2 border-blue-50 shadow-sm"
                  alt="Instrutor"
                />
                <p className="font-bold text-gray-800">
                  {guestInstructor.name.first} {guestInstructor.name.last}
                </p>
                <p className="text-xs text-gray-500 italic">
                  Especialista Internacional ({guestInstructor.location.country})
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Aulas</h2>
            {isOwner && (
              <button
                onClick={() => setModalLesson(NEW_LESSON)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
              >
                <Plus size={18} /> Nova Aula
              </button>
            )}
          </div>

          <div className="space-y-4">
            {lessons.length === 0 ? (
              <EmptyState message="Este curso ainda não possui aulas." />
            ) : (
              lessons.map(lesson => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isOwner={isOwner}
                  onEdit={setModalLesson}
                  onDelete={handleDeleteLesson}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {modalLesson !== null && (
        <LessonModal
          lesson={modalLesson}
          onSubmit={handleSubmitLesson}
          onClose={handleCloseModal}         
          onChange={setModalLesson}
        />
      )}
    </div>
  );
}