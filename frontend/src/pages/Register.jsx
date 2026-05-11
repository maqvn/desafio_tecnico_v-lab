import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '../components/AuthLayout';
import api from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      await api.post('/auth/register', { name, email, password });

      toast.success('Conta criada com sucesso! Faça login para entrar.');
      navigate('/login');

    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
      toast.error(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-sm backdrop-blur-sm";
  const labelClass = "block text-xs font-semibold text-indigo-200/80 uppercase tracking-wider mb-1.5";

  return (
    <AuthLayout title="Criar Conta" subtitle="Preencha seus dados para começar a estudar">
      <form onSubmit={handleRegister} className="space-y-4">

        {/* Nome */}
        <div>
          <label className={labelClass}>Nome Completo</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="register-name"
              type="text"
              placeholder="Ex: Marcos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>E-mail</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="register-email"
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
          <label className={labelClass}>Senha</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
              required
              minLength={6}
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
          id="register-submit"
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          {isLoading ? 'Criando conta...' : (
            <>Cadastrar <UserPlus size={16} /></>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-white/50">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-indigo-300 font-semibold hover:text-white transition-colors">
          Entre aqui
        </Link>
      </div>
    </AuthLayout>
  );
}