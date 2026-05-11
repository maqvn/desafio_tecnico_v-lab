import { X } from 'lucide-react';

export function LessonModal({ lesson, onSubmit, onClose, onChange }) {
  const isEditing = Boolean(lesson?.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isEditing ? 'Editar Aula' : 'Adicionar Nova Aula'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título da aula"
            required
            value={lesson?.title ?? ''}
            onChange={(e) => onChange({ ...lesson, title: e.target.value })} 
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="URL do Vídeo (YouTube, etc)"
            required
            value={lesson?.video_url ?? ''}
            onChange={(e) => onChange({ ...lesson, video_url: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={lesson?.status ?? 'published'}
            onChange={(e) => onChange({ ...lesson, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="published">Publicada</option>
            <option value="draft">Rascunho</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2"
          >
            {isEditing ? 'Salvar Alterações' : 'Salvar Aula'}
          </button>
        </form>

      </div>
    </div>
  );
}