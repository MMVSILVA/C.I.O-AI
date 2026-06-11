import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Rocket, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Trophy, 
  ChevronRight, 
  Activity, 
  ShieldAlert, 
  GraduationCap,
  PlayCircle
} from "lucide-react";
import { OnboardingModule, UserProfile } from "../types";

interface OnboardingViewProps {
  user: UserProfile;
  onUserUpdate: (u: UserProfile) => void;
}

export default function OnboardingView({ user, onUserUpdate }: OnboardingViewProps) {
  const [modules, setModules] = useState<OnboardingModule[]>([]);
  const [activeModule, setActiveModule] = useState<OnboardingModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ id: string; title: string; content: string } | null>(null);

  const fetchOnboarding = async () => {
    try {
      const response = await fetch("/api/onboarding");
      const data = await response.json();
      if (data.modules) {
        setModules(data.modules);
        if (!activeModule && data.modules.length > 0) {
          // Select first incomplete module
          const firstIncomplete = data.modules.find((m: any) => !m.isCompleted) || data.modules[0];
          setActiveModule(firstIncomplete);
          if (firstIncomplete.lessons.length > 0) {
            setActiveLesson(firstIncomplete.lessons[0]);
          }
        }
      }
    } catch (e) {
      console.error("Falha ao receber trilhas de onboarding.", e);
    }
  };

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const handleCompleteLessonBtn = async (moduleId: string, lessonId: string) => {
    try {
      const response = await fetch("/api/onboarding/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, lessonId })
      });
      const data = await response.json();
      if (data.success) {
        // Broadcast profile update to App.tsx
        onUserUpdate(data.user);
        
        // Refresh modules to sync completion graphics
        const updatedModulesResponse = await fetch("/api/onboarding");
        const modData = await updatedModulesResponse.json();
        if (modData.modules) {
          setModules(modData.modules);
          
          // Keep current view states active
          const currentMod = modData.modules.find((m: any) => m.id === moduleId);
          if (currentMod) {
            setActiveModule(currentMod);
            // Advance active lesson automatically if the completed one is matching
            const currentLessonIndex = currentMod.lessons.findIndex((l: any) => l.id === lessonId);
            if (currentLessonIndex !== -1 && currentLessonIndex + 1 < currentMod.lessons.length) {
              setActiveLesson(currentMod.lessons[currentLessonIndex + 1]);
            } else {
              // Highlight completed lesson
              const match = currentMod.lessons.find((l: any) => l.id === lessonId);
              if (match) setActiveLesson(match);
            }
          }
        }
      }
    } catch {
      console.error("Erro ao computar aula cumprida.");
    }
  };

  // Checklist of onboarding tasks
  const checklistTasks = [
    { text: "Criar perfil na Firjan IA e cadastrar cargo", checked: true },
    { text: "Ativar MFA complementar (Segurança TI)", checked: user.mfaEnabled },
    { text: "Falar com Assistente IA (Chat) sobre 'Firjan'", checked: user.points > 100 },
    { text: "Atingir 300 pontos de gamificação", checked: user.points >= 300 }
  ];

  return (
    <div className="text-[#f4f4f5] font-sans space-y-6 animate-fade-in">
      
      {/* Upper stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Onboarding Welcome progress status (span 8) */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-gradient-to-br from-[#0c142c]/95 to-[#0a0d16]/70 border border-[#1e293b] flex flex-col justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] text-[#10b981] font-mono tracking-widest uppercase flex items-center gap-1 font-bold">
              <GraduationCap className="w-4 h-4" /> Trilha de Qualificação Continuada
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Evolução do Colaborador</h2>
            <p className="text-xs text-neutral-400">Complete as tarefas lúdicas e trilhas interativas de treinamento técnico para liberar seu certificado.</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#10b981] animate-bounce" />
                Pontos Ganhos: <strong className="text-white font-bold">{user.points} XP</strong>
              </span>
              <span className="text-[#10b981] font-bold">{user.onboardingProgress}% Concluído</span>
            </div>

            <div className="w-full h-3 bg-black rounded-full p-0.5 border border-[#1e293b] overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#10b981]"
                initial={{ width: 0 }}
                animate={{ width: `${user.onboardingProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic certificate card (span 4) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#0a0f21]/90 border border-[#1e293b] flex flex-col justify-between backdrop-blur-md relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-neutral-500 uppercase">Selo de Qualificação</span>
            <h4 className="text-xs font-extrabold text-neutral-200 font-sans">Certificado Digital Firjan IA</h4>
          </div>

          {user.points >= 300 ? (
            <div className="my-3 text-center p-3 rounded-xl bg-blue-950/15 border border-blue-500/15 space-y-2">
              <Award className="w-10 h-10 text-[#10b981] mx-auto animate-pulse" />
              <p className="text-[10px] text-blue-200 font-mono uppercase tracking-widest font-bold">✓ CERTIFICADO GERADO</p>
              <p className="text-[9px] text-neutral-400 leading-normal">Parabéns! {user.name} está verificado em conformidade de processos e segurança corporativa.</p>
            </div>
          ) : (
            <div className="my-3 text-center p-4 rounded-xl bg-black/40 border border-[#1e293b] space-y-1.5 font-mono">
              <GraduationCap className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-[10px] text-neutral-500 font-mono uppercase font-bold">Bloqueado • 300 XP Necessários</p>
              <p className="text-[9px] text-neutral-600 leading-normal">Faltam {Math.max(300 - user.points, 0)} pontos XP para emitir sua credencial digital corporativa.</p>
            </div>
          )}

          <div className="text-[8px] font-mono text-neutral-500 flex justify-between select-none">
            <span>CHAVE: FIRJAN-SEC-ADMISS</span>
            <span>FIRJAN MATCH</span>
          </div>
        </div>

      </div>

      {/* Main Courseware viewport split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Course navigator module list (span 5) */}
        <div className="lg:col-span-5 bg-[#0a0f21]/90 border border-[#1e293b] p-4 rounded-xl space-y-4 backdrop-blur-md shadow-xl">
          
          {/* Admissional Checklist */}
          <div className="p-3 bg-black border border-[#1e293b] rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-blue-300 uppercase block tracking-wider font-extrabold">Checklist Integrado Admissional</span>
            <div className="space-y-1.5 text-xs font-mono">
              {checklistTasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                    task.checked ? 'bg-[#10b981] text-black font-extrabold' : 'border border-[#1e293b] bg-transparent'
                  }`}>
                    {task.checked && "✓"}
                  </span>
                  <span className={task.checked ? 'line-through text-neutral-500 font-mono' : 'text-neutral-300'}>{task.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module courses tabs */}
          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-420px)] pr-1">
            <span className="text-[10px] font-mono text-[#10b981] uppercase block tracking-wider font-bold">Módulos Teóricos</span>
            
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod);
                  if (mod.lessons.length > 0) setActiveLesson(mod.lessons[0]);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between cursor-pointer ${
                  activeModule?.id === mod.id
                    ? "bg-blue-950/15 border-blue-500/25 shadow-sm"
                    : "bg-black/30 border-[#1e293b] hover:border-blue-500/15"
                }`}
              >
                <div className="min-w-0 pr-3 space-y-1">
                  <p className="font-semibold text-neutral-200 line-clamp-1">{mod.title}</p>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase">{mod.duration} • {mod.category}</p>
                </div>
                <div className="shrink-0 flex items-center">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    mod.isCompleted ? 'bg-[#10b981] text-black font-extrabold' : 'border border-neutral-600'
                  }`}>
                    {mod.isCompleted ? "✓" : "▶"}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Active lesson screen (span 7) */}
        <div className="lg:col-span-7 bg-[#0a0f21]/90 border border-[#1e293b] p-6 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-xl">
          {activeModule && activeLesson ? (
            <div className="space-y-5">
              
              {/* Header lesson */}
              <div className="pb-3 border-b border-[#1e293b] space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500">
                  <span className="text-blue-300 uppercase bg-blue-950/20 border border-blue-500/15 font-bold rounded px-1.5 py-0.5">MÓDULO SELECIONADO</span>
                  <span>{activeModule.duration} • {activeModule.category}</span>
                </div>
                <h3 className="text-md font-extrabold text-white mt-1">{activeModule.title}</h3>
              </div>

              {/* Lesson body structure */}
              <div className="space-y-4">
                
                {/* Module lessons tabs */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {activeModule.lessons.map(les => (
                    <button
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      className={`py-1.5 px-2 rounded-lg border text-[10px] font-mono text-center cursor-pointer transition-all ${
                        activeLesson.id === les.id
                          ? "border-[#10b981] bg-emerald-950/15 text-[#10b981] font-bold"
                          : "border-[#1e293b] bg-black/40 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{les.title}</span> {les.isCompleted && "✓"}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-black border border-[#1e293b] rounded-xl space-y-2 min-h-36">
                  <h4 className="text-xs font-bold text-neutral-150 flex items-center gap-1 font-mono">
                    <PlayCircle className="w-4 h-4 text-[#10b981]" />
                    {activeLesson.title}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans text-justify select-text">
                    {activeLesson.content}
                  </p>
                </div>
              </div>

              {/* Module complete trigger */}
              <div className="pt-4 border-t border-[#1e293b] flex justify-between items-center text-xs">
                <span className="text-blue-300 font-mono text-[10px] font-bold">RECOMPENSA: +25 XP POR AULA</span>

                {activeModule.lessons.find(l => l.id === activeLesson.id)?.isCompleted ? (
                  <span className="text-[#10b981] text-xs font-mono font-bold flex items-center gap-1 bg-emerald-950/15 p-2 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" /> Aula Concluída sob Segurança
                  </span>
                ) : (
                  <button
                    onClick={() => handleCompleteLessonBtn(activeModule.id, activeLesson.id)}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 text-xs font-extrabold font-mono uppercase tracking-wide transition-all cursor-pointer shadow-md"
                  >
                    Marcar como lido e ganhar XP
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-550 py-12">
              <Rocket className="w-12 h-12 text-blue-450/20 mb-3 animate-pulse" />
              <p className="text-xs font-mono">Nenhum módulo selecionado na trilha de integração</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
