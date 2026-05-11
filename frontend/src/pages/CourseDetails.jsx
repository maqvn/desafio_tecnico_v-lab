import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Play, Trash, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

export function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonStatus, setNewLessonStatus] = useState('published');
  const [editingLesson, setEditingLesson] = useState(null);
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
        console.error("Erro ao buscar instrutor externo:", error);
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

  async function handleAddLesson(e) {
    e.preventDefault();
    try {
      const response = await api.post('/lessons', {
        title: newLessonTitle,
        video_url: newLessonUrl,
        status: newLessonStatus,
        course_id: Number(id)
      });
      setLessons([...lessons, response.data]);
      setShowLessonForm(false);
      setNewLessonTitle('');
      setNewLessonUrl('');
      toast.success('Aula adicionada!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao adicionar aula.');
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

  async function handleUpdateLesson(e) {
    e.preventDefault();
    try {
      const response = await api.put(`/lessons/${editingLesson.id}`, {
        title: editingLesson.title,
        video_url: editingLesson.video_url,
        status: editingLesson.status
      });

      setLessons(lessons.map(l => l.id === editingLesson.id ? response.data : l));
      setEditingLesson(null); // Fecha o modal
      toast.success('Aula atualizada!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar aula.');
    }
  }

  if (isLoading) return <div className="p-10 text-center text-gray-500">Carregando conteúdo...</div>;

  const isOwner = course?.creator_id === userId;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 mb-8 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{course?.name}</h1>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/courses/${id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit size={20} />
              </Link>
              <button onClick={handleDeleteCourse} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sobre o Curso</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{course?.description}</p>
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
                onClick={() => setShowLessonForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
              >
                <Plus size={18} /> Nova Aula
              </button>
            )}
          </div>

          <div className="space-y-4">
            {lessons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                Este curso ainda não possui aulas.
              </div>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full shrink-0">
                      <Play size={18} fill="currentColor" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                        {lesson.status === 'draft' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <a href={lesson.video_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                        Assistir material <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* NOVO: Botão de Editar Aula */}
                      <button onClick={() => setEditingLesson(lesson)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Editar Aula">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Excluir Aula">
                        <Trash size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showLessonForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Adicionar Nova Aula</h2>
              <button onClick={() => setShowLessonForm(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <input 
                type="text" placeholder="Título da aula" required 
                value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="url" placeholder="URL do Vídeo (YouTube, etc)" required 
                value={newLessonUrl} onChange={e => setNewLessonUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={newLessonStatus} onChange={e => setNewLessonStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="published">Publicada</option>
                <option value="draft">Rascunho</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2">
                Salvar Aula
              </button>
            </form>
          </div>
        </div>
      )}

      {editingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Editar Aula</h2>
              <button onClick={() => setEditingLesson(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            <form onSubmit={handleUpdateLesson} className="space-y-4">
              <input 
                type="text" placeholder="Título da aula" required 
                value={editingLesson.title} 
                onChange={e => setEditingLesson({...editingLesson, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="url" placeholder="URL do Vídeo (YouTube, etc)" required 
                value={editingLesson.video_url} 
                onChange={e => setEditingLesson({...editingLesson, video_url: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={editingLesson.status} 
                onChange={e => setEditingLesson({...editingLesson, status: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="published">Publicada</option>
                <option value="draft">Rascunho</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}