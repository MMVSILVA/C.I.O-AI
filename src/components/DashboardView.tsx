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
import { UserProfile, WikiArticle, DocumentMeta, Sector } from "../types";

interface DashboardViewProps {
  user: UserProfile;
  sectors: Sector[];
  documents: DocumentMeta[];
  articles: WikiArticle[];
  setView: (v: string) => void;
}

export default function DashboardView({ user, sectors, documents, articles, setView }: DashboardViewProps) {
  const [activeKpiTimeline, setActiveKpiTimeline] = useState<'daily' | 'monthly'>('daily');

  // Realistic corporate intelligence benchmarks (Cleaned of references to Alexandre Silva)
  const totalInternalUsers = 54;
  const averageOnboardingTime = "3.8 dias";
  const mfaAdoptionRate = "98.2%";
  const activeVirtualSessions = 15;

  // Firjan main color palette: Azul Science (#003BD1)
  const hitsPerSector = [
    { name: "Tecnologia", value: 365, color: "#003BD1" },
    { name: "Recursos Humanos", value: 290, color: "#10b981" },
    { name: "Financeiro & Custos", value: 185, color: "#3b82f6" },
    { name: "Diretoria Geral", value: 140, color: "#f59e0b" }
  ];

  const maxVal = 400;

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Top Banner Welcoming */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#003BD1] to-[#1e5bfc] text-white shadow-md border border-[#003BD1]/10"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full filter blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 md:flex justify-between items-center gap-6">
          <div className="space-y-1.5/3">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-extrabold text-white backdrop-blur-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Identificada ({user.role})
            </div>
            {/* Elegant Display Welcome message requested by user */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
              Olá, {user.name}! 🚀
            </h1>
            <p className="text-blue-100 text-xs md:text-sm max-w-xl leading-relaxed font-sans font-medium tracking-wide">
              Desejamos as boas-vindas ao portal <span className="bg-white/25 text-white font-extrabold px-2.5 py-0.5 rounded-lg border border-white/20 inline-block font-sans shadow-sm tracking-tight text-white">C.I.O AI</span>. Aqui você tem acesso integrado ao conhecimento institucional do Sistema Firjan, mapa dos setores organizacionais e diretrizes do <span className="text-emerald-300 font-extrabold tracking-tight">Prêmio Firjan de Sustentabilidade</span>.
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

      {/* Grid of Key Performance Indicators (KPIs) in Light theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Colaboradores Ativos", value: totalInternalUsers, change: "+3 novos admitidos", icon: Users, color: "text-[#003BD1]" },
          { label: "Documentos Minerados", value: documents.length, change: "Acesso unificado com OCR", icon: FileText, color: "text-emerald-600" },
          { label: "Média de Integração", value: averageOnboardingTime, change: "-1.4 dias vs média nacional", icon: Clock, color: "text-sky-600" },
          { label: "Medida LGPD (MFA)", value: mfaAdoptionRate, change: "Conformidade e segurança", icon: Activity, color: "text-amber-600" }
        ].map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-[#003BD1]/20 transition-all font-sans"
            >
              <div className={`absolute top-3 right-3 p-2 rounded-lg bg-slate-50 opacity-60 group-hover:opacity-100 transition-all ${kpi.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <p className="text-slate-400 text-[10px] font-mono tracking-wider uppercase font-bold">{kpi.label}</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight text-slate-800">{kpi.value}</h3>
              <p className="text-[10px] text-emerald-600 font-mono mt-0.5 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {kpi.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Stats Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
        
        {/* Custom SVG Data Visualization for Sector Accesses */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-mono tracking-wider text-[#003BD1] uppercase font-black">
                Mapeamento de Acessos por Setor
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Fluxo total de pesquisas semânticas e acessos ao banco de documentos.</p>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 text-[10px] font-mono">
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
                Histórico
              </button>
            </div>
          </div>

          {/* Render Vector Bar Chart in Light theme */}
          <div className="space-y-4 py-2">
            {hitsPerSector.map((sector, idx) => {
              const animWidth = activeKpiTimeline === 'daily' ? (sector.value / maxVal) * 100 : ((sector.value * 1.25) / (maxVal * 1.25)) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-700 font-mono">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: sector.color }} />
                      {sector.name}
                    </span>
                    <span className="text-slate-500 font-medium">{activeKpiTimeline === 'daily' ? sector.value : Math.round(sector.value * 4.2)} rotinas</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
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

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 text-center text-xs text-slate-500 font-mono">
            <div>
              <p className="text-emerald-600 font-extrabold text-sm">98.2%</p>
              <p className="text-[9px] mt-0.5 uppercase">Precisão C.I.O</p>
            </div>
            <div>
              <p className="text-[#003BD1] font-extrabold text-sm">340+ queries</p>
              <p className="text-[9px] mt-0.5 uppercase">Interações Mensais</p>
            </div>
            <div>
              <p className="text-amber-600 font-extrabold text-sm">1.8s</p>
              <p className="text-[9px] mt-0.5 uppercase">Tempo de Resposta</p>
            </div>
          </div>
        </div>

        {/* Right side: Most Accessed Documents & Quick Doubt Ranking (Light Theme) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3.5 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#003BD1] flex items-center gap-1.5 font-black">
                <FileText className="w-4 h-4 text-[#003BD1]" />
                Documentos Sincronizados
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal mt-1 font-medium">Bases prontas para pesquisa e leitura semântica.</p>
            </div>

            <div className="space-y-2.5 my-3">
              {documents.slice(0, 3).map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition-all flex gap-3 text-xs items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-700 truncate">{doc.title}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase font-semibold">{doc.category} • {doc.fileSize}</p>
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-505 flex items-center gap-1.5 font-bold text-slate-700">
              <HelpCircle className="w-4 h-4 text-[#003BD1]" />
              Dúvidas Frequentes via IA
            </h4>

            <div className="space-y-2 text-xs">
              {[
                "Até quando vão as inscrições do prêmio Firjan?",
                "Qual o limite diário de reembolso para viagens?",
                "Como configurar a chave MFA do portal?",
              ].map((doubt, idx) => (
                <button 
                  key={idx}
                  onClick={() => setView('chat')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#003BD1] transition-all cursor-pointer font-semibold leading-snug"
                >
                  ❓ "{doubt}"
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Institutional Activity Log Feed (Light theme) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#003BD1] flex items-center gap-1.5 font-extrabold">
            <BellRing className="w-4 h-4" />
            Canal de Avisos e Comunicados Oficiais
          </h4>
          <span className="text-[10px] text-slate-400 font-mono font-medium">Histórico Recente</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex hover:border-blue-200 transition-all gap-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-blue-200 text-[#003BD1]">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#003BD1] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded-lg border border-transparent font-extrabold">Importante</span>
                <p className="text-xs font-bold text-slate-800">Prêmio Firjan de Sustentabilidade 2026</p>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                As inscrições continuam ativas para todos os núcleos organizacionais. Os termos de fomento ecológicos e cronogramas podem ser consultados dinamicamente conversando com o **Assistente IA** (onde a base legal já está totalmente embedada).
              </p>
              <span className="text-[9px] text-[#003BD1] font-mono mt-1.5 block font-bold">Hoje • Assessoria Geral do Sistema Firjan</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200/60 flex hover:border-slate-200 transition-all gap-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-200 text-slate-500">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-slate-200 text-slate-600 text-[9px] font-mono uppercase px-2 py-0.5 rounded-lg border border-slate-300 font-bold">Institucional</span>
                <p className="text-xs font-bold text-slate-800 font-sans">Implementação do Catálogo Geral de Usuários</p>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
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
