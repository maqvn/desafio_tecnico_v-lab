import { LogOut, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
export function Navbar({ userName }) {
  const navigate = useNavigate();
 
  function handleLogout() {
    localStorage.removeItem('@CourseSphere:token');
    localStorage.removeItem('@CourseSphere:user');
    navigate('/login');
  }

  const initials = userName
    ? userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
 
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg shadow-md shadow-indigo-200">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            CourseSphere
          </span>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          {userName && (
            <div className="hidden md:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-white">{initials}</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {userName}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
            title="Sair"
          >
            <LogOut size={16} />
            <span className="hidden md:inline font-medium">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}