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
  PlayCircle,
  Calendar,
  Download,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle,
  Briefcase
} from "lucide-react";
import { OnboardingModule, UserProfile } from "../types";

interface OnboardingViewProps {
  user: UserProfile;
  onUserUpdate: (u: UserProfile) => void;
}

interface OnboardingEvent {
  id: string;
  title: string;
  type: "meeting" | "training" | "deliverable";
  dateFormatted: string; // e.g. "16 Jun 2026 às 14:00"
  location: string;
  duration: string;
  description: string;
  startDateICS: string; // YYYYMMDDTHHMMSS
  endDateICS: string; // YYYYMMDDTHHMMSS
  pointsReward?: number;
}

const ONBOARDING_EVENTS: OnboardingEvent[] = [
  {
    id: "evt-integration-meeting",
    title: "Reunião Geral de Integração institucional (DHR)",
    type: "meeting",
    dateFormatted: "15 de Junho, 2026 às 10:00",
    location: "Auditório Central do DHR ou Sala Virtual Teams",
    duration: "1h 30m",
    description: "Boas-vindas oficial do Sistema Firjan com apresentação da diretoria, dinâmica de RH integradora, plano de cargos e esclarecimento sobre benefícios e convênios.",
    startDateICS: "20260615T100000",
    endDateICS: "20260615T113000",
    pointsReward: 50
  },
  {
    id: "evt-cybersecurity",
    title: "Painel Obrigatório: Cibersegurança & MFA Complementar (DTI)",
    type: "training",
    dateFormatted: "18 de Junho, 2026 às 14:00",
    location: "Plataforma de Capacitações Virtuais (DTI)",
    duration: "2h 00m",
    description: "Palestra técnica corporativa de segurança da informação. Abordagem prática sobre inteligência artificial, regras do portal, cibersegurança lógica e ativação do MFA.",
    startDateICS: "20260618T140000",
    endDateICS: "20260618T160000",
    pointsReward: 40
  },
  {
    id: "evt-deliver-docs",
    title: "Meta de Entrega: Homologação de Documentos de Compliance",
    type: "deliverable",
    dateFormatted: "20 de Junho, 2026 às 23:59",
    location: "Central de Serviços de Gente (DHR Portal)",
    duration: "Prazo Final",
    description: "Envio obrigatório de documentações contratuais admissionais pendentes, termo de sigilo de dados (LGPD) assinado e cadastro de dependentes diretos.",
    startDateICS: "20260620T235900",
    endDateICS: "20260621T000000"
  },
  {
    id: "evt-ethics-compliance",
    title: "Treinamento Regulamentar: Ética e Conduta de Negócios (DFI/DEC)",
    type: "training",
    dateFormatted: "23 de Junho, 2026 às 09:00",
    location: "Arena de Eventos Corporativos (Sede RJ) / Teams",
    duration: "2h 00m",
    description: "Apresentação do código de integridade, prevenção a desvios, transparência na elaboração de estudos macroeconômicos da indústria e prestação de contas fiscais.",
    startDateICS: "20260623T090000",
    endDateICS: "20260623T110000",
    pointsReward: 40
  },
  {
    id: "evt-milestone-cert",
    title: "Feedback & Emissão do Selo de Integração Firjan IA",
    type: "deliverable",
    dateFormatted: "30 de Junho, 2026 às 17:00",
    location: "Plataforma Educacional Integrada C.I.O",
    duration: "Encontro Síncrono",
    description: "Avaliação coletiva dos módulos cumpridos, verificação final dos pontos XP conquistados e download do certificado digital de conformidade homologado.",
    startDateICS: "20260630T170000",
    endDateICS: "20260630T173000"
  }
];

export default function OnboardingView({ user, onUserUpdate }: OnboardingViewProps) {
  const [modules, setModules] = useState<OnboardingModule[]>([]);
  const [activeModule, setActiveModule] = useState<OnboardingModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ id: string; title: string; content: string } | null>(null);
  const [currentTab, setCurrentTab] = useState<"trilha" | "calendario">("trilha");
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<OnboardingEvent>(ONBOARDING_EVENTS[0]);
  const [syncedEvents, setSyncedEvents] = useState<string[]>([]);

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

  // Trigger download of a single .ics calendar invite
  const handleSingleEventICS = (event: OnboardingEvent) => {
    const cleanTitle = event.title.replace(/[\n\r]/g, " ");
    const cleanDesc = event.description.replace(/[\n\r]/g, " ");
    const cleanLoc = event.location.replace(/[\n\r]/g, " ");
    
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sistema Firjan//C.I.O AI Onboarding//PT",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${event.id}-${Date.now()}@firjan.com.br`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${event.startDateICS}`,
      `DTEND:${event.endDateICS}`,
      `SUMMARY:${cleanTitle}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLoc}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "DESCRIPTION:Lembrete de Onboarding Firjan",
      "ACTION:DISPLAY",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const icsContent = icsLines.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    
    const slug = event.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
      
    link.download = `evento-firjan-${slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update synced local state
    if (!syncedEvents.includes(event.id)) {
      setSyncedEvents(prev => [...prev, event.id]);
    }
  };

  // Batch download all calendar events into a single .ics file
  const handleBatchEventsICS = () => {
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sistema Firjan//C.I.O AI Onboarding//PT",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    ONBOARDING_EVENTS.forEach((event, idx) => {
      const cleanTitle = event.title.replace(/[\n\r]/g, " ");
      const cleanDesc = event.description.replace(/[\n\r]/g, " ");
      const cleanLoc = event.location.replace(/[\n\r]/g, " ");

      icsLines.push(
        "BEGIN:VEVENT",
        `UID:${event.id}-${idx}@firjan.com.br`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${event.startDateICS}`,
        `DTEND:${event.endDateICS}`,
        `SUMMARY:${cleanTitle}`,
        `DESCRIPTION:${cleanDesc}`,
        `LOCATION:${cleanLoc}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "BEGIN:VALARM",
        "TRIGGER:-PT15M",
        "DESCRIPTION:Lembrete de Onboarding Firjan",
        "ACTION:DISPLAY",
        "END:VALARM",
        "END:VEVENT"
      );
    });

    icsLines.push("END:VCALENDAR");

    const icsContent = icsLines.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "cronograma-completo-onboarding-firjan.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Sync all
    setSyncedEvents(ONBOARDING_EVENTS.map(e => e.id));
  };

  // Checklist of onboarding tasks
  const checklistTasks = [
    { text: "Criar perfil na Firjan IA e cadastrar cargo", checked: true },
    { text: "Ativar MFA complementar (Segurança TI)", checked: user.mfaEnabled },
    { text: "Falar com Assistente IA (Chat) sobre 'Firjan'", checked: user.points > 100 },
    { text: "Atingir 300 pontos de gamificação", checked: user.points >= 300 }
  ];

  return (
    <div className="text-slate-800 font-sans space-y-6 animate-fade-in pb-10">
      
      {/* Upper stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Onboarding Welcome progress status (span 8) */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#003BD1] font-mono tracking-widest uppercase flex items-center gap-1 font-bold">
              <GraduationCap className="w-4 h-4" /> Trilha de Qualificação Continuada
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Evolução do Colaborador</h2>
                <p className="text-xs text-slate-500 mt-0.5">Complete as tarefas lúdicas e trilhas interativas de treinamento técnico para liberar seu certificado.</p>
              </div>
              
              {/* Inner tab switcher for modern navigation */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-xs self-start shrink-0">
                <button
                  onClick={() => setCurrentTab("trilha")}
                  className={`py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                    currentTab === "trilha"
                      ? "bg-white text-[#003BD1] shadow-2xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-705"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Trilha
                </button>
                <button
                  onClick={() => setCurrentTab("calendario")}
                  className={`py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                    currentTab === "calendario"
                      ? "bg-white text-[#003BD1] shadow-2xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-750"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  Calendário
                </button>
              </div>
            </div>
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

      {currentTab === "trilha" ? (
        /* ================= TAB 1: THE STANDARD COMPLIANCE TRILHA ================= */
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
      ) : (
        /* ================= TAB 2: PORTUGUESE CALRENDAR COMPONENT WITH BATCH ICS DOWNLOAD ================= */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Feed list of events (span 6) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-md font-sans font-black text-slate-800">Cronograma de Onboarding Firjan</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Datas-limite, reuniões gerais e palestras obrigatórias do Sistema Firjan.</p>
                </div>
                
                {/* Batch Download button */}
                <button
                  type="button"
                  onClick={handleBatchEventsICS}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-[#003BD1] text-white rounded-lg text-[10px] uppercase tracking-wider font-extrabold font-mono items-center gap-1.5 flex transition-all cursor-pointer shadow-3xs"
                  title="Salvar todos os compromissos em seu calendário pessoal de uma só vez"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  Sincronizar Geral (.ics)
                </button>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {ONBOARDING_EVENTS.map(event => {
                  const isSelected = selectedCalendarEvent.id === event.id;
                  const isSynced = syncedEvents.includes(event.id);
                  
                  // Color codes
                  let typeTheme = "bg-blue-50 text-[#003BD1] border-blue-200";
                  if (event.type === "training") {
                    typeTheme = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  } else if (event.type === "deliverable") {
                    typeTheme = "bg-rose-50 text-rose-700 border-rose-200";
                  }

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedCalendarEvent(event)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                        isSelected 
                          ? "bg-[#003BD1]/5 border-[#003BD1] shadow-2xs" 
                          : "bg-slate-50/50 border-slate-200 hover:border-slate-350"
                      }`}
                    >
                      {/* Left indicator tag badge */}
                      <span className={`px-2.5 py-2 rounded-xl text-center self-start border grid grid-cols-1 font-bold shrink-0 ${typeTheme}`}>
                        <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold">{event.type}</span>
                      </span>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-extrabold text-slate-800 leading-tight truncate">
                            {event.title}
                          </h4>
                          {isSynced && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 font-mono font-bold px-1.5 rounded-md flex items-center gap-0.5 shrink-0">
                              ✓ Salvo
                            </span>
                          )}
                        </div>
                        
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {event.dateFormatted} ({event.duration})
                        </p>
                        
                        <p className="text-[10.5px] text-slate-500 line-clamp-1 leading-normal font-sans">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-150 text-[10px] text-slate-400 font-mono leading-relaxed flex items-center gap-1 mr-2.5">
              <span className="text-amber-500">💡</span>
              Ao sincronizar os arquivos, use seu cliente de calendário pessoal (Outlook, Google Agenda, Apple Calendar) para importar o arquivo download.
            </div>
          </div>

          {/* Event description & individual download detail block (span 6) */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
            <div className="space-y-5">
              <span className="text-[10px] font-mono tracking-widest font-black text-[#003BD1] uppercase p-1 bg-white border border-slate-200 rounded self-start inline-block">
                🔍 Evento em Destaque
              </span>

              <div className="space-y-2">
                <span className={`px-2.5 py-0.5 text-[9px] uppercase font-mono font-black rounded-full border inline-block ${
                  selectedCalendarEvent.type === "meeting" 
                    ? "bg-blue-50 text-[#003BD1] border-blue-200" 
                    : selectedCalendarEvent.type === "training" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  {selectedCalendarEvent.type === "meeting" ? "Reunião de Integração" : selectedCalendarEvent.type === "training" ? "Treinamento Obrigatório" : "Entrega de Compliance"}
                </span>

                <h3 className="text-lg font-black text-slate-800 leading-tight">
                  {selectedCalendarEvent.title}
                </h3>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3.5 text-xs text-slate-650">
                <p className="leading-relaxed font-sans text-justify text-slate-600 select-text">
                  {selectedCalendarEvent.description}
                </p>

                <div className="border-t border-slate-100 pt-3.5 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span><strong>Programação:</strong> {selectedCalendarEvent.dateFormatted} ({selectedCalendarEvent.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span><strong>Local / Ferramenta:</strong> {selectedCalendarEvent.location}</span>
                  </div>
                  {selectedCalendarEvent.pointsReward && (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <Trophy className="w-4 h-4 text-emerald-600 shrink-0 shrink-0" />
                      <span>Selo de Gamificação: +{selectedCalendarEvent.pointsReward} XP por comparecer</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-5">
              <button
                type="button"
                onClick={() => handleSingleEventICS(selectedCalendarEvent)}
                className="w-full py-3.5 bg-[#003BD1] hover:bg-[#002cb3] text-white font-extrabold text-xs tracking-wider rounded-xl uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4.5 h-4.5 text-white" />
                Adicionar Evento ao Calendário pessoal (.ics)
              </button>

              <p className="text-center text-[10px] text-slate-400 font-mono">
                UID Identificação: {selectedCalendarEvent.id}@firjan.com.br
              </p>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
