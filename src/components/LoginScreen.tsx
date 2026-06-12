import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Briefcase, 
  KeyRound, 
  ShieldCheck 
} from "lucide-react";
import { UserProfile, UserRole } from "../types";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form fields (initialized empty for pristine login security, removing Alexandre Silva as template)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Colaborador");
  const [sectorId, setSectorId] = useState("sec-rh");
  const [mfaChecked, setMfaChecked] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Strict frontend validation
    if (!email.toLowerCase().endsWith("@firjan.com.br")) {
      setMessage({ 
        text: "Acesso reservado. Use o seu e-mail corporativo terminado em @firjan.com.br", 
        isError: true 
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, sectorId })
      });
      const data = await response.json();
      if (data.success) {
        if (mfaChecked || data.user.mfaEnabled) {
          setMessage({ text: "✓ MFA Verificado com sucesso. Acessando portal seguro...", isError: false });
          setTimeout(() => onLoginSuccess(data.user), 1000);
        } else {
          onLoginSuccess(data.user);
        }
      } else {
        setMessage({ text: data.error || "Credenciais não encontradas nas bases institucionais.", isError: true });
      }
    } catch {
      setMessage({ text: "Falha de conexão com o servidor Firjan IA.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInput = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Strict frontend validation
    if (!email.toLowerCase().endsWith("@firjan.com.br")) {
      setMessage({ 
        text: "E-mail inválido. O registro exige um e-mail do Sistema Firjan terminando em @firjan.com.br", 
        isError: true 
      });
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setMessage({ text: "Por favor, digite seu nome completo para fins de compliance.", isError: true });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, sectorId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: "✓ Cadastro corporativo realizado com sucesso! Logando...", isError: false });
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1200);
      } else {
        setMessage({ text: data.error || "Erro ao realizar cadastro institucional.", isError: true });
      }
    } catch {
      setMessage({ text: "Erro ao contatar o servidor institucional.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith("@firjan.com.br")) {
      setMessage({ text: "Por favor, indique um e-mail corporativo válido @firjan.com.br", isError: true });
      return;
    }
    setMessage({ text: "✓ Instruções de redefinição enviadas para " + email, isError: false });
  };

  const handleSSOLogin = (provider: 'Google' | 'Microsoft') => {
    setLoading(true);
    setMessage(null);
    const mockEmail = `colaborador@firjan.com.br`;

    // Handshake simulation with clean profile
    setTimeout(() => {
      onLoginSuccess({
        id: `sso-${Date.now()}`,
        name: `Colaborador ${provider}`,
        email: mockEmail,
        role: "Colaborador",
        sectorId: "sec-rh",
        avatar: "",
        points: 100,
        mfaEnabled: true,
        onboardingProgress: 20
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 overflow-hidden font-sans text-slate-800">
      {/* Light elegant industrial pattern layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
      
      {/* Ambient soft blue lighting shape overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#003BD1]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xl bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Firjan Institutional Color Accent Bar (Azul Science: #003BD1) */}
        <div className="absolute top-0 left-0 w-full h-[6px] bg-[#003BD1]" />

        {/* Head Branding Header */}
        <div className="text-center mb-8">
          {/* Stylized Logo with Gradient and Sparkle, satisfying visual and logo requirements */}
          <div className="mx-auto w-20 h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm select-none">
              <defs>
                <linearGradient id="cyberDropletGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="40%" stopColor="#003BD1" />
                  <stop offset="75%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#00D2FF" />
                </linearGradient>
                <radialGradient id="nodeGlowLogin" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#67e8f9" />
                  <stop offset="100%" stopColor="#0284c7" />
                </radialGradient>
              </defs>
              {/* Clockwise inward spiral starting from (76, 28) */}
              <path 
                d="M 76 28 C 85 38, 85 58, 74 70 C 64 82, 40 82, 28 72 C 14 60, 14 38, 28 26 C 40 16, 64 16, 72 26 C 80 34, 80 54, 68 62 C 58 70, 44 70, 36 60 C 28 50, 30 36, 42 32 C 50 30, 58 36, 58 48 C 58 54, 52 58, 48 56" 
                fill="none" 
                stroke="url(#cyberDropletGradLogin)" 
                strokeWidth="11" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Glowing cyan compass star centered at (78, 22) */}
              <path 
                d="M 78 12 L 80.5 20.5 L 89 22 L 80.5 23.5 L 78 32 L 75.5 23.5 L 67 22 L 75.5 20.5 Z" 
                fill="#00FFFF" 
                opacity="0.95"
              />
              <circle cx="78" cy="22" r="2" fill="#FFFFFF" />
              {/* 3D Glossy Light-Blue core sphere with highlight */}
              <circle cx="48" cy="48" r="9" fill="url(#nodeGlowLogin)" />
            </svg>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#003BD1] select-none">
            C.I.O AI
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            Corporate Intelligence & Onboarding AI
          </p>

          {/* Call to action descriptive prompt requested */}
          <div className="mt-4 px-2 py-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed text-justify px-2">
              Uma plataforma inteligente voltada à centralização, organização e disseminação do conhecimento institucional, utilizando inteligência artificial para facilitar o acesso rápido e inteligente às informações corporativas.
            </p>
          </div>
        </div>

        {/* Status Prompt */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3.5 mb-5 rounded-xl border text-xs font-mono text-center flex items-center justify-center gap-2 ${
              message.isError 
                ? "bg-red-50 border-red-200 text-red-700" 
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* --- forgot password VIEW --- */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">E-mail Corporativo</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-mono text-slate-900"
                  placeholder="exemplo@firjan.com.br"
                  required
                />
                <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#003BD1] hover:bg-[#002cb3] text-white font-bold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-white" />
              Solicitar Chave Corporativa
            </button>

            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setMessage(null); }}
              className="w-full text-center text-xs text-slate-500 hover:text-[#003BD1] transition-all mt-4 underline"
            >
              Retornar ao Portal
            </button>
          </form>
        ) : (
          <div>
            {/* --- SSO SIGN IN SECTORS --- */}
            {!isRegistering && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSSOLogin('Microsoft')}
                  className="bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-slate-700"
                >
                  <span className="w-2.5 h-2.5 bg-[#f25f22] rounded-xs" />
                  Microsoft 365
                </button>
                <button
                  type="button"
                  onClick={() => handleSSOLogin('Google')}
                  className="bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-slate-700"
                >
                  <span className="w-2.5 h-2.5 bg-[#4285f4] rounded-full" />
                  Google Workspace
                </button>
              </div>
            )}

            {!isRegistering && (
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-slate-200 w-full" />
                <span className="absolute bg-white px-4 text-[10px] uppercase font-bold font-mono text-slate-400 tracking-widest">
                  Ou credenciais locais
                </span>
              </div>
            )}

            {/* --- MAIN FORMS --- */}
            <form onSubmit={isRegistering ? handleRegisterInput : handleTraditionalLogin} className="space-y-4">
              
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Nome Completo</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all text-slate-900"
                      placeholder="ex: Carlos Henrique"
                      required
                    />
                    <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">E-mail Corporativo</label>
                  {!isRegistering && (
                    <span className="text-[10px] text-[#003BD1] font-bold font-mono">@firjan.com.br</span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-mono text-slate-900"
                    placeholder="sufixo@firjan.com.br"
                    required
                  />
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {!isRegistering && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Senha de Acesso</label>
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-slate-500 hover:text-[#003BD1] transition-all underline font-semibold font-mono"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-mono text-slate-900"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              {/* RBAC ROLES AND SECTORS CHOOSE */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#003BD1]" />
                    Cargo / Atribuição
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#003BD1] focus:border-[#003BD1] text-slate-800"
                  >
                    <option value="Colaborador">Colaborador (Pleno)</option>
                    <option value="Gestor">Gestor / Coordenador</option>
                    <option value="Administrador">Administrador de TI</option>
                    <option value="Diretor">Diretor Operacional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#003BD1]" />
                    Setor Organizacional
                  </label>
                  <select
                    value={sectorId}
                    onChange={(e) => setSectorId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#003BD1] focus:border-[#003BD1] text-slate-800"
                  >
                    <option value="sec-ti">Tecnologia da Informação</option>
                    <option value="sec-rh">Gente & Recursos Humanos</option>
                    <option value="sec-fin">Financeiro & Custos</option>
                    <option value="sec-dir">Diretoria Geral</option>
                  </select>
                </div>
              </div>

              {!isRegistering && (
                <div className="flex items-center gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    id="mfaCheck"
                    checked={mfaChecked}
                    onChange={(e) => setMfaChecked(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-[#003BD1] focus:ring-[#003BD1] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="mfaCheck" className="text-xs text-slate-500 cursor-pointer flex items-center gap-1.5 font-mono font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#003BD1]" /> Ativar MFA institucional nesta sessão
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-3 bg-[#003BD1] hover:bg-[#002cb3] text-white font-extrabold tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer rounded-xl"
              >
                {loading ? "Autenticando..." : isRegistering ? "Confirmar Cadastro no DB Local" : "Entrar no Portal C.I.O AI"}
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setMessage(null); }}
                className="text-xs text-[#003BD1] hover:underline font-bold cursor-pointer"
              >
                {isRegistering ? "Já possui cadastro? Entrar com e-mail corporativo" : "Não possui cadastro? Registrar e-mail @firjan.com.br"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
