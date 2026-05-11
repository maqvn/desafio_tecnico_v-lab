import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
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

  return (
    <AuthLayout title="Criar Conta" subtitle="Preencha seus dados para começar a estudar">
      <form onSubmit={handleRegister} className="space-y-5">

        <FormField
          label="Nome Completo"
          type="text"
          placeholder="Ex: Marcos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormField
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormField
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

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
    </AuthLayout>
  );
}