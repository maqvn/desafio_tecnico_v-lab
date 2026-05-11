import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      return toast.warning('Por favor, preencha todos os campos.');
    }

    try {
      setIsLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('@CourseSphere:token', token);
      
      localStorage.setItem('@CourseSphere:user', JSON.stringify(user));

      toast.success(`Bem-vindo(a) de volta, ${user.name}!`);
      
      navigate('/dashboard');

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Erro ao conectar com o servidor.';
      toast.error(mensagemErro);
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CourseSphere</h1>
          <p className="text-gray-500">Faça login para acessar seus cursos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Cadastre-se aqui
          </Link>
        </div>

      </div>
    </div>
  );
}