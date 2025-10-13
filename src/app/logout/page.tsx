'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock } from 'lucide-react';
import Input from '@/components/ui/base/Input';
import Button from '@/components/ui/base/Button';
import { Label } from '@/components/ui/base/label';

export default function LoginCadastro() {
  const router = useRouter();

  const [modo, setModo] = useState<'login' | 'cadastro'>('login');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const [erroSenha, setErroSenha] = useState('');
  const [erroTermos, setErroTermos] = useState('');

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();

    router.push('/');
  };

  const cadastrar = (e: React.FormEvent) => {
    e.preventDefault();

    setErroSenha('');
    setErroTermos('');

    if (novaSenha !== confirmarSenha) {
      setErroSenha('Senhas diferentes.');
      return;
    }

    if (!aceitouTermos) {
      setErroTermos('Aceite os termos para continuar.');
      return;
    }

    console.log('Cadastro feito com:', novoEmail);
    setNovoEmail('');
    setNovaSenha('');
    setConfirmarSenha('');
    setAceitouTermos(false);
    setModo('login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-100 p-8 shadow-xl">
        <div className="mb-8 flex border-b border-gray-300">
          <button
            onClick={() => setModo('login')}
            className={`flex-1 py-3 text-center font-semibold ${
              modo === 'login'
                ? 'border-b-4 border-purple-700 text-purple-700'
                : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setModo('cadastro')}
            className={`flex-1 py-3 text-center font-semibold ${
              modo === 'cadastro'
                ? 'border-b-4 border-purple-700 text-purple-700'
                : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {modo === 'login' ? (
          <form onSubmit={entrar} className="space-y-5">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-500" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white py-2 pr-4 pl-10 text-black focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-500" />
              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white py-2 pr-4 pl-10 text-black focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <label className="flex cursor-pointer items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={e => setLembrar(e.target.checked)}
                className="mr-2"
              />
              Lembrar email
            </label>

            <button
              type="submit"
              className="w-full rounded py-2 font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: '#4C2158' }}
            >
              Entrar
            </button>

            <p className="text-center text-sm text-gray-700">
              Não tem conta?{' '}
              <button
                type="button"
                className="font-semibold text-purple-700 hover:underline"
                onClick={() => setModo('cadastro')}
              >
                Cadastre-se
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={cadastrar} className="space-y-5">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-500" />
              <Input
                type="email"
                placeholder="Email"
                value={novoEmail}
                onChange={e => setNovoEmail(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white py-2 pr-4 pl-10 text-black focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-500" />
              <Input
                type="password"
                placeholder="Senha"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white py-2 pr-4 pl-10 text-black focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-500" />
              <Input
                type="password"
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white py-2 pr-4 pl-10 text-black focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            {erroSenha && <p className="text-sm font-semibold text-red-600">{erroSenha}</p>}

            <label className="flex cursor-pointer items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={e => setAceitouTermos(e.target.checked)}
                className="mr-2"
              />
              Aceito os{' '}
              <a href="#" className="ml-1 text-purple-700 hover:underline">
                termos de uso
              </a>
              .
            </label>

            {erroTermos && <p className="text-sm font-semibold text-red-600">{erroTermos}</p>}

            <button
              type="submit"
              className="w-full rounded py-2 font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: '#4C2158' }}
            >
              Finalizar cadastro
            </button>

            <p className="text-center text-sm text-gray-700">
              Já tem conta?{' '}
              <button
                type="button"
                className="font-semibold text-purple-700 hover:underline"
                onClick={() => setModo('login')}
              >
                Entrar
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
