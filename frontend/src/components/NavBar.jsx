import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
export function Navbar({ userName }) {
  const navigate = useNavigate();
 
  function handleLogout() {
    localStorage.removeItem('@CourseSphere:token');
    localStorage.removeItem('@CourseSphere:user');
    navigate('/login');
  }
 
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">CourseSphere</h1>
 
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-gray-600 hidden md:block">
              Olá, <span className="font-semibold">{userName}</span>
            </span>
          )}
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
  );
}