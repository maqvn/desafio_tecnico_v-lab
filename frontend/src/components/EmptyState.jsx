export function EmptyState({ message }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}