import { GraduationCap } from 'lucide-react';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 relative overflow-hidden">

      {/* Decorative background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full animate-fade-in relative z-10">

        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-900/40 mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
          <p className="text-indigo-200/70 text-sm">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-black/30">
          {children}
        </div>

      </div>
    </div>
  );
}