import { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  MapPin, 
  ShieldAlert, 
  Award, 
  Settings, 
  CheckCircle2, 
  BadgeCheck, 
  Star, 
  Briefcase,
  Mail,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { UserProfile, Sector } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  sectors: Sector[];
  onUserUpdate: (u: UserProfile) => void;
}

export default function ProfileView({ user, sectors, onUserUpdate }: ProfileViewProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const matchedSector = sectors.find(s => s.id === user.sectorId)?.name || "Geral";

  const toggleMfaServerCall = async () => {
    setLoading(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/mfa-toggle", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onUserUpdate({
          ...user,
          mfaEnabled: data.mfaEnabled
        });
        setSuccessMsg(data.mfaEnabled ? "✓ MFA Ativado com Sucesso!" : "✕ MFA Desativado!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      console.error("Falha ao registrar MFA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white font-sans grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      {/* Visual profiling card (span 4) */}
      <div className="md:col-span-4 bg-[#0a0f21]/60 border border-white/5 p-6 rounded-3xl backdrop-blur-md flex flex-col items-center justify-between text-center space-y-4">
        
        <div className="space-y-3 relative">
          
          <div className="relative mx-auto w-24 h-24 rounded-full border-2 border-blue-500 p-1 bg-black/40">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-950 flex items-center justify-center text-3xl text-[#00FFB2] font-black uppercase font-mono">
                {user.name.charAt(0)}
              </div>
            )}

            {/* Glowing active indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#00FFB2] rounded-full border-2 border-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-md font-bold text-gray-100 flex items-center justify-center gap-1">
              {user.name}
              {user.points >= 300 && (
                <BadgeCheck className="w-4.5 h-4.5 text-[#00FFB2]" title="Perfil Verificado" />
              )}
            </h3>
            <p className="text-xs text-blue-400 font-mono tracking-wide">{user.role} de {matchedSector.split(" ")[0]}</p>
          </div>
        </div>

        {/* Gamification Level badges */}
        <div className="w-full p-3 bg-[#050505]/45 border border-white/5 rounded-2xl flex justify-between items-center text-xs font-mono">
          <span className="text-gray-400">Classificação:</span>
          <span className="text-[#00FFB2] font-extrabold flex items-center gap-1 uppercase text-[10px]">
            <Star className="w-3.5 h-3.5 text-[#00FFB2] fill-[#00FFB2]" /> 
            {user.points >= 300 ? "PRO COGNITIVO" : "APRENDIZ COOP"}
          </span>
        </div>

        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 pt-2 select-none uppercase">
          <MapPin className="w-3.5 h-3.5 text-[#00FFB2]" /> Local: Rio de Janeiro Office
        </div>

      </div>

      {/* Profile security & achievements (span 8) */}
      <div className="md:col-span-8 bg-[#0a0f21]/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-6">
        
        {/* Achievements Segment */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#00FFB2] pb-1 border-b border-white/5">
            Estatísticas do Onboarding
          </h4>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-gray-500 text-[10px] uppercase block mb-1">Módulos Cumpridos</span>
              <span className="text-lg font-bold text-gray-200">
                {user.onboardingProgress >= 100 ? "4 de 4" : user.onboardingProgress >= 50 ? "2 de 4" : "1 de 4"}
              </span>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-gray-500 text-[10px] uppercase block mb-1">Anotações na Wiki</span>
              <span className="text-lg font-bold text-gray-200">2 anotações</span>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl col-span-2 lg:col-span-1">
              <span className="text-gray-500 text-[10px] uppercase block mb-1">XP Coletado</span>
              <span className="text-lg font-bold text-[#00FFB2]">{user.points} XP</span>
            </div>
          </div>
        </div>

        {/* Security Parameters segment with realistic MFA Toggle interaction */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400 pb-1 border-b border-white/5">
            Segurança de Conta & LGPD
          </h4>

          <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-wrap justify-between items-center gap-4">
            <div className="space-y-1 max-w-sm">
              <span className="text-xs font-bold text-gray-100 flex items-center gap-1.5 uppercase font-mono">
                <ShieldAlert className="w-4.5 h-4.5 text-blue-400" />
                Autenticação de Múltiplos Fatores (MFA)
              </span>
              <p className="text-[11px] text-gray-400 leading-normal font-sans">
                Ativar o MFA concede uma barreira de segurança secundária obrigatória e confere um selo verificado de conformidade com a LGPD em seu perfil.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={toggleMfaServerCall}
                disabled={loading}
                title="Habilitar/Desabilitar"
                className="hover:scale-105 transition-all text-blue-400 cursor-pointer"
              >
                {user.mfaEnabled ? (
                  <ToggleRight className="w-12 h-12 text-[#00FFB2]" />
                ) : (
                  <ToggleLeft className="w-12 h-12 text-gray-600" />
                )}
              </button>

              <span className="text-[9px] font-mono uppercase text-gray-500">
                {user.mfaEnabled ? "MFA: HABILITADO" : "MFA: DESABILITADO"}
              </span>
            </div>
          </div>

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-950/20 border border-emerald-500/20 text-[#00FFB2] text-xs font-mono rounded-xl text-center flex items-center justify-center gap-1.5 animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00FFB2]" /> {successMsg}
            </motion.div>
          )}
        </div>

        {/* Core details inventory */}
        <div className="p-4 bg-blue-950/5 border border-blue-500/10 rounded-2xl space-y-2.5 text-xs text-gray-400 leading-normal font-mono">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00FFB2]" />
            <span>EMAIL INSTITUCIONAL: {user.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#00FFB2]" />
            <span>CARGO / CONFIGURAÇÃO DE PRIVILÉGIOS (RBAC): {user.role}</span>
          </p>
        </div>

      </div>

    </div>
  );
}
