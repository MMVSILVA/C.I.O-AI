import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  GitFork, 
  User, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Play, 
  Pause, 
  AlertCircle, 
  Shuffle, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { BusinessFlow, FlowStep, UserProfile } from "../types";

interface FlowsViewProps {
  user: UserProfile;
}

export default function FlowsView({ user }: FlowsViewProps) {
  const [flows, setFlows] = useState<BusinessFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<BusinessFlow | null>(null);

  const fetchFlows = async () => {
    try {
      const response = await fetch("/api/flows");
      const data = await response.json();
      if (data.flows) {
        setFlows(data.flows);
        if (!selectedFlow && data.flows.length > 0) {
          setSelectedFlow(data.flows[0]);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar fluxos BPM", e);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  // Interactively change step status simulating drag-and-drop or sequential progress
  const handleToggleStepStatus = (stepId: string) => {
    if (!selectedFlow) return;

    const updatedSteps = selectedFlow.steps.map(step => {
      if (step.id === stepId) {
        let nextStatus: FlowStep['status'] = 'Pendente';
        if (step.status === 'Pendente') nextStatus = 'Em Executando';
        else if (step.status === 'Em Executando') nextStatus = 'Concluido';
        else if (step.status === 'Concluido') nextStatus = 'Pendente';

        return { ...step, status: nextStatus };
      }
      return step;
    });

    const updatedFlow = { ...selectedFlow, steps: updatedSteps };
    
    setSelectedFlow(updatedFlow);
    setFlows(prev => prev.map(f => f.id === selectedFlow.id ? updatedFlow : f));
  };

  return (
    <div className="text-white font-sans grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      
      {/* Sidebar - Flows selection */}
      <div className="lg:col-span-4 bg-[#0a0f21]/60 border border-white/5 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#00FFB2] flex items-center gap-1.5 mb-4">
            <GitFork className="w-4 h-4 text-[#00FFB2]" />
            Processos BPM Ativos
          </h3>

          <div className="space-y-2.5">
            {flows.map((flow) => (
              <button
                key={flow.id}
                onClick={() => setSelectedFlow(flow)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex justify-between cursor-pointer ${
                  selectedFlow?.id === flow.id
                    ? "bg-blue-950/20 border-blue-500/40"
                    : "bg-[#050505]/40 border-white/5 hover:border-blue-500/20"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-200">{flow.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[200px]">{flow.description}</p>
                </div>
                <div className="flex flex-col items-end shrink-0 gap-1 justify-center">
                  <span className="text-[8px] uppercase tracking-wider font-mono font-bold bg-blue-900/40 text-blue-200 px-1.5 py-0.5 rounded border border-blue-500/10">
                    {flow.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-950/10 border border-blue-500/10 rounded-xl text-[10px] font-mono text-gray-400">
          <p className="flex items-center gap-1 text-blue-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> DICA DE MODELAGEM
          </p>
          <p className="mt-1 leading-relaxed">
            Clique nos círculos de status de cada bloco do fluxograma para simular mudança no status e progredir as tarefas do processo!
          </p>
        </div>
      </div>

      {/* BPM Diagram Panel */}
      <div className="lg:col-span-8 bg-[#0a0f21]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between overflow-y-auto h-full">
        {selectedFlow ? (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="border-b border-white/5 pb-4 space-y-1">
              <h2 className="text-xl font-extrabold text-gray-100">{selectedFlow.name}</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">{selectedFlow.description}</p>
            </div>

            {/* FLOW PIPELINE FLOWCHART BLOCKS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {selectedFlow.steps.map((step, idx) => {
                
                // Color formatting based on status
                let statusColor = "border-gray-700 bg-gray-900/50 text-gray-400";
                let statusBadge = "Pendente";
                if (step.status === 'Em Executando') {
                  statusColor = "border-blue-500 bg-blue-950/20 text-[#00FFB2] shadow-[0_0_10px_rgba(59,130,246,0.2)]";
                  statusBadge = "Executando";
                } else if (step.status === 'Concluido') {
                  statusColor = "border-[#00FFB2] bg-emerald-950/20 text-[#00FFB2]";
                  statusBadge = "Concluído";
                }

                return (
                  <div key={step.id} className="relative flex flex-col items-center">
                    
                    {/* Inter-node connector line */}
                    {idx < selectedFlow.steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 -right-5 w-10 h-0.5 border-t border-dashed border-white/20 z-0 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-gray-600 -mt-1.5" />
                      </div>
                    )}

                    {/* Step Card block */}
                    <div className={`w-full p-4 rounded-xl border backdrop-blur-md flex flex-col justify-between h-44 z-10 transition-all ${statusColor}`}>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono uppercase bg-black/40 text-gray-400 py-0.5 px-1.5 rounded">
                            Etapa {idx + 1}
                          </span>

                          {/* Clickable Status Ring */}
                          <button
                            onClick={() => handleToggleStepStatus(step.id)}
                            title="Alterar Status"
                            className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-mono cursor-pointer transition-all hover:scale-115 ${
                              step.status === 'Concluido' ? 'bg-[#00FFB2] text-black border-[#00FFB2]' :
                              step.status === 'Em Executando' ? 'bg-blue-500 text-white border-blue-500 animate-pulse' :
                              'bg-transparent text-gray-500 border-gray-600'
                            }`}
                          >
                            {step.status === 'Concluido' ? "✓" : "▶"}
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-gray-100 line-clamp-1">{step.title}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-3 leading-relaxed font-mono">{step.description}</p>
                      </div>

                      {/* Footer specs */}
                      <div className="pt-2 border-t border-white/5 grid grid-cols-2 text-[9px] font-mono text-gray-400">
                        <span className="flex items-center gap-1 truncate" title={step.responsible}>
                          <User className="w-3 h-3 text-blue-400" /> {step.responsible.split(" ")[0]}
                        </span>
                        <span className="flex items-center gap-1 justify-end text-gray-400">
                          <Clock className="w-3 h-3 text-[#00FFB2]" /> {step.durationExpected}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subordinates & workflow parameters */}
            <div className="p-4 bg-[#050505]/45 border border-white/5 rounded-xl space-y-3 font-mono text-xs text-gray-300">
              <h4 className="text-xs font-bold text-gray-100 uppercase tracking-widest text-[#00FFB2]">Resumo Operacional</h4>
              <p className="leading-relaxed text-[11px]">
                Este fluxo representa a cadeia de valor regulada pelo setor. Todo desvio operacional ou exceção deve ser documentado em anexo no repositório OCR correspondente para fins de integridade e auditoria com selo RGPD.
              </p>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-12">
            <AlertCircle className="w-12 h-12 text-blue-400/20 mb-3" />
            <p className="text-xs font-mono">Nenhum fluxograma BPM carregado</p>
          </div>
        )}
      </div>

    </div>
  );
}
