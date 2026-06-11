import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Briefcase, 
  FileCheck, 
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
  
  // Form fields
  const [email, setEmail] = useState("vinidoctor@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Alexandre Silva");
  const [role, setRole] = useState<UserRole>("Gestor");
  const [sectorId, setSectorId] = useState("sec-ti");
  const [mfaChecked, setMfaChecked] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, sectorId })
      });
      const data = await response.json();
      if (data.success) {
        // Automatically support MFA check before entry
        if (mfaChecked || data.user.mfaEnabled) {
          setMessage({ text: "✓ MFA Validificado. Acessando painel seguro...", isError: false });
          setTimeout(() => onLoginSuccess(data.user), 1000);
        } else {
          onLoginSuccess(data.user);
        }
      } else {
        setMessage({ text: "Credenciais inválidas de acesso corporativo.", isError: true });
      }
    } catch {
      setMessage({ text: "Falha ao contactar servidor do Firjan IA.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInput = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, sectorId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: "✓ Conta criada com sucesso no catálogo institucional! Logando...", isError: false });
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1200);
      }
    } catch {
      setMessage({ text: "Erro ao registrar usuário nas bases corporativas.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "✓ Link de redefinição com chave MFA enviado para " + email, isError: false });
  };

  const handleSSOLogin = (provider: 'Google' | 'Microsoft') => {
    setLoading(true);
    // Simulate beautiful SSO Login handshake redirect
    setTimeout(() => {
      onLoginSuccess({
        id: "sso-user",
        name: email.includes("vinidoctor") ? "Alexandre Silva" : "Novo Integrante " + provider,
        email: email,
        role: email.includes("vinidoctor") ? "Gestor" : "Colaborador",
        sectorId: "sec-ti",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
        points: 150,
        mfaEnabled: true,
        onboardingProgress: 45
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#030611] flex items-center justify-center p-4 overflow-hidden font-sans text-neutral-200">
      {/* Tech backdrop grid layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111625_1px,transparent_1px),linear-gradient(to_bottom,#111625_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
      
      {/* Big futuristic colorful vector shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/3 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg bg-[#0a0f21]/90 border border-[#1e293b] backdrop-blur-3xl p-8 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Glow neon accents along margins */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-amber-500" />

        {/* Head branding header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-black border border-[#1e293b] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Building2 className="w-7 h-7 text-[#3b82f6]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            {isForgotPassword ? "Central de Chaves" : isRegistering ? "Cadastro Corporativo" : "Acesso Institucional"}
          </h2>
          <p className="text-[9px] text-[#3b82f6] mt-1.5 uppercase tracking-widest font-mono font-bold">
            {isForgotPassword ? "REVERSÃO DE SENHAS SSO" : "SISTEMA FIRJAN PORTAL IA"}
          </p>
        </div>

        {/* Status prompt */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3.5 mb-5 rounded-xl border text-xs font-mono text-center flex items-center justify-center gap-2 ${
              message.isError 
                ? "bg-red-950/20 border-red-500/10 text-red-300" 
                : "bg-emerald-950/20 border-emerald-500/20 text-[#10b981]"
            }`}
          >
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* --- forgot password VIEW --- */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-blue-400 font-mono">E-mail Corporativo</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#030611] border border-[#1e293b]/80 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono text-white"
                  placeholder="ex: colab@firjan.com.br"
                  required
                />
                <Mail className="w-4.5 h-4.5 text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(59,130,246,0.15)] transition-all cursor-pointer text-white"
            >
              <KeyRound className="w-4 h-4 text-[#f29900]" />
              Solicitar Chave Temporária
            </button>

            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setMessage(null); }}
              className="w-full text-center text-xs text-neutral-500 hover:text-white transition-all mt-4 underline decoration-neutral-800"
            >
              Retornar ao Login
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
                  className="bg-black border border-[#1e1e24] rounded-xl py-3 px-4 text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#0c0c10] hover:border-[#10b981]/30 transition-all cursor-pointer text-neutral-300"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-sm" />
                  Microsoft 365
                </button>
                <button
                  type="button"
                  onClick={() => handleSSOLogin('Google')}
                  className="bg-black border border-[#1e1e24] rounded-xl py-3 px-4 text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#0c0c10] hover:border-[#10b981]/30 transition-all cursor-pointer text-neutral-300"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Google Workspace
                </button>
              </div>
            )}

            {!isRegistering && (
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-[#1e1e24] w-full" />
                <span className="absolute bg-[#0a0f21] px-3 text-[10px] uppercase font-mono text-neutral-400 tracking-widest">
                  Ou credenciais locais
                </span>
              </div>
            )}

            {/* --- MAIN FORMS --- */}
            <form onSubmit={isRegistering ? handleRegisterInput : handleTraditionalLogin} className="space-y-4">
              
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs text-blue-300 font-mono">Nome Completo</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#030303] border border-[#1e1e24]/80 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                      placeholder="ex: Alexandre Silva"
                      required
                    />
                    <User className="w-4.5 h-4.5 text-neutral-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-blue-300 font-mono font-bold">E-mail Corporativo</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#030303] border border-[#1e1e24]/80 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono text-white"
                    placeholder="ex: colab@firjan.com.br"
                    required
                  />
                  <Mail className="w-4.5 h-4.5 text-neutral-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {!isRegistering && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-blue-300 font-mono">Senha Secreta</label>
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-blue-400 hover:text-white transition-all underline font-mono"
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#030303] border border-[#1e1e24]/80 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono text-white"
                      placeholder="Sua senha secreta"
                      required
                    />
                    <Lock className="w-4.5 h-4.5 text-neutral-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              {/* RBAC PERMISSIONS ROLES AND SECTORS CHOOSE */}
              <div className="grid grid-cols-2 gap-3.5 p-3 rounded-xl bg-black border border-[#1e293b]">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#10b981]" />
                    Cargo (Perfil RBAC)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#1e293b] rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-blue-500 text-white"
                  >
                    <option value="Colaborador">Colaborador (Normativo)</option>
                    <option value="Gestor">Gestor (Aprovações)</option>
                    <option value="Administrador">Administrador (Audit)</option>
                    <option value="Diretor">Diretor (Corporativo)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-400" />
                    Setor Operacional
                  </label>
                  <select
                    value={sectorId}
                    onChange={(e) => setSectorId(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1e293b] rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-blue-500 text-white"
                  >
                    <option value="sec-ti">Tecnologia da Informação</option>
                    <option value="sec-rh">Gente & Recursos Humanos</option>
                    <option value="sec-fin">Financeiro & Viagens</option>
                    <option value="sec-dir">Diretoria Estratégica</option>
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
                    className="rounded border-[#1e1e24] bg-black text-[#10b981] focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="mfaCheck" className="text-xs text-neutral-400 cursor-pointer flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Exigir MFA complementar
                  </label>
                </div>
              )}

               <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 rounded-xl text-white font-extrabold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(59,130,246,0.2)] transition-all cursor-pointer"
              >
                {loading ? "Processando Autenticação..." : isRegistering ? "Criar Credenciais" : "Entrar no Portal Firjan IA"}
                <ArrowRight className="w-4 h-4 text-[#f29900] animate-pulse" />
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setMessage(null); }}
                className="text-xs text-blue-400 hover:text-white transition-all underline font-medium cursor-pointer"
              >
                {isRegistering ? "Já possui conta? Acessar credenciais locais" : "Não está catalogado? Cadastrar novo colaborador"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
