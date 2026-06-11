import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  FileText, 
  Clock, 
  Cpu, 
  TrendingUp, 
  BookOpen, 
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

  // Realistic corporate intelligence benchmarks
  const totalInternalUsers = 49;
  const averageOnboardingTime = "4.2 dias";
  const mfaAdoptionRate = "94.8%";
  const activeVirtualSessions = 12;

  // Render elegant custom inline SVG bar chart for hits per sector to maximize styling precision
  const hitsPerSector = [
    { name: "Tecnologia", value: 340, color: "#004F9F" },
    { name: "R. Humanos", value: 280, color: "#10b981" },
    { name: "Financeiro", value: 190, color: "#3b82f6" },
    { name: "Diretoria", value: 120, color: "#f29900" }
  ];

  const maxVal = 400;

  return (
    <div className="space-y-6 text-[#f4f4f5] font-sans">
      
      {/* Top Banner Welcoming */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0c142c] to-[#0a0d16] border border-[#1e293b]"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/3 rounded-full filter blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 md:flex justify-between items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#3b82f6] tracking-wider uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
              Sessão corporativa de {user.role} ativa
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
              Olá, {user.name}! 🚀
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl">
              Bem-vindo ao **Portal Firjan IA**. Todos os fluxos operacionais, wikis institucionais e o regulamento do **Prêmio Firjan de Sustentabilidade** estão consolidados em nossa base inteligente.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <button 
              onClick={() => setView('chat')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.25)]"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              Falar com Assistente IA
            </button>
            <button 
              onClick={() => setView('onboarding')}
              className="px-5 py-3 rounded-xl bg-[#0b1329] border border-[#1e293b] hover:bg-[#111c3e] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-[#3b82f6]" />
              Trilha de Integração
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Colaboradores Catalogados", value: totalInternalUsers, change: "+6 admitidos", icon: Users, color: "text-blue-400" },
          { label: "Documentos Minerados", value: documents.length, change: "Tudo processado com OCR", icon: FileText, color: "text-[#10b981]" },
          { label: "Média de Integração", value: averageOnboardingTime, change: "-1.1 dias em relação a 2025", icon: Clock, color: "text-sky-400" },
          { label: "Selo MFA Configurado", value: mfaAdoptionRate, change: "Conformidade LGPD", icon: Activity, color: "text-amber-400" }
        ].map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-[#0a0f21]/90 border border-[#1e293b] shadow-lg relative overflow-hidden group hover:border-blue-500/20 transition-all font-sans"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all">
                <IconComponent className="w-12 h-12" />
              </div>
              <p className="text-neutral-400 text-xs font-mono tracking-wide">{kpi.label}</p>
              <h3 className="text-2xl font-extrabold mt-1.5 tracking-tight text-white">{kpi.value}</h3>
              <p className="text-[10px] text-[#10b981] font-mono mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
                {kpi.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Stats Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
        
        {/* Custom SVG Data Visualization for Sector Accesses */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0a0f21]/90 border border-[#1e293b] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-mono tracking-wider text-blue-300 uppercase font-bold">
                Pesquisa Semântica & Acessos por Setor
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Indicador acumulado de acessos e dúvidas recorrentes.</p>
            </div>

            <div className="flex bg-[#040815] p-1 rounded-lg border border-[#1e293b] text-xs font-mono">
              <button 
                onClick={() => setActiveKpiTimeline('daily')}
                className={`py-1 px-3.5 rounded-md transition-all cursor-pointer ${activeKpiTimeline === 'daily' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Semanal
              </button>
              <button 
                onClick={() => setActiveKpiTimeline('monthly')}
                className={`py-1 px-3.5 rounded-md transition-all cursor-pointer ${activeKpiTimeline === 'monthly' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
              >
                Histórico
              </button>
            </div>
          </div>

          {/* Render Vector Bar Chart */}
          <div className="space-y-4 py-3">
            {hitsPerSector.map((sector, idx) => {
              const animWidth = activeKpiTimeline === 'daily' ? (sector.value / maxVal) * 100 : ((sector.value * 1.25) / (maxVal * 1.25)) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-neutral-300 font-mono">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: sector.color }} />
                      {sector.name}
                    </span>
                    <span className="text-neutral-400">{activeKpiTimeline === 'daily' ? sector.value : Math.round(sector.value * 4.2)} acessos</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-[#1e1e24]">
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

          <div className="mt-4 pt-4 border-t border-[#1e293b] grid grid-cols-3 text-center text-xs text-neutral-400 font-mono">
            <div>
              <p className="text-[#10b981] font-extrabold text-sm">98.2%</p>
              <p className="text-[10px] mt-0.5">Precisão RAG</p>
            </div>
            <div>
              <p className="text-blue-400 font-extrabold text-sm">340+ queries</p>
              <p className="text-[10px] mt-0.5">Interações Mensais</p>
            </div>
            <div>
              <p className="text-amber-500 font-extrabold text-sm">1.8s</p>
              <p className="text-[10px] mt-0.5">Tempo Resposta</p>
            </div>
          </div>
        </div>

        {/* Right side: Most Accessed Documents & Quick Doubt Ranking */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between p-0">
          
          {/* Most View Docs List */}
          <div className="p-5 rounded-2xl bg-[#0a0f21]/90 border border-[#1e293b] space-y-3.5 h-full">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#10b981] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#10b981]" />
              Documentos de Alta Demanda
            </h4>

            <div className="space-y-3">
              {documents.slice(0, 3).map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-black/40 rounded-xl border border-[#1e293b] hover:border-blue-500/20 transition-all flex gap-3 text-xs items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-neutral-200 truncate">{doc.title}</p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase">{doc.category} • {doc.fileSize}</p>
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive doubts prompt lists */}
          <div className="p-5 rounded-2xl bg-[#0a0f21]/90 border border-[#1e293b] space-y-3.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400 flex items-center gap-1 font-bold">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Dúvidas Recorrentes (IA)
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
                  className="w-full text-left p-2.5 rounded-lg bg-white/[0.02] border border-[#1e293b] hover:border-blue-500/30 hover:bg-neutral-900/30 transition-all cursor-pointer text-neutral-300 font-medium"
                >
                  ❓ "{doubt}"
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Institutional Activity Log Feed */}
      <div className="p-6 rounded-2xl bg-[#0a0f21]/90 border border-[#1e293b]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-mono uppercase tracking-widest text-blue-300 flex items-center gap-1 font-bold">
            <BellRing className="w-4 h-4" />
            Quadro de Avisos & Feed Firjan IA
          </h4>
          <span className="text-[10px] text-neutral-500 font-mono">Últimos eventos</span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-blue-950/10 border border-blue-550/10 flex hover:border-blue-500/20 transition-all gap-4">
            <div className="w-9 h-9 rounded-lg bg-blue-900/10 flex items-center justify-center shrink-0 border border-blue-500/15">
              <Rocket className="w-4 h-4 text-blue-350" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-900/30 text-blue-300 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-blue-500/10">Importante</span>
                <p className="text-xs font-bold text-neutral-200">Fase Final: Prêmio Firjan de Sustentabilidade 2026</p>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Lembramos a todas as diretorias que a prorrogação das inscrições define o encerramento hoje à noite. Nossa equipe de P&D concluiu a submissão no portal. Para maiores diretrizes, consulte o assistente inteligente de IA.
              </p>
              <span className="text-[9px] text-[#1e1e24] dark:text-neutral-500 font-mono mt-1.5 block">Há 2 horas • Gente & RH</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/5 border border-emerald-500/5 flex hover:border-emerald-500/10 transition-all gap-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-900/5 flex items-center justify-center shrink-0 border border-emerald-500/15">
              <CheckCircle className="w-4 h-4 text-[#10b981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-900/30 text-[#10b981] text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-emerald-500/10">Notícia</span>
                <p className="text-xs font-bold text-neutral-200">Reembolso Simplificado no Financeiro</p>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Entrou em vigor a nova diretriz de reembolso automático para viagens de treinamento. Submeta suas faturas diretamente via módulo de auditoria em até 5 dias úteis com cupons fiscais.
              </p>
              <span className="text-[9px] text-neutral-500 font-mono mt-1.5 block">Ontem às 14:15 • Claudio Guedes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
