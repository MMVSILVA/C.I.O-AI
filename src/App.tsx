import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, 
  Layers, 
  GitFork, 
  Network, 
  FileCheck, 
  Activity, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Smartphone, 
  FileText,
  BadgeCheck,
  Building,
  GraduationCap,
  Search,
  Bell,
  BookOpen,
  FolderOpen,
  ShieldCheck,
  AlertCircle
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

  // Dynamic alerts list
  const [toasts, setToasts] = useState<Array<{
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    category: string;
  }>>([]);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const addToast = (
    title: string, 
    message: string, 
    type: 'success' | 'info' | 'warning' | 'error' = 'info', 
    category = 'C.I.O AI'
  ) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, message, type, category }]);
    setTimeout(() => {
      removeToast(id);
    }, 8500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simulated background push notifications for real system activity (Wiki, Docs, BPM flows)
  useEffect(() => {
    if (!user) return;

    // Toast 1: Welcome tip after 3 seconds
    const t1 = setTimeout(() => {
      addToast(
        "Seja bem-vindo!", 
        `Olá, ${user.name.split(" ")[0]}. O seu onboarding da Firjan está 40% concluído! Vá na aba de Trilha para iniciar.`, 
        "info", 
        "Onboarding"
      );
    }, 3500);

    // Toast 2: Wiki update after 12 seconds
    const t2 = setTimeout(() => {
      addToast(
        "Wiki Corporativa Atualizada", 
        "O artigo 'Uso do ChatGeral e Privacidade da LGPD' recebeu uma revisão oficial do time de compliance.", 
        "success", 
        "Wiki"
      );
    }, 12000);

    // Toast 3: BPM Flow assigned after 25 seconds
    const t3 = setTimeout(() => {
      addToast(
        "Novo Fluxo BPM Atribuído", 
        "Você foi integrado ao circuito 'Solicitação de Suporte ao Usuário Firjan IA'. Verifique na aba BPM.", 
        "warning", 
        "BPM"
      );
    }, 25000);

    // Toast 4: Pending Document after 40 seconds
    const t4 = setTimeout(() => {
      addToast(
        "Documento Indexado", 
        "O arquivo PDF 'normativos_institucionais_firjan_2026.pdf' foi digitalizado e indexado com OCR para buscas cognitivas.", 
        "info", 
        "Documentos"
      );
    }, 40000);

    // Toast 5: Warning if MFA is disabled
    const t5 = setTimeout(() => {
      if (!user.mfaEnabled) {
        addToast(
          "Medida de Segurança Recomendada", 
          "Sua conta está sem autenticação de múltiplos fatores (MFA). Ative no perfil para obter seu selo de integridade e ganhar +100 XP adicionais!", 
          "error", 
          "Privacidade"
        );
      }
    }, 18000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [user]);

  // Dynamic multi-entity items matching
  const getFilteredItems = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const matches: Array<{
      id: string;
      name: string;
      type: 'Wiki Wiki' | 'Documento' | 'Setor' | 'Funcionalidade';
      icon: any;
      badgeColor: string;
      extra?: string;
      targetView: string;
      actionObj?: any;
    }> = [];

    // Search articles
    articles.forEach((a) => {
      if (a.title.toLowerCase().includes(query) || (a.content || "").toLowerCase().includes(query)) {
        matches.push({
          id: a.id,
          name: a.title,
          type: 'Wiki Wiki',
          icon: Layers,
          badgeColor: "bg-blue-600",
          extra: a.author || "Firjan IA",
          targetView: "wiki"
        });
      }
    });

    // Search documents
    documents.forEach((d) => {
      if (d.filename.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)) {
        matches.push({
          id: d.id,
          name: d.filename,
          type: 'Documento',
          icon: FileText,
          badgeColor: "bg-emerald-600",
          extra: d.category,
          targetView: "documents"
        });
      }
    });

    // Search sectors
    sectors.forEach((s) => {
      if (s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)) {
        matches.push({
          id: s.id,
          name: s.name,
          type: 'Setor',
          icon: Network,
          badgeColor: "bg-amber-600",
          extra: s.manager,
          targetView: "organogram"
        });
      }
    });

    // Search custom tabs / views
    const coreRoutes = [
      { name: "Assistente IA & Chat", desc: "Pergunte à inteligência artificial", view: "chat", icon: Cpu, color: "bg-[#003BD1]" },
      { name: "Trilha de Onboarding & XP", desc: "Atividades e metas lúdicas", view: "onboarding", icon: GraduationCap, color: "bg-[#003BD1]" },
      { name: "Fluxos BPM e Suporte", desc: "Circuitos operacionais", view: "flows", icon: GitFork, color: "bg-[#003BD1]" },
      { name: "Meu Perfil Corporativo", desc: "Certificado, PDF e MFA", view: "profile", icon: User, color: "bg-[#003BD1]" }
    ];

    coreRoutes.forEach((route) => {
      if (route.name.toLowerCase().includes(query) || route.desc.toLowerCase().includes(query)) {
        matches.push({
          id: `route-${route.view}`,
          name: route.name,
          type: 'Funcionalidade',
          icon: route.icon,
          badgeColor: route.color,
          extra: route.desc,
          targetView: route.view
        });
      }
    });

    return matches.slice(0, 6);
  };

  const handleSearchResultNavigation = (item: any) => {
    setView(item.targetView);
    setSearchQuery("");
    addToast(
      "Navegação Rápida",
      `Direcionado com sucesso para "${item.name}" na aba correspondente.`,
      "success",
      "Portal"
    );
  };

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
        console.error("Modo offline ou falha ao sincronizar sessão ativa.", e);
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Fallback
    }
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
    { id: "wiki", label: "Wiki Corporativa", icon: Layers },
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans relative">
      
      {/* Decorative ambient background lights */}
      <div className="fixed top-0 left-0 w-full h-[400px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,59,209,0.03),transparent)] pointer-events-none z-0" />
      
      {/* CORE WEB HEADER BAR (Light/Branded Theme) */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex justify-between items-center z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 md:hidden hover:bg-slate-50 rounded-lg border border-slate-200 transition-all text-slate-600 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#003BD1]" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setView('dashboard')}>
            {/* Custom vector stylized logo matching the requested attached logo mock */}
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm">
              <svg width="26" height="26" viewBox="0 0 100 100" className="drop-shadow-sm select-none">
                <defs>
                  <linearGradient id="cyberDropletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="40%" stopColor="#003BD1" />
                    <stop offset="75%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#00D2FF" />
                  </linearGradient>
                  <radialGradient id="nodeGlow" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </radialGradient>
                </defs>
                {/* Clockwise inward spiral starting from (76, 28) */}
                <path 
                  d="M 76 28 C 85 38, 85 58, 74 70 C 64 82, 40 82, 28 72 C 14 60, 14 38, 28 26 C 40 16, 64 16, 72 26 C 80 34, 80 54, 68 62 C 58 70, 44 70, 36 60 C 28 50, 30 36, 42 32 C 50 30, 58 36, 58 48 C 58 54, 52 58, 48 56" 
                  fill="none" 
                  stroke="url(#cyberDropletGrad)" 
                  strokeWidth="11" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                {/* Glowing cyan compass star centered at (78, 22) */}
                <path 
                  d="M 78 12 L 80.5 20.5 L 89 22 L 80.5 23.5 L 78 32 L 75.5 23.5 L 67 22 L 75.5 20.5 Z" 
                  fill="#00FFFF" 
                  opacity="0.95"
                />
                <circle cx="78" cy="22" r="2" fill="#FFFFFF" />
                {/* 3D Glossy Light-Blue core sphere with highlight */}
                <circle cx="48" cy="48" r="9" fill="url(#nodeGlow)" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-[#003BD1] font-sans">C.I.O AI</h1>
              <p className="text-[8px] tracking-[0.14em] font-mono text-slate-400 uppercase font-bold">Firjan Inteligência Corporativa</p>
            </div>
          </div>
        </div>

        {/* Quick Search Bar (Central Position) with real-time navigation across Docs, Wiki, Setores */}
        <div className="relative hidden md:block w-80">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full py-1.5 pl-8.5 pr-8 text-xs focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-sans text-slate-800"
              placeholder="Busca rápida de Wiki, OCR Docs, Setor..."
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); }}
                className="absolute right-3 top-2 hover:bg-slate-200 rounded-full p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Quick search dropdown matches */}
          {searchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-2 text-left animate-fade-in max-h-96 overflow-y-auto">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 font-mono">Resultados da Pesquisa</p>
              
              {getFilteredItems().length > 0 ? (
                <div className="space-y-1 mt-1">
                  {getFilteredItems().map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onMouseDown={() => handleSearchResultNavigation(item)}
                        className="w-full text-left p-2 hover:bg-slate-50 rounded-xl flex items-start gap-2.5 cursor-pointer transition-all border border-transparent hover:border-slate-100/50"
                      >
                        <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-white ${item.badgeColor}`}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-850 truncate">{item.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-[#003BD1] font-mono">
                            <span className="font-bold uppercase tracking-wider">{item.type}</span>
                            {item.extra && <span className="text-slate-400 truncate max-w-[200px]">({item.extra})</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 font-mono">Nenhum termo correspondente encontrado.</p>
              )}
            </div>
          )}
        </div>

        {/* Header Right profiles */}
        <div className="flex items-center gap-4">
          
          {/* Gamification progress pill */}
          <div 
            onClick={() => setView('onboarding')}
            className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-full cursor-pointer transition-all shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-600">
              {user.points} XP
            </span>
          </div>

          <div 
            onClick={() => setView('profile')}
            className="flex items-center gap-2.5 cursor-pointer p-0.5 pr-2.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-xs text-[#003BD1] uppercase font-mono overflow-hidden shrink-0 shadow-2xs">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 max-w-[124px] truncate flex items-center gap-1">
                {user.name.split(" ")[0]}
                {user.points >= 300 && <BadgeCheck className="w-4 h-4 text-[#003BD1] fill-[#003BD1]/10" />}
              </p>
              <p className="text-[9px] text-[#003BD1] font-mono uppercase tracking-widest font-bold">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div className="flex-1 flex relative z-10">
        
        {/* SIDEBAR: DESKTOP DRAWER */}
        <nav className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-slate-200 p-4 shrink-0 z-10 shadow-xs">
          <div className="space-y-6">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block ml-3 font-semibold">Navegação Principal</span>

            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComp = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? "bg-slate-50 border border-slate-200 text-[#003BD1] shadow-2xs" 
                        : "border border-transparent text-slate-600 hover:text-[#003BD1] hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-[#003BD1]' : 'text-slate-400'}`} />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[8px] font-mono bg-blue-550/10 text-[#003BD1] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border border-[#003BD1]/10">
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
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-[9px] text-slate-500">
              <p className="font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#003BD1]" /> Setor Ativo
              </p>
              <p className="truncate text-slate-700 font-semibold font-sans">
                {sectors.find(s => s.id === user.sectorId)?.name || "Buscando..."}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-mono text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all cursor-pointer border border-transparent hover:border-red-200/50"
            >
              <LogOut className="w-4 h-4 text-red-500" />
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
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-5 pt-20 flex flex-col justify-between z-35 md:hidden shadow-2xl"
            >
              <div className="space-y-6">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block ml-3 font-semibold">Destaques</span>

                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive 
                            ? "bg-slate-50 border border-slate-200 text-[#003BD1]" 
                            : "border border-transparent text-slate-600 hover:text-[#003BD1] hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-[#003BD1]' : 'text-slate-400'}`} />
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
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-mono text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN DYNAMIC VIEW PANE CONTAINER */}
        <main className="flex-1 p-6 overflow-y-auto relative z-10">
          <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {renderActiveView()}
          </div>
        </main>

      </div>

      {/* PWA FLOATING PROMPT PANEL */}
      {showPwaBanner && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-between gap-4 max-w-sm">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#003BD1]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 font-sans">C.I.O AI App</p>
              <p className="text-[10px] text-slate-500 leading-tight">Instale como aplicativo nativo em seu desktop ou celular.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pwaInstalled ? (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono uppercase px-2 py-1 rounded-lg border border-emerald-200 font-bold">
                Instalado ✓
              </span>
            ) : (
              <button 
                onClick={handlePwaInstallation}
                className="py-1.5 px-3 bg-[#003BD1] hover:bg-[#002cb3] text-white font-extrabold text-[10px] uppercase rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
              >
                Instalar
              </button>
            )}

            {/* User close option requested by the user */}
            <button 
              onClick={() => setShowPwaBanner(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
              title="Fechar Notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Toast notifications container */}
      <div id="toast-container" className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            let accentColor = "border-sky-500 bg-sky-50 text-sky-850";
            let sideBanner = "bg-sky-500";
            let IconToast = Bell;

            if (toast.type === "success") {
              accentColor = "border-emerald-250 bg-white text-slate-800";
              sideBanner = "bg-emerald-500";
              IconToast = ShieldCheck;
            } else if (toast.type === "warning") {
              accentColor = "border-amber-200 bg-white text-slate-800";
              sideBanner = "bg-amber-500";
              IconToast = AlertCircle;
            } else if (toast.type === "error") {
              accentColor = "border-red-200 bg-white text-slate-800";
              sideBanner = "bg-red-500";
              IconToast = AlertCircle;
            } else {
              accentColor = "border-blue-200 bg-white text-slate-800";
              sideBanner = "bg-blue-600";
              IconToast = Bell;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto border p-4 rounded-2xl shadow-xl flex items-start gap-3.5 relative overflow-hidden ${accentColor}`}
              >
                {/* Visual colored side stripes */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${sideBanner}`} />

                <div className="shrink-0 mt-0.5">
                  <IconToast className="w-5 h-5 text-slate-700" />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-[#003BD1] bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
                      {toast.category}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mt-1">{toast.title}</h5>
                  <p className="text-[11px] text-slate-650 leading-snug mt-0.5">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  title="Fechar Alerta"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
