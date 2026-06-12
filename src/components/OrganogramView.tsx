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
    <div className="text-slate-800 font-sans space-y-6 animate-fade-in">
      
      {/* Top Description bar */}
      <div className="flex justify-between items-center bg-white p-4 border border-slate-200/80 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-2xs">
            <Network className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Mapa Estrutural de Setores</h2>
            <p className="text-[10px] text-slate-500">Navegue pelas diretorias, responsabilidades primárias e comunicações interconectadas.</p>
          </div>
        </div>
      </div>

      {/* Grid: 2-Cols for Visual Tree + Expandable Inspecting Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-220px)]">
        
        {/* Hierarchical structural mapping (left side, span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl h-full overflow-y-auto space-y-6 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-mono uppercase text-blue-600 font-bold">Organograma Interativo</span>
            <span className="text-[10px] text-slate-400 font-mono">Nível Hierárquico</span>
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
                      ? "border-blue-500 bg-blue-50/60 shadow-2xs"
                      : "border-blue-100 bg-blue-50/20 hover:border-blue-200"
                  }`}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 border border-blue-400 text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest text-white">
                    LEVEL 1 • LIDERANÇA
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    {rootSecret.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Líder: {rootSecret.responsible}</p>
                </motion.button>
              ))}
            </div>

            {/* Connecting visual dividers */}
            <div className="relative flex justify-center py-1">
              <div className="w-0.5 h-6 bg-slate-200" />
            </div>

        {/* Level 2 & 3 Operational Sectors in an elegant grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {sectors.filter(s => s.parentId).map(sub => (
                <motion.button
                  key={sub.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveSectorId(sub.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    activeSectorId === sub.id
                      ? "border-amber-400 bg-amber-50/60 shadow-2xs"
                      : "border-slate-200 bg-slate-50/50 hover:border-amber-200"
                  }`}
                >
                  <p className="text-[8px] font-mono text-amber-500 uppercase tracking-wider mb-1">Setor Operacional</p>
                  <h4 className="text-xs font-bold text-slate-700 line-clamp-1">{sub.name}</h4>
                  <p className="text-[10px] text-slate-550 mt-1.5 truncate">Líder: {sub.responsible}</p>
                  <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-2">
                    <span>{sub.size} colaboradores</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Area Detail Inspecting panel (right side, span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl h-full flex flex-col justify-between shadow-xs">
          
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-200">
              <span className="text-[9px] font-mono uppercase bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded">
                Inspeção de Área
              </span>
              <h3 className="text-lg font-extrabold text-slate-800 mt-2">{selectedSector.name}</h3>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-650">
              {/* Responsibility block description */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Escopo e Atribuição Regulamentar</span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-650 font-sans">
                  {selectedSector.roleDescription}
                </p>
              </div>

              {/* Responsible metadata profiles */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block mb-1">Líder da Pasta</span>
                  <span className="font-bold text-slate-750 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                    {selectedSector.responsible.split(" ")[0]}
                  </span>
                </div>
                
                <div className="p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block mb-1">Headcount Efetivo</span>
                  <span className="font-bold text-slate-750 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {selectedSector.size} integrantes
                  </span>
                </div>
              </div>

              {/* Connected channels diagram simulation list */}
              <div className="space-y-1.5 pb-2">
                <span className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-600" /> Canais Operacionais de Ligação
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSector.connections.map((cId) => {
                    const matchedName = sectors.find(s => s.id === cId)?.name || cId;
                    return (
                      <span key={cId} className="bg-slate-50 text-[10px] px-2.5 py-1 rounded-md border border-slate-200 font-mono text-slate-500 flex items-center gap-1">
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
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>CONTATO DA DIRETORIA</span>
              <span>{selectedSector.email}</span>
            </div>

            {emailTriggered ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-700 font-bold font-mono animate-pulse flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Chamado aberto na caixa de {selectedSector.responsible}
              </div>
            ) : (
              <button
                onClick={() => handleSendEmailSimulate(selectedSector.email)}
                className="w-full py-3 rounded-xl border border-slate-250 hover:border-blue-500/35 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-mono text-slate-700 font-bold transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-amber-500" /> Enviar Chamado Interno Integrado
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
