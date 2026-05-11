import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../components/AuthLayout';
import api from '../services/api';
 
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  const navigate = useNavigate();
 
  async function handleLogin(e) {
    e.preventDefault();
 
    if (!email || !password) {
      return toast.warning('Por favor, preencha todos os campos.');
    }
 
    try {
      setIsLoading(true);
 
      const response = await api.post('/auth/login', { email, password });
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
 
  const inputClass = "w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-sm backdrop-blur-sm";

  return (
    <AuthLayout title="CourseSphere" subtitle="Faça login para acessar seus cursos">
      <form onSubmit={handleLogin} className="space-y-4">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-indigo-200/80 uppercase tracking-wider mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-xs font-semibold text-indigo-200/80 uppercase tracking-wider mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          {isLoading ? 'Entrando...' : (
            <>Entrar na Plataforma <ArrowRight size={16} /></>
          )}
        </button>
      </form>
 
      <div className="mt-6 text-center text-sm text-white/50">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-indigo-300 font-semibold hover:text-white transition-colors">
          Cadastre-se aqui
        </Link>
      </div>
    </AuthLayout>
  );
}