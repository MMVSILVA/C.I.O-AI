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
    <div className="text-slate-800 font-sans space-y-6 animate-fade-in">
      
      {/* Upper stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Onboarding Welcome progress status (span 8) */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#003BD1] font-mono tracking-widest uppercase flex items-center gap-1 font-bold">
              <GraduationCap className="w-4 h-4" /> Trilha de Qualificação Continuada
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Evolução do Colaborador</h2>
            <p className="text-xs text-slate-500">Complete as tarefas lúdicas e trilhas interativas de treinamento técnico para liberar seu certificado.</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600 animate-bounce" />
                Pontos Ganhos: <strong className="text-slate-850 font-bold">{user.points} XP</strong>
              </span>
              <span className="text-emerald-600 font-bold">{user.onboardingProgress}% Concluído</span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full p-0.5 border border-slate-200 overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${user.onboardingProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic certificate card (span 4) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-slate-400 uppercase">Selo de Qualificação</span>
            <h4 className="text-xs font-extrabold text-slate-700 font-sans">Certificado Digital Firjan IA</h4>
          </div>

          {user.points >= 300 ? (
            <div className="my-3 text-center p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <Award className="w-10 h-10 text-emerald-600 mx-auto animate-pulse" />
              <p className="text-[10px] text-blue-800 font-mono uppercase tracking-widest font-bold">✓ CERTIFICADO GERADO</p>
              <p className="text-[9px] text-slate-500 leading-normal">Parabéns! {user.name} está verificado em conformidade de processos e segurança corporativa.</p>
            </div>
          ) : (
            <div className="my-3 text-center p-4 rounded-xl bg-slate-50/50 border border-slate-200/60 space-y-1.5 font-mono">
              <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-[10px] text-slate-500 font-mono uppercase font-bold">Bloqueado • 300 XP Necessários</p>
              <p className="text-[9px] text-slate-400 leading-normal">Faltam {Math.max(300 - user.points, 0)} pontos XP para emitir sua credencial digital corporativa.</p>
            </div>
          )}

          <div className="text-[8px] font-mono text-slate-400 flex justify-between select-none">
            <span>CHAVE: FIRJAN-SEC-ADMISS</span>
            <span>FIRJAN MATCH</span>
          </div>
        </div>

      </div>

      {/* Main Courseware viewport split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Course navigator module list (span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 p-4 rounded-xl space-y-4 shadow-xs">
          
          {/* Admissional Checklist */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-blue-600 uppercase block tracking-wider font-extrabold">Checklist Integrado Admissional</span>
            <div className="space-y-1.5 text-xs font-mono">
              {checklistTasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                    task.checked ? 'bg-emerald-600 text-white font-extrabold' : 'border border-slate-200 bg-transparent'
                  }`}>
                    {task.checked && "✓"}
                  </span>
                  <span className={task.checked ? 'line-through text-slate-400 font-mono' : 'text-slate-600'}>{task.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module courses tabs */}
          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-420px)] pr-1">
            <span className="text-[10px] font-mono text-emerald-600 uppercase block tracking-wider font-bold">Módulos Teóricos</span>
            
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod);
                  if (mod.lessons.length > 0) setActiveLesson(mod.lessons[0]);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between cursor-pointer ${
                  activeModule?.id === mod.id
                    ? "bg-blue-50/60 border-blue-200 shadow-2xs"
                    : "bg-slate-50/50 border-slate-200 hover:border-blue-200"
                }`}
              >
                <div className="min-w-0 pr-3 space-y-1">
                  <p className="font-semibold text-slate-700 line-clamp-1">{mod.title}</p>
                  <p className="text-[10px] text-slate-450 font-mono uppercase">{mod.duration} • {mod.category}</p>
                </div>
                <div className="shrink-0 flex items-center">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    mod.isCompleted ? 'bg-emerald-600 text-white font-extrabold' : 'border border-slate-300'
                  }`}>
                    {mod.isCompleted ? "✓" : "▶"}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Active lesson screen (span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
          {activeModule && activeLesson ? (
            <div className="space-y-5">
              
              {/* Header lesson */}
              <div className="pb-3 border-b border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                  <span className="text-blue-600 uppercase bg-blue-50 border border-blue-100 font-bold rounded px-1.5 py-0.5">MÓDULO SELECIONADO</span>
                  <span>{activeModule.duration} • {activeModule.category}</span>
                </div>
                <h3 className="text-md font-extrabold text-slate-800 mt-1">{activeModule.title}</h3>
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
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="truncate">{les.title}</span> {les.isCompleted && "✓"}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 min-h-36">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1 font-mono">
                    <PlayCircle className="w-4 h-4 text-emerald-600" />
                    {activeLesson.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify select-text">
                    {activeLesson.content}
                  </p>
                </div>
              </div>

              {/* Module complete trigger */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-blue-600 font-mono text-[10px] font-bold">RECOMPENSA: +25 XP POR AULA</span>

                {activeModule.lessons.find(l => l.id === activeLesson.id)?.isCompleted ? (
                  <span className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Aula Concluída sob Segurança
                  </span>
                ) : (
                  <button
                    onClick={() => handleCompleteLessonBtn(activeModule.id, activeLesson.id)}
                    className="px-5 py-2 rounded-lg bg-[#003BD1] hover:bg-[#002cb3] text-white text-xs font-extrabold font-mono uppercase tracking-wide transition-all cursor-pointer shadow-sm"
                  >
                    Marcar como lido e ganhar XP
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-12">
              <Rocket className="w-12 h-12 text-blue-500/20 mb-3 animate-pulse" />
              <p className="text-xs font-mono">Nenhum módulo selecionado na trilha de integração</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
