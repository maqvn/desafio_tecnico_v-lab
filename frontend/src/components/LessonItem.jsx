// components/LessonItem.jsx

import { Play, Edit, Trash, ExternalLink } from 'lucide-react';

export function LessonItem({ lesson, isOwner, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
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
          <a
            href={lesson.video_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
          >
            Assistir material <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {isOwner && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(lesson)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Editar Aula"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(lesson.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Excluir Aula"
          >
            <Trash size={18} />
          </button>
        </div>
      )}
    </div>
  );
}