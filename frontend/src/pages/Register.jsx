import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.warning('Por favor, preencha todos os campos.');
    }

    if (password.length < 6) {
      return toast.warning('A senha deve ter pelo menos 6 caracteres.');
    }

    try {
      setIsLoading(true);

      await api.post('/auth/register', {
        name,
        email,
        password
      });

      toast.success('Conta criada com sucesso! Faça login para entrar.');
      
      navigate('/login');

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      toast.error(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-500">Preencha seus dados para começar a estudar</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Compledo
            </label>
            <input
              type="text"
              placeholder="Ex: Marcos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Entre aqui
          </Link>
        </div>

      </div>
    </div>
  );
}