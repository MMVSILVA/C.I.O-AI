import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, 
  Layers, 
  GitFork, 
  Network, 
  FileCheck, 
  Activity, 
  Users, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Smartphone, 
  CheckSquare, 
  Tv, 
  FileText,
  BadgeCheck,
  Building,
  GraduationCap
} from "lucide-react";

import { UserProfile, Sector, DocumentMeta, WikiArticle } from "./types";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import DashboardView from "./components/DashboardView";
import ChatView from "./components/ChatView";
import WikiView from "./components/WikiView";
import FlowsView from "./components/FlowsView";
import OrganogramView from "./components/OrganogramView";
import DocsView from "./components/DocsView";
import OnboardingView from "./components/OnboardingView";
import AdminView from "./components/AdminView";
import ProfileView from "./components/ProfileView";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lists stored globally for synchronization
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [articles, setArticles] = useState<WikiArticle[]>([]);

  // PWA popup state
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // Fetch session on load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (e) {
        console.error("Modo offline / Falha ao buscar sessão corporativa.", e);
      }
    };
    fetchSession();
  }, [booting]);

  // Sync static entities
  const syncPlatformEntities = async () => {
    try {
      const resSectors = await fetch("/api/sectors");
      const dataSectors = await resSectors.json();
      if (dataSectors.sectors) setSectors(dataSectors.sectors);

      const resDocs = await fetch("/api/documents");
      const dataDocs = await resDocs.json();
      if (dataDocs.documents) setDocuments(dataDocs.documents);

      const resWiki = await fetch("/api/wiki");
      const dataWiki = await resWiki.json();
      if (dataWiki.articles) setArticles(dataWiki.articles);
    } catch (e) {
      console.error("Erro ao sincronizar entidades básicas.", e);
    }
  };

  useEffect(() => {
    if (user) {
      syncPlatformEntities();
    }
  }, [user, view]);

  const handleLogout = () => {
    setUser(null);
    setView("dashboard");
  };

  const handlePwaInstallation = () => {
    setPwaInstalled(true);
    setTimeout(() => {
      setShowPwaBanner(false);
    }, 2500);
  };

  // Switch View renderers
  const renderActiveView = () => {
    if (!user) return null;
    
    switch (view) {
      case "dashboard":
        return <DashboardView user={user} sectors={sectors} documents={documents} articles={articles} setView={setView} />;
      case "chat":
        return <ChatView user={user} />;
      case "wiki":
        return <WikiView user={user} sectors={sectors} />;
      case "flows":
        return <FlowsView user={user} />;
      case "organogram":
        return <OrganogramView sectors={sectors} />;
      case "documents":
        return <DocsView user={user} />;
      case "onboarding":
        return <OnboardingView user={user} onUserUpdate={setUser} />;
      case "admin":
        return <AdminView user={user} sectors={sectors} />;
      case "profile":
        return <ProfileView user={user} sectors={sectors} onUserUpdate={setUser} />;
      default:
        return <DashboardView user={user} sectors={sectors} documents={documents} articles={articles} setView={setView} />;
    }
  };

  if (booting) {
    return <SplashScreen onComplete={() => setBooting(false)} />;
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={setUser} />;
  }

  // Define sidebar navigation directories
  const navigationItems = [
    { id: "dashboard", label: "Painel Principal", icon: Activity },
    { id: "chat", label: "Assistente IA", icon: Cpu, badge: "GEMINI" },
    { id: "onboarding", label: "Trilha Onboarding", icon: GraduationCap },
    { id: "wiki", label: "Wiki Corporativo", icon: Layers },
    { id: "flows", label: "Fluxos BPM", icon: GitFork },
    { id: "organogram", label: "Mapa de Setores", icon: Network },
    { id: "documents", label: "Repositório OCR", icon: FileText },
    { id: "profile", label: "Meu Perfil", icon: User }
  ];

  // RBAC validation: allow Admin tools only for Gestores/Administradores
  if (user.role === 'Gestor' || user.role === 'Administrador' || user.role === 'Diretor') {
    navigationItems.push({ id: "admin", label: "Painel Sec & RBAC", icon: FileCheck });
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] flex flex-col font-sans relative">
      
      {/* Decorative ambient background lights */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.05),transparent)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-neutral-950/20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      {/* CORE WEB HEADER BAR */}
      <header className="sticky top-0 bg-[#0a0a0d]/80 backdrop-blur-md border-b border-[#1e1e24] px-6 py-4 flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 md:hidden hover:bg-white/5 rounded-lg border border-[#1e1e24] transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#10b981]" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004f9f] to-[#f29900] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,79,159,0.3)]">
              <span className="w-full h-full bg-[#050505] rounded-md flex items-center justify-center text-xs font-black text-[#3b82f6]">F</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">FIRJAN IA</h1>
              <p className="text-[8px] tracking-[0.2em] font-mono text-[#3b82f6] uppercase font-bold">Inteligência Artificial</p>
            </div>
          </div>
        </div>

        {/* Header Right profiles */}
        <div className="flex items-center gap-4">
          
          {/* Gamification progress pill */}
          <div 
            onClick={() => setView('onboarding')}
            className="hidden sm:flex items-center gap-2 bg-[#09090b]/90 hover:bg-[#121217] border border-[#1e1e24] py-1.5 px-3 rounded-full cursor-pointer transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-200">
              {user.points} XP
            </span>
          </div>

          <div 
            onClick={() => setView('profile')}
            className="flex items-center gap-2.5 cursor-pointer p-1 pr-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-[#1e1e24]"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-950/20 border border-[#1e1e24] flex items-center justify-center font-bold text-[11px] text-[#10b981] uppercase font-mono overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-200 max-w-[120px] truncate flex items-center gap-1.5 animate-fade-in">
                {user.name.split(" ")[0]}
                {user.points >= 300 && <BadgeCheck className="w-3.5 h-3.5 text-[#10b981]" />}
              </p>
              <p className="text-[9px] text-[#10b981] font-mono uppercase tracking-widest font-extrabold">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY WORKSPACE AREA */}
      <div className="flex-1 flex relative z-10">
        
        {/* SIDEBAR: DESKTOP DRAWER */}
        <nav className="hidden md:flex flex-col justify-between w-64 bg-[#070709]/65 border-r border-[#1e1e24] p-4 shrink-0 z-10">
          <div className="space-y-6">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block ml-3">Navegação Principal</span>

            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComp = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? "bg-blue-950/15 border border-blue-500/20 text-white shadow-[0_0_12px_rgba(59,130,246,0.06)]" 
                        : "border border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-[#10b981]' : 'text-blue-400'}`} />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[8px] font-mono bg-blue-950/40 text-[#10b981] uppercase tracking-wider font-extrabold px-1 rounded border border-[#10b981]/10">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {/* Direct sector label indicator */}
            <div className="p-3 bg-black/45 border border-[#1e1e24] rounded-xl space-y-1 font-mono text-[9px] text-gray-400">
              <p className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-400" /> Setor Ativo
              </p>
              <p className="truncate text-blue-200">
                {sectors.find(s => s.id === user.sectorId)?.name || "Buscando..."}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-mono text-neutral-400 hover:text-red-300 hover:bg-red-950/10 flex items-center gap-3 transition-all cursor-pointer border border-transparent hover:border-red-500/10"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Sair da Sessão
            </button>
          </div>
        </nav>

        {/* SIDEBAR: MOBILE OVERLAY DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0a0a0d] border-r border-[#1e1e24] p-5 pt-20 flex flex-col justify-between z-35 md:hidden shadow-2xl"
            >
              <div className="space-y-6">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block ml-3">Destaques</span>

                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                        className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          isActive 
                            ? "bg-blue-950/15 border border-blue-500/25 text-white" 
                            : "border border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/30"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-[#10b981]' : 'text-blue-400'}`} />
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-mono text-neutral-400 hover:text-red-350 hover:bg-red-950/10 flex items-center gap-3 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-450" />
                  Sair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN DYNAMIC VIEW PANE CONTAINER */}
        <main className="flex-1 p-6 overflow-y-auto select-none md:select-text relative z-10 animate-fade-in">
          <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {renderActiveView()}
          </div>
        </main>

      </div>

      {/* PWA FLOATING PROMPT PANEL */}
      {showPwaBanner && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-2xl bg-[#0b0b0e]/95 border border-[#1e1e24] backdrop-blur-md max-w-sm shadow-2xl flex items-center justify-between gap-4 animate-bounce">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 border border-[#10b981]/25 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-150 font-mono">Firjan IA PWA</p>
              <p className="text-[10px] text-gray-400">Instale como aplicativo nativo em seu desktop ou celular.</p>
            </div>
          </div>

          {pwaInstalled ? (
            <span className="bg-emerald-950/40 text-[#10b981] text-[10px] font-mono uppercase px-2 py-1 rounded-lg border border-[#10b981]/25">
              Instalado ✓
            </span>
          ) : (
            <button 
              onClick={handlePwaInstallation}
              className="py-1.5 px-3 bg-[#10b981] hover:bg-emerald-500 text-black font-extrabold text-[10px] uppercase rounded-lg transition-all cursor-pointer shadow-lg shrink-0"
            >
              Instalar
            </button>
          )}
        </div>
      )}

    </div>
  );
}
