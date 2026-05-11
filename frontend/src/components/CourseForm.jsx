import { Save } from 'lucide-react';

export function CourseForm({ values, onChange, onSubmit, isLoading }) {
  const { name, description, startDate, endDate } = values;

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
        <input
          type="text"
          placeholder="Ex: Introdução à Lógica"
          value={name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          placeholder="Sobre o que é este curso?"
          value={description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange({ ...values, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange({ ...values, endDate: e.target.value })}
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
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

    </form>
  );
}