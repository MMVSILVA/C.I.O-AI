import React, { useState } from "react";
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
  ToggleRight,
  Edit2,
  XCircle,
  Save,
  Grid,
  Download,
  Trophy,
  ShieldCheck,
  Lock
} from "lucide-react";
import { jsPDF } from "jspdf";
import { UserProfile, Sector } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  sectors: Sector[];
  onUserUpdate: (u: UserProfile) => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
];

export default function ProfileView({ user, sectors, onUserUpdate }: ProfileViewProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editRole, setEditRole] = useState(user.role);
  const [editSectorId, setEditSectorId] = useState(user.sectorId);
  const [editAvatar, setEditAvatar] = useState(user.avatar || "");

  const matchedSector = sectors.find(s => s.id === user.sectorId)?.name || "Geral";

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Header Brand Accent Bar
      doc.setFillColor(0, 59, 209); // #003BD1
      doc.rect(0, 0, 210, 8, "F");

      // Corporate Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(0, 59, 209);
      doc.text("C.I.O AI", 20, 25);

      // Subheading
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("SISTEMA FIRJAN - RELATÓRIO OFICIAL DE INTEGRANTE & ONBOARDING", 20, 31);
      doc.line(20, 35, 190, 35);

      // Section: Colaborador Details
      doc.setFontSize(13);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("1. INFORMAÇÕES DE CADASTRO", 20, 48);

      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("Nome Completo:", 20, 58);
      doc.setFont("Helvetica", "normal");
      doc.text(user.name, 65, 58);

      doc.setFont("Helvetica", "bold");
      doc.text("E-mail Corporativo:", 20, 66);
      doc.setFont("Helvetica", "normal");
      doc.text(user.email, 65, 66);

      doc.setFont("Helvetica", "bold");
      doc.text("Cargo / Atribuição:", 20, 74);
      doc.setFont("Helvetica", "normal");
      doc.text(user.role, 65, 74);

      doc.setFont("Helvetica", "bold");
      doc.text("Setor Organizacional:", 20, 82);
      doc.setFont("Helvetica", "normal");
      doc.text(matchedSector, 65, 82);

      doc.setFont("Helvetica", "bold");
      doc.text("Selo de Segurança MFA:", 20, 90);
      doc.setFont("Helvetica", "normal");
      doc.text(user.mfaEnabled ? "ATIVO (Sinal de Conformidade com LGPD)" : "INATIVO (Ação Obrigatória em 48h)", 65, 90);

      // Section: Progress & Achievements
      doc.line(20, 98, 190, 98);
      doc.setFontSize(13);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("2. DESEMPENHO & GAMIFICAÇÃO COGNITIVA", 20, 110);

      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.text("XP Total Acumulado:", 20, 120);
      doc.setFont("Helvetica", "normal");
      doc.text(`${user.points} XP`, 65, 120);

      doc.setFont("Helvetica", "bold");
      doc.text("Progresso do Onboarding:", 20, 128);
      doc.setFont("Helvetica", "normal");
      doc.text(`${user.onboardingProgress}% Concluído`, 65, 128);

      doc.setFont("Helvetica", "bold");
      doc.text("Status de Graduação:", 20, 136);
      doc.setFont("Helvetica", "normal");
      doc.text(user.points >= 300 ? "PRO COGNITIVO (Certificado Liberado)" : "APRENDIZ COOP", 65, 136);

      // Badges dynamic calculation
      const badgesUnlocked = [];
      if (user.points >= 100) badgesUnlocked.push("Explorador Bronze");
      if (user.points >= 200) badgesUnlocked.push("Guardiao de Prata");
      if (user.points >= 300) badgesUnlocked.push("Campeao de Ouro");
      if (user.points >= 500) badgesUnlocked.push("Lenda do Conhecimento");
      if (user.mfaEnabled) badgesUnlocked.push("Sentinela LGPD");
      
      doc.setFont("Helvetica", "bold");
      doc.text("Medalhas Conquistadas:", 20, 144);
      doc.setFont("Helvetica", "normal");
      doc.text(badgesUnlocked.length > 0 ? badgesUnlocked.join(", ") : "Nenhuma medalha ainda.", 65, 144);

      // Section: Onboarding Modules detailed grid
      doc.line(20, 154, 190, 154);
      doc.setFontSize(13);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("3. TRILHA EDUCACIONAL E CAPACITAÇÕES", 20, 166);

      doc.setFontSize(9.5);
      doc.setFont("Helvetica", "bold");
      doc.text("Módulo Acadêmico", 20, 178);
      doc.text("Carga Horária", 125, 178);
      doc.text("Status de Integração", 155, 178);
      doc.line(20, 181, 190, 181);

      doc.setFont("Helvetica", "normal");
      let y = 189;
      
      // Module 1
      doc.text("1. Introdução à Cultura e Missão do Sistema Firjan", 20, y);
      doc.text("40 min", 125, y);
      doc.text("Concluído", 155, y);
      y += 8;

      // Module 2
      doc.text("2. Segurança de Contas, Senhas e LGPD", 20, y);
      doc.text("1h 15m", 125, y);
      doc.text("Concluído", 155, y);
      y += 8;

      // Module 3
      doc.text("3. Processos Internos e Solicitações Corriqueiras", 20, y);
      doc.text("50 min", 125, y);
      doc.text(user.onboardingProgress >= 75 ? "Concluído" : "Em Andamento (Pendente)", 155, y);
      y += 8;

      // Module 4
      doc.text("4. Onboarding Técnico e Mentoria de Ferramentas", 20, y);
      doc.text("2h 00m", 125, y);
      doc.text(user.onboardingProgress >= 100 ? "Concluído" : "Não Iniciado (Pendente)", 155, y);

      // Section: Signature & Corporate Signoff
      doc.line(20, 240, 190, 240);
      doc.setFontSize(8.5);
      doc.setFont("Helvetica", "italic");
      doc.setTextColor(148, 163, 184);
      doc.text(`Documento autenticado localmente pelo titular em: ${new Date().toLocaleString("pt-BR")}`, 20, 248);
      doc.text("C.I.O AI v3.5 - Inteligência Artificial de Onboarding & Governança • Sistema Firjan 2026", 20, 254);

      doc.save(`Relatorio_Onboarding_Firjan_${user.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Não foi possível processar a geração do PDF localmente.");
    }
  };

  const toggleMfaServerCall = async () => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/mfa-toggle", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onUserUpdate({
          ...user,
          mfaEnabled: data.mfaEnabled
        });
        setSuccessMsg(data.mfaEnabled ? "✓ MFA Ativado com Sucesso!" : "✕ MFA Desativado!");
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch {
      setErrorMsg("Falha ao registrar MFA no servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!editEmail.toLowerCase().endsWith("@firjan.com.br")) {
      setErrorMsg("O e-mail deve obrigatoriamente terminar com @firjan.com.br.");
      setLoading(false);
      return;
    }

    if (!editName.trim()) {
      setErrorMsg("O nome completo não pode ficar em branco.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          sectorId: editSectorId,
          avatar: editAvatar
        })
      });
      const data = await res.json();
      if (data.success) {
        onUserUpdate(data.user);
        setSuccessMsg("✓ Perfil institucional atualizado com sucesso!");
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Houve um erro ao atualizar os dados no banco.");
      }
    } catch {
      setErrorMsg("Erro de rede ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdits = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditSectorId(user.sectorId);
    setEditAvatar(user.avatar || "");
    setIsEditing(false);
    setErrorMsg(null);
  };

  return (
    <div className="text-slate-800 font-sans grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Visual profiling card (span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-between text-center space-y-4">
        
        <div className="space-y-4 w-full relative">
          
          <div className="relative mx-auto w-24 h-24 rounded-full border-2 border-[#003BD1] p-1 bg-slate-50">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl text-[#003BD1] font-black uppercase font-mono">
                {user.name.charAt(0)}
              </div>
            )}

            {/* Glowing active indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
              {user.name}
              {user.points >= 300 && (
                <BadgeCheck className="w-5 h-5 text-[#003BD1]" title="Perfil Verificado" />
              )}
            </h3>
            <p className="text-xs text-[#003BD1] font-mono tracking-wide font-semibold uppercase">{user.role}</p>
            <p className="text-[11px] text-slate-500 font-medium font-sans">Setor: {matchedSector}</p>
          </div>
        </div>

        {/* Gamification Level badges */}
        <div className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500">Graduação:</span>
          <span className="text-[#003BD1] font-extrabold flex items-center gap-1 uppercase text-[10px]">
            <Star className="w-4 h-4 text-[#003BD1] fill-[#003BD1]" /> 
            {user.points >= 300 ? "PRO COGNITIVO" : "APRENDIZ COOP"}
          </span>
        </div>

        {/* Action button to open profile editor */}
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              isEditing 
                ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700" 
                : "bg-[#003BD1] hover:bg-[#002cb3] border-transparent text-white shadow-sm"
            }`}
          >
            {isEditing ? (
              <>
                <XCircle className="w-4 h-4" />
                Fechar FormEdição
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Editar Perfil Completo
              </>
            )}
          </button>

          <button
            onClick={handleExportPDF}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-transparent"
          >
            <Download className="w-4 h-4 text-white" />
            Exportar Progresso (PDF)
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 pt-2 select-none uppercase">
          <MapPin className="w-3.5 h-3.5 text-[#003BD1]" /> Rio de Janeiro • Firjan Headquarters
        </div>

      </div>

      {/* Profile security & achievements (span 8) */}
      <div className="lg:col-span-8 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
        
        {/* Alerts section */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs"
          >
            <XCircle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {isEditing ? (
          /* Profile Editor Form Segment */
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleProfileSave}
            className="space-y-6"
          >
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase font-mono tracking-wide">
                <Settings className="w-4 h-4 text-[#003BD1] animate-spin-slow" />
                Editar Dados do Seu Perfil
              </h4>
              <p className="text-xs text-slate-500 mt-1">Atualize suas credenciais no banco de dados local da Firjan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase font-mono">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#003BD1] focus:bg-white text-slate-800 font-medium font-sans"
                    placeholder="Nome completo para identificação"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase font-mono flex justify-between">
                  <span>E-mail Corporativo</span>
                  <span className="text-[10px] text-[#003BD1] lowercase font-normal">@firjan.com.br</span>
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#003BD1] focus:bg-white text-slate-800 font-mono"
                  placeholder="sua.conta@firjan.com.br"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase font-mono">Cargo / Função</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#003BD1] focus:bg-white text-slate-800 font-sans cursor-pointer"
                >
                  <option value="Colaborador">Colaborador (Pleno)</option>
                  <option value="Gestor">Gestor / Coordenador</option>
                  <option value="Administrador">Administrador de TI</option>
                  <option value="Diretor">Diretor Operacional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase font-mono">Setor Oficial</label>
                <select
                  value={editSectorId}
                  onChange={(e) => setEditSectorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-[#003BD1] focus:bg-white text-slate-800 font-sans cursor-pointer"
                >
                  {sectors.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Avatar picker segment */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase font-mono block">Escolher Avatar Corporativo</label>
              
              <div className="flex flex-wrap gap-3 items-center">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditAvatar(av)}
                    className={`w-12 h-12 rounded-full border-2 p-0.5 overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                      editAvatar === av ? "border-[#003BD1]" : "border-transparent opacity-70"
                    }`}
                  >
                    <img src={av} alt="Avatar Opção" className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setEditAvatar("")}
                  className={`px-3 py-2 text-xs font-mono font-bold rounded-lg border cursor-pointer transition-all ${
                    !editAvatar ? "bg-[#003BD1] border-[#003BD1] text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Usar Letra Inicial
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-400 font-mono block">OU INSERIR URL CUSTOMIZADA DE AVATAR:</span>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-600 focus:outline-none focus:border-[#003BD1]"
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={cancelEdits}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold bg-[#003BD1] hover:bg-[#002cb3] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>

          </motion.form>
        ) : (
          <>
            {/* Achievements Segment */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#003BD1] pb-1 border-b border-slate-100">
                Estatísticas do Onboarding
              </h4>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase block mb-1">Módulos Cumpridos</span>
                  <span className="text-base font-bold text-slate-700">
                    {user.onboardingProgress >= 100 ? "4 de 4" : user.onboardingProgress >= 50 ? "2 de 4" : "1 de 4"}
                  </span>
                </div>

                <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                  <span className="text-slate-500 text-[10px] uppercase block mb-1">Anotações na Wiki</span>
                  <span className="text-base font-bold text-slate-700">2 anotações</span>
                </div>

                <div className="p-4 bg-[#003BD1]/5 border border-[#003BD1]/10 rounded-xl col-span-2 lg:col-span-1">
                  <span className="text-slate-500 text-[10px] uppercase block mb-1">XP Coletado</span>
                  <span className="text-base font-extrabold text-[#003BD1]">{user.points} XP</span>
                </div>
              </div>
            </div>

            {/* Gamified Badges / Medals Showcase Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#003BD1] pb-1 border-b border-slate-100 flex items-center gap-1.5 font-bold">
                <Trophy className="w-4.5 h-4.5 text-[#003BD1]" />
                Galeria de Conquistas & Medalhas
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    id: "badge-pioneiro",
                    title: "Pioneiro Cognitivo",
                    requirement: "Ganhar 100+ XP",
                    desc: "Primeiros passos concluídos com total dedicação e aproveitamento.",
                    unlocked: user.points >= 100,
                    icon: Trophy,
                    color: "text-amber-600 bg-amber-50 border-amber-200"
                  },
                  {
                    id: "badge-guardiao",
                    title: "Guardião Cultural",
                    requirement: "Ganhar 200+ XP",
                    desc: "Demonstrou domínio das diretrizes operacionais e cultura corporativa.",
                    unlocked: user.points >= 200,
                    icon: Award,
                    color: "text-slate-500 bg-slate-50 border-slate-200"
                  },
                  {
                    id: "badge-campeao",
                    title: "Elite da Integração",
                    requirement: "Ganhar 300+ XP",
                    desc: "Parabéns! Você alcançou o nível proficiente da trilha de onboarding.",
                    unlocked: user.points >= 300,
                    icon: BadgeCheck,
                    color: "text-[#003BD1] bg-blue-50 border-blue-200"
                  },
                  {
                    id: "badge-mestre",
                    title: "Lenda do Conhecimento",
                    requirement: "Ganhar 500 XP",
                    desc: "Completou o onboarding de forma impecável e coletou todos os recursos.",
                    unlocked: user.points >= 500,
                    icon: Star,
                    color: "text-yellow-600 bg-yellow-50 border-yellow-200"
                  },
                  {
                    id: "badge-seguranca",
                    title: "Sentinela LGPD",
                    requirement: "Ativar o MFA",
                    desc: "Colaborador consciente que protegeu os ativos e contas da empresa.",
                    unlocked: !!user.mfaEnabled,
                    icon: ShieldCheck,
                    color: "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }
                ].map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={badge.id}
                      className={`p-3.5 border rounded-xl flex items-start gap-3 transition-all relative overflow-hidden ${
                        badge.unlocked 
                          ? "bg-white border-slate-200/80 shadow-2xs hover:shadow-xs hover:scale-[1.01]" 
                          : "bg-slate-50/50 border-slate-100 opacity-60"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        badge.unlocked ? badge.color : "bg-slate-100 text-slate-400 border-slate-100"
                      }`}>
                        {badge.unlocked ? (
                          <Icon className="w-5.5 h-5.5" />
                        ) : (
                          <Lock className="w-4.5 h-4.5 text-slate-400" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 justify-between">
                          <p className={`text-xs font-bold truncate ${badge.unlocked ? "text-slate-800" : "text-slate-400 font-medium"}`}>
                            {badge.title}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          {badge.desc}
                        </p>
                        <span className={`inline-block text-[9px] font-mono uppercase font-bold tracking-wider rounded-md mt-1 ${
                          badge.unlocked 
                            ? "text-emerald-700 bg-emerald-50 py-0.5 px-1.5" 
                            : "text-slate-400 bg-slate-100 py-0.5 px-1.5"
                        }`}>
                          {badge.unlocked ? "Liberado ✓" : badge.requirement}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security Parameters segment with realistic MFA Toggle interaction */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 pb-1 border-b border-slate-100">
                Segurança de Conta & LGPD
              </h4>

              <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase font-[#003BD1]">
                    <ShieldAlert className="w-4.5 h-4.5 text-[#003BD1]" />
                    Autenticação de Múltiplos Fatores (MFA)
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    Ativar o MFA concede uma barreira de segurança secundária obrigatória e confere um selo verificado de conformidade com a LGPD em seu perfil corporativo.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleMfaServerCall}
                    disabled={loading}
                    title="Habilitar/Desabilitar"
                    className="hover:scale-105 transition-all text-[#003BD1] cursor-pointer"
                  >
                    {user.mfaEnabled ? (
                      <ToggleRight className="w-12 h-12 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-12 h-12 text-slate-400" />
                    )}
                  </button>

                  <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">
                    {user.mfaEnabled ? "MFA: ATIVO" : "MFA: INATIVO"}
                  </span>
                </div>
              </div>
            </div>

            {/* Core details inventory */}
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2.5 text-xs text-slate-600 leading-normal font-mono">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#003BD1]" />
                <span>EMAIL INSTITUCIONAL: {user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#003BD1]" />
                <span>CARGO / ATRIBUIÇÕES: {user.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#003BD1]" />
                <span>SETOR OPERACIONAL: {matchedSector}</span>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
