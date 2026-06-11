import { useState } from "react";
import { motion } from "motion/react";
import { 
  Network, 
  UserCheck, 
  Mail, 
  Users, 
  ArrowRight, 
  Compass, 
  GitCommit, 
  CheckCircle2,
  Building
} from "lucide-react";
import { Sector } from "../types";

interface OrganogramViewProps {
  sectors: Sector[];
}

export default function OrganogramView({ sectors }: OrganogramViewProps) {
  const [activeSectorId, setActiveSectorId] = useState<string>("sec-ti");
  const [emailTriggered, setEmailTriggered] = useState<string | null>(null);

  const selectedSector = sectors.find(s => s.id === activeSectorId) || sectors[0];

  const handleSendEmailSimulate = (email: string) => {
    setEmailTriggered(email);
    setTimeout(() => setEmailTriggered(null), 2500);
  };

  return (
    <div className="text-white font-sans space-y-6">
      
      {/* Top Description bar */}
      <div className="flex justify-between items-center bg-[#0a0f21]/60 p-4 border border-white/5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-550/10 border border-blue-500/30 flex items-center justify-center">
            <Network className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-100 uppercase tracking-wider font-mono">Mapa Estrutural de Setores</h2>
            <p className="text-[10px] text-gray-400">Navegue pelas diretorias, responsabilidades primárias e comunicações interconectadas.</p>
          </div>
        </div>
      </div>

      {/* Grid: 2-Cols for Visual Tree + Expandable Inspecting Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-220px)]">
        
        {/* Hierarchical structural mapping (left side, span 7) */}
        <div className="lg:col-span-7 bg-[#0a0f21]/40 border border-white/5 p-6 rounded-2xl h-full overflow-y-auto space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-mono uppercase text-blue-400">Organograma Interativo</span>
            <span className="text-[10px] text-gray-500 font-mono">Nível Hierárquico</span>
          </div>

          <div className="space-y-6">
            {/* Level 1: Root Directors */}
            <div className="flex justify-center">
              {sectors.filter(s => !s.parentId).map(rootSecret => (
                <motion.button
                  key={rootSecret.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveSectorId(rootSecret.id)}
                  className={`p-4 rounded-xl border text-left w-64 cursor-pointer relative transition-all ${
                    activeSectorId === rootSecret.id
                      ? "border-blue-550 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "border-blue-500/10 bg-blue-950/5 hover:border-blue-500/30"
                  }`}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-900 border border-blue-500 text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest text-[#f59e0b]">
                    LEVEL 1 • LIDERANÇA
                  </div>
                  <h4 className="text-xs font-extrabold text-gray-100 flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    {rootSecret.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">Líder: {rootSecret.responsible}</p>
                </motion.button>
              ))}
            </div>

            {/* Connecting visual dividers */}
            <div className="relative flex justify-center py-1">
              <div className="w-0.5 h-6 bg-white/10" />
            </div>

        {/* Level 2: Sub-Departments in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sectors.filter(s => s.parentId === "sec-dir").map(sub => (
                <motion.button
                  key={sub.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveSectorId(sub.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    activeSectorId === sub.id
                      ? "border-amber-400 bg-amber-950/25 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "border-white/5 bg-[#050505]/40 hover:border-white/15"
                  }`}
                >
                  <p className="text-[8px] font-mono text-amber-400 uppercase tracking-wider mb-1">Setor Operacional</p>
                  <h4 className="text-xs font-bold text-gray-200 line-clamp-1">{sub.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1.5 truncate">Líder: {sub.responsible}</p>
                  <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-gray-500 border-t border-white/5 pt-2">
                    <span>{sub.size} colaboradores</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Area Detail Inspecting panel (right side, span 5) */}
        <div className="lg:col-span-5 bg-[#0a0f21]/60 border border-white/5 p-6 rounded-2xl h-full flex flex-col justify-between backdrop-blur-md">
          
          <div className="space-y-5">
            <div className="pb-3 border-b border-white/5">
              <span className="text-[9px] font-mono uppercase bg-blue-950/40 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                Inspeção de Área
              </span>
              <h3 className="text-lg font-extrabold text-gray-100 mt-2">{selectedSector.name}</h3>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-300">
              {/* Responsibility block description */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Escopo e Atribuição Regulamentar</span>
                <p className="bg-[#050505]/30 p-3 rounded-xl border border-white/5 text-gray-300 font-sans">
                  {selectedSector.roleDescription}
                </p>
              </div>

              {/* Responsible metadata profiles */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Líder da Pasta</span>
                  <span className="font-bold text-gray-200 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    {selectedSector.responsible.split(" ")[0]}
                  </span>
                </div>
                
                <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Headcount Efetivo</span>
                  <span className="font-bold text-gray-200 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {selectedSector.size} integrantes
                  </span>
                </div>
              </div>

              {/* Connected channels diagram simulation list */}
              <div className="space-y-1.5 pb-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-400" /> Canais Operacionais de Ligação
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSector.connections.map((cId) => {
                    const matchedName = sectors.find(s => s.id === cId)?.name || cId;
                    return (
                      <span key={cId} className="bg-[#050505] text-[10px] px-2.5 py-1 rounded-md border border-white/5 font-mono text-gray-400 flex items-center gap-1">
                        <GitCommit className="w-3 h-3 text-amber-500" />
                        {matchedName.split(" ")[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Communication form panel */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
              <span>CONTATO DA DIRETORIA</span>
              <span>{selectedSector.email}</span>
            </div>

            {emailTriggered ? (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center text-xs text-[#00FFB2] font-mono animate-pulse flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Chamado aberto na caixa de {selectedSector.responsible}
              </div>
            ) : (
              <button
                onClick={() => handleSendEmailSimulate(selectedSector.email)}
                className="w-full py-3 rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-mono text-gray-200 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-400" /> Enviar Chamado Interno Integrado
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
