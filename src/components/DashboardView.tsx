import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  FileText, 
  Clock, 
  Cpu, 
  TrendingUp, 
  Activity, 
  Rocket, 
  BellRing, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { UserProfile, WikiArticle, DocumentMeta, Sector } from "../types";

interface DashboardViewProps {
  user: UserProfile;
  sectors: Sector[];
  documents: DocumentMeta[];
  articles: WikiArticle[];
  setView: (v: string) => void;
  theme?: "light" | "dark";
}

export default function DashboardView({ user, sectors, documents, articles, setView, theme = "light" }: DashboardViewProps) {
  const [activeKpiTimeline, setActiveKpiTimeline] = useState<'daily' | 'monthly'>('daily');
  const isDark = theme === "dark";

  // Realistic corporate intelligence benchmarks 
  const totalInternalUsers = 54;
  const averageOnboardingTime = "3.8 dias";
  const mfaAdoptionRate = "98.2%";

  // Firjan main color palette: Azul Science (#003BD1)
  const hitsPerSector = [
    { name: "Tecnologia", value: 365, color: "#003BD1" },
    { name: "Recursos Humanos", value: 290, color: "#10b981" },
    { name: "Financeiro & Custos", value: 185, color: "#3b82f6" },
    { name: "Diretoria Geral", value: 140, color: "#f59e0b" }
  ];

  const maxVal = 400;

  // Recharts XP Onboarding daily evolution data
  const xpEvolutionData = [
    { day: "Seg", xp: 100 },
    { day: "Ter", xp: 140 },
    { day: "Qua", xp: 180 },
    { day: "Qui", xp: 220 },
    { day: "Sex", xp: 260 },
    { day: "Sáb", xp: 300 },
    { day: "Dom", xp: Math.max(user.points, 340) } // Dynamic link to actual earned XP!
  ];

  // Theme-driven classes
  const cardBgAndBorder = isDark 
    ? "bg-[#161b2b]/80 border-slate-800 text-slate-100 shadow-md"
    : "bg-white border-slate-200/80 text-slate-800 shadow-xs";

  const subtextClass = isDark ? "text-slate-400" : "text-slate-500";
  const bgBadgeClass = isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200";

  return (
    <div className={`space-y-6 font-sans ${isDark ? "text-slate-100" : "text-slate-800"}`} id="dashboard-view-main">
      
      {/* Top Banner Welcoming */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#003BD1] to-[#1e5bfc] text-white shadow-md border border-[#003BD1]/10"
        id="dashboard-header-banner"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full filter blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 md:flex justify-between items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-extrabold text-white backdrop-blur-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Identificada ({user.role})
            </div>
            {/* Welcoming display header */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Olá, {user.name}! 🚀
            </h1>
            <p className="text-blue-100 text-xs md:text-sm max-w-xl leading-relaxed font-sans font-medium tracking-wide">
              Desejamos as boas-vindas ao portal <span className="bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-lg border border-white/20 inline-block font-sans shadow-sm tracking-tight">C.I.O AI</span>. Aqui você tem acesso integrado ao conhecimento institucional do Sistema Firjan, mapeamento de setores organizacionais e trilhas de XP.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2.5 shrink-0">
            <button 
              onClick={() => setView('chat')}
              className="px-4.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#003BD1] text-xs font-bold tracking-wide uppercase flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Cpu className="w-4 h-4 text-[#003BD1]" />
              Falar com Assistente IA
            </button>
            <button 
              onClick={() => setView('onboarding')}
              className="px-4.5 py-2.5 rounded-xl bg-[#002cb3] hover:bg-[#001f80] text-white border border-[#ffffff]/10 text-xs font-bold tracking-wide uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-emerald-400" />
              Trilha de Integração
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-kpi-grid">
        {[
          { label: "Colaboradores Ativos", value: totalInternalUsers, change: "+3 novos admitidos", icon: Users, color: isDark ? "text-blue-450 bg-blue-950/40 border-blue-900/30" : "text-[#003BD1] bg-blue-50/25 border-blue-100" },
          { label: "Documentos Minerados", value: documents.length, change: "Busca OCR cognitiva ativa", icon: FileText, color: isDark ? "text-emerald-400 bg-emerald-950/40 border-emerald-900/30" : "text-emerald-600 bg-emerald-50/25 border-emerald-100" },
          { label: "Média de Integração", value: averageOnboardingTime, change: "-1.4 dias vs média nacional", icon: Clock, color: isDark ? "text-sky-400 bg-sky-950/40 border-sky-900/30" : "text-sky-600 bg-sky-50/25 border-sky-100" },
          { label: "Segurança LGPD (MFA)", value: mfaAdoptionRate, change: "Conformidade integrada", icon: Activity, color: isDark ? "text-amber-400 bg-amber-950/40 border-amber-900/30" : "text-amber-600 bg-amber-50/25 border-amber-100" }
        ].map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border ${cardBgAndBorder} relative overflow-hidden group hover:border-[#003BD1]/45 transition-all`}
            >
              <div className={`absolute top-3 right-3 p-2 rounded-lg border opacity-80 group-hover:opacity-100 transition-all ${kpi.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <p className={`text-[10px] font-mono tracking-wider uppercase font-bold ${isDark ? "text-slate-400" : "text-slate-400"}`}>{kpi.label}</p>
              <h3 className={`text-2xl font-black mt-1 tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>{kpi.value}</h3>
              <p className="text-[10px] text-emerald-500 font-mono mt-0.5 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {kpi.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Graphic Stats Dual-Row (Symmetric Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in" id="dashboard-graphics-row">
        
        {/* Card 1: Vector Bar Chart for Sector Accesses */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${cardBgAndBorder} flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-mono tracking-wider text-[#003BD1] uppercase font-black">
                Mapeamento de Acessos por Setor
              </h3>
              <p className={`text-[11px] mt-0.5 font-medium ${subtextClass}`}>Fluxo total de pesquisas semânticas e acessos ao banco documental.</p>
            </div>

            <div className={`flex p-1 rounded-xl border text-[10px] font-mono ${bgBadgeClass}`}>
              <button 
                onClick={() => setActiveKpiTimeline('daily')}
                className={`py-1 px-3 rounded-lg transition-all cursor-pointer font-bold ${activeKpiTimeline === 'daily' ? 'bg-[#003BD1] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Semanal
              </button>
              <button 
                onClick={() => setActiveKpiTimeline('monthly')}
                className={`py-1 px-3 rounded-lg transition-all cursor-pointer font-bold ${activeKpiTimeline === 'monthly' ? 'bg-[#003BD1] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Histório
              </button>
            </div>
          </div>

          {/* Render Vector Bar Chart */}
          <div className="space-y-4 py-2">
            {hitsPerSector.map((sector, idx) => {
              const animWidth = activeKpiTimeline === 'daily' ? (sector.value / maxVal) * 100 : ((sector.value * 1.25) / (maxVal * 1.25)) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-705 font-mono">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: sector.color }} />
                      {sector.name}
                    </span>
                    <span className="font-semibold text-[11px] opacity-80">{activeKpiTimeline === 'daily' ? sector.value : Math.round(sector.value * 4.2)} rotinas</span>
                  </div>
                  <div className={`w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200/50"}`}>
                    <motion.div 
                      className="h-full rounded-full" 
                      style={{ backgroundColor: sector.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(animWidth, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 pt-4 border-t grid grid-cols-3 text-center text-xs font-mono ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <div>
              <p className="text-emerald-500 font-extrabold text-sm">98.2%</p>
              <p className="text-[9px] mt-0.5 uppercase opacity-75">Precisão C.I.O</p>
            </div>
            <div>
              <p className="text-[#003BD1] font-extrabold text-sm">340+ queries</p>
              <p className="text-[9px] mt-0.5 uppercase opacity-75">Interações Ativas</p>
            </div>
            <div>
              <p className="text-amber-500 font-extrabold text-sm">1.8s</p>
              <p className="text-[9px] mt-0.5 uppercase opacity-75">Resposta IA</p>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive XP Evolution (Recharts BarChart inside) */}
        <div 
          id="tour-gamification-chart" 
          className={`lg:col-span-6 p-6 rounded-2xl border ${cardBgAndBorder} flex flex-col justify-between`}
        >
          <div>
            <h3 className="text-xs font-mono tracking-wider text-[#003BD1] uppercase font-black flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#003BD1]" />
              Evolução Diária de XP Onboarding (Recharts)
            </h3>
            <p className={`text-[11px] mt-0.5 font-medium ${subtextClass}`}>Seu progresso diário acumulado medido pelo cumprimento de metas e chaves.</p>
          </div>

          <div className="h-44 w-full py-4 text-xs select-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={xpEvolutionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={isDark ? "#1e293b" : "#f1f5f9"} 
                />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: isDark ? '#94a3b8' : '#64748b' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: isDark ? '#94a3b8' : '#64748b' }} 
                />
                <RechartsTooltip 
                  cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 59, 209, 0.04)' }} 
                  contentStyle={{ 
                    background: isDark ? '#1e293b' : '#ffffff', 
                    borderRadius: '12px', 
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontFamily: 'sans-serif', 
                    fontSize: '11px' 
                  }} 
                />
                <Bar dataKey="xp" fill="#003BD1" radius={[6, 6, 0, 0]}>
                  {xpEvolutionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === xpEvolutionData.length - 1 ? '#10b981' : '#003BD1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`mt-4 pt-4 border-t flex items-center justify-between text-[11px] font-mono ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <span className="flex items-center gap-1.5 font-bold text-emerald-500">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              Sua Pontuação: {user.points} XP
            </span>
            <span className="font-semibold opacity-70">Meta Semanal: 50% concluída</span>
          </div>
        </div>

      </div>

      {/* Symmetric Bottom Row: Documents and FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in" id="dashboard-bottom-row">
        
        {/* Document highlights list */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${cardBgAndBorder} flex flex-col justify-between`}>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#003BD1] flex items-center gap-1.5 font-black">
              <FileText className="w-4 h-4 text-[#003BD1]" />
              Documentos Indexados no Copiloto RAG
            </h4>
            <p className={`text-[10px] leading-normal mt-1 font-medium ${subtextClass}`}>Bases e arquivos regulamentares disponíveis para leitura via OCR.</p>
          </div>

          <div className="space-y-2.5 my-4">
            {documents.slice(0, 3).map((doc, idx) => (
              <div 
                key={idx} 
                onClick={() => setView('documents')}
                className={`p-3 rounded-xl border transition-all flex gap-3 text-xs items-center justify-between cursor-pointer ${
                  isDark ? "bg-slate-950/40 border-slate-800 hover:border-[#003BD1]/50" : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/60 hover:border-slate-300"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold truncate">{doc.title}</p>
                  <p className="text-[9px] font-mono mt-0.5 uppercase font-bold opacity-60">{doc.category} • {doc.fileSize}</p>
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>

          <button 
            onClick={() => setView('documents')}
            className={`w-full py-2.5 rounded-xl border text-[11px] font-mono uppercase font-black tracking-wider transition-all cursor-pointer ${
              isDark ? "hover:bg-slate-800 border-slate-800" : "hover:bg-slate-50 border-slate-150"
            }`}
          >
            Visualizar Todos os Documentos
          </button>
        </div>

        {/* FAQs and common doubts */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${cardBgAndBorder} justify-between flex flex-col`}>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-black">
              <HelpCircle className="w-4 h-4 text-[#003BD1]" />
              Dúvidas Comuns Respondidas por IA
            </h4>
            <p className={`text-[10px] leading-normal mt-1 font-medium ${subtextClass}`}>Perguntas prontas que você pode enviar para nossa inteligência artificial cognitiva.</p>
          </div>

          <div className="space-y-2 text-xs my-3 flex-1 py-1.5">
            {[
              "Até quando vão as inscrições do prêmio Firjan?",
              "Qual o limite diário de reembolso para viagens?",
              "Como configurar a chave MFA do portal?",
            ].map((doubt, idx) => (
              <button 
                key={idx}
                onClick={() => setView('chat')}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer font-bold leading-snug flex items-center gap-2 ${
                  isDark ? "bg-slate-950/40 border-slate-800 hover:border-[#003BD1]/50 hover:text-white" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-[#003BD1]"
                }`}
              >
                <span className="shrink-0 text-amber-500">❓</span>
                <span className="truncate">"{doubt}"</span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setView('chat')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#003BD1] to-[#1e5bfc] text-white text-[11px] font-mono uppercase font-black tracking-wider shadow-sm cursor-pointer transition-all hover:opacity-90"
          >
            Iniciar Novo Chat Inteligente
          </button>
        </div>

      </div>

      {/* External Portals & Carreira quick navigation links */}
      <div className={`p-5 rounded-2xl border ${cardBgAndBorder} flex flex-col md:flex-row justify-between items-center gap-4`} id="dashboard-external-links-panel">
        <div className="text-left">
          <span className="text-[9px] font-mono tracking-widest font-black text-[#003BD1] uppercase block mb-0.5">
            🌍 Portais Oficiais Corporativos & Carreiras
          </span>
          <h4 className="text-sm font-extrabold tracking-tight">Oportunidades de Vagas & Sites Sistêmicos</h4>
          <p className="text-[11px] text-slate-500 mt-1">Consulte o painel de empregos institucional do i-Hunter e a central informativa principal da Firjan.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0 select-none">
          <a
            href="https://jobs.i-hunter.com/firjan/oportunidades"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#003BD1] hover:text-[#003BD1] text-xs font-bold text-slate-705 flex items-center justify-center gap-1.5 shadow-3xs transition-all text-center whitespace-nowrap"
          >
            📂 Vagas de Emprego (i-Hunter) ↗
          </a>
          <a
            href="https://firjan.com.br/pagina-inicial.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#003BD1] hover:text-[#003BD1] text-xs font-bold text-slate-705 flex items-center justify-center gap-1.5 shadow-3xs transition-all text-center whitespace-nowrap"
          >
            🏢 Portal Firjan Oficial ↗
          </a>
        </div>
      </div>

      {/* Institutional Activity Log Feed */}
      <div className={`p-6 rounded-2xl border ${cardBgAndBorder}`} id="dashboard-activity-feed">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#003BD1] flex items-center gap-1.5 font-extrabold">
            <BellRing className="w-4 h-4" />
            Canal de Avisos e Comunicados Oficiais
          </h4>
          <span className="text-[10px] font-mono font-bold opacity-60">Histórico Recente</span>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl border flex hover:scale-[1.006] transition-all gap-4 ${
            isDark ? "bg-[#181d30] border-slate-800" : "bg-blue-50/20 border-blue-100"
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border uppercase font-mono font-bold ${
              isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-blue-200 text-[#003BD1]"
            }`}>
              <Rocket className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#003BD1] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded-lg border border-transparent font-extrabold">Importante</span>
                <p className="text-xs font-bold font-sans">Prêmio Firjan de Sustentabilidade 2026</p>
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                As inscrições continuam ativas para todos os núcleos organizacionais. Os termos de fomento ecológicos e cronogramas podem ser consultados dinamicamente conversando com o **Assistente IA** (onde a base legal já está totalmente embedada).
              </p>
              <span className="text-[9px] text-[#003BD1] font-mono mt-1.5 block font-bold">Hoje • Assessoria Geral do Sistema Firjan</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex hover:scale-[1.006] transition-all gap-4 ${
            isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50/50 border-slate-200/60"
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border uppercase font-mono font-bold ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 text-slate-500"
            }`}>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-slate-200 text-slate-600 text-[9px] font-mono uppercase px-2 py-0.5 rounded-lg border border-slate-300 font-bold">Institucional</span>
                <p className="text-xs font-bold font-sans">Implementação do Catálogo Geral de Usuários</p>
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Concluímos com sucesso a migração para o novo banco de dados local com persistência de sessões. Todas as informações de perfil, progresso na trilha e chaves complementares de MFA estão seguras contra desligamentos de sessão ou resets.
              </p>
              <span className="text-[9px] text-slate-400 font-mono mt-1.5 block font-semibold">Ontem • Tecnologia da Informação</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
