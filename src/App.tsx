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
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  HelpCircle
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
import AppLogo from "./components/AppLogo";

const DEFAULT_SECTORS: Sector[] = [
  {
    id: "sec-dir",
    name: "Diretoria Geral",
    responsible: "Renato Albuquerque",
    roleDescription: "Administração estratégica, governança corporativa e expansão do Sistema Firjan.",
    email: "diretoria@firjan.com.br",
    connections: ["sec-ti", "sec-rh", "sec-fin", "sec-dec", "sec-ddi"],
    size: 5
  },
  {
    id: "sec-ti",
    name: "Tecnologia da Informação (DTI)",
    responsible: "Carlos Henrique",
    roleDescription: "Infraestrutura de nuvem, segurança corporativa, desenvolvimento e suporte tecnológico para o Sistema Firjan.",
    parentId: "sec-dir",
    connections: ["sec-rh", "sec-fin", "sec-ist"],
    email: "ti@firjan.com.br",
    size: 24
  },
  {
    id: "sec-rh",
    name: "Gente & Recursos Humanos (DHR)",
    responsible: "Mariana Costa",
    roleDescription: "Gestão operacional de pessoas, integração de novatos (onboarding), capacitação continuada e planos de carreira.",
    parentId: "sec-dir",
    connections: ["sec-ti", "sec-geb", "sec-dep"],
    email: "rh@firjan.com.br",
    size: 12
  },
  {
    id: "sec-fin",
    name: "Financeiro & Custos (DFI)",
    responsible: "Claudio Guedes",
    roleDescription: "Controle orçamentário, prestação de contas, faturamento, auditoria fiscal e reembolso de viagens corporativas.",
    parentId: "sec-dir",
    connections: ["sec-ti", "sec-dir"],
    email: "financeiro@firjan.com.br",
    size: 8
  },
  {
    id: "sec-dec",
    name: "Departamento de Inteligência Industrial (DEC)",
    responsible: "Juliana Mendes",
    roleDescription: "Estudos econômicos, levantamento de índices industriais, pesquisas do estado do RJ e sondagens setoriais.",
    parentId: "sec-dir",
    connections: ["sec-dir", "sec-ddi"],
    email: "dec@firjan.com.br",
    size: 14
  },
  {
    id: "sec-ddi",
    name: "Defesa de Interesses Industriais (DDI)",
    responsible: "Rodrigo Carvalho",
    roleDescription: "Representatividade empresarial, articulação com órgãos públicos, fomento da sustentabilidade e defesa de interesses da indústria.",
    parentId: "sec-dir",
    connections: ["sec-dir", "sec-dec"],
    email: "ddi@firjan.com.br",
    size: 10
  },
  {
    id: "sec-geb",
    name: "Educação Básica (SESI - GEB)",
    responsible: "Ana Teresa Vieira",
    roleDescription: "Gerência geral escolar da rede de Escolas SESI, voltada ao ensino fundamental, médio e desenvolvimento socioeducativo.",
    parentId: "sec-rh",
    connections: ["sec-rh", "sec-sst", "sec-dep"],
    email: "educacao-sesi@firjan.com.br",
    size: 45
  },
  {
    id: "sec-sst",
    name: "Saúde Ocupacional & Segurança (SESI - SST)",
    responsible: "Dr. Marcelo Neves",
    roleDescription: "Serviços em segurança e saúde do trabalho (SST) para as indústrias associadas e colaboradores internos.",
    parentId: "sec-rh",
    connections: ["sec-rh", "sec-geb"],
    email: "sst-sesi@firjan.com.br",
    size: 30
  },
  {
    id: "sec-ist",
    name: "Institutos SENAI de Tecnologia (SENAI - IST)",
    responsible: "Eng. Patricia Souza",
    roleDescription: "P&D, consultoria técnica especializada e ensaios laboratoriais metrológicos focados na competitividade da indústria.",
    parentId: "sec-ti",
    connections: ["sec-ti", "sec-dep"],
    email: "ist-senai@firjan.com.br",
    size: 28
  },
  {
    id: "sec-dep",
    name: "Educação Profissional (SENAI - DEP)",
    responsible: "Prof. Marcos Andrade",
    roleDescription: "Direcionamento pedagógico de cursos técnicos de aprendizagem profissional e industrial para jovens e adultos do RJ.",
    parentId: "sec-rh",
    connections: ["sec-rh", "sec-geb", "sec-ist"],
    email: "aprendizagem-senai@firjan.com.br",
    size: 50
  }
];

const DEFAULT_DOCUMENTS: DocumentMeta[] = [
  {
    id: "doc-1",
    filename: "regulamento_premio_sustentabilidade_2026.pdf",
    title: "Regulamento Oficial Prêmio Firjan de Sustentabilidade 2026",
    fileSize: "14.2 MB",
    uploadedAt: "2026-06-02T22:15:00Z",
    uploadedBy: "Renato Albuquerque",
    sectorId: "sec-dir",
    tags: ["Firjan", "Sustentabilidade", "ESG", "Regulamento"],
    status: "Processed",
    version: 1,
    category: "Regulamentos",
    ocrText: "PRÊMIO FIRJAN DE SUSTENTABILIDADE 2026. Edital completo para inscrição de projetos do Rio de Janeiro. Inscrições prorrogadas até 02/06/2026 às 23h59. Categorias: Água, Resíduos Sólidos, Governança Corporativa, ODS, Mudanças Climáticas. Arquivo digital PDF max 30MB, max 40 páginas. Enviar para premiosustentabilidade@firjan.com.br"
  },
  {
    id: "doc-2",
    filename: "manual_onboarding_firjan_ia.pdf",
    title: "Manual de Boas-Vindas e Onboarding Tecnológico Firjan IA",
    fileSize: "4.8 MB",
    uploadedAt: "2026-06-01T11:30:00Z",
    uploadedBy: "Mariana Costa",
    sectorId: "sec-rh",
    tags: ["Onboarding", "Boas-Vindas", "Cultura"],
    status: "Processed",
    version: 1,
    category: "Manuais",
    ocrText: "BEM-VINDO À PLATAFORMA FIRJAN IA. Este manual ensina a usar a nossa base de conhecimento institucional, cadastrar seu perfil, requisitar ajuda do assistente de inteligência artificial do Sistema, acompanhar trilhas de integração e compreender o organograma interativo."
  },
  {
    id: "doc-3",
    filename: "normativa_seguranca_mfa_v3.pdf",
    title: "Normativa Interna de Segurança: Autenticação MFA e Contas",
    fileSize: "2.1 MB",
    uploadedAt: "2026-05-20T10:00:00Z",
    uploadedBy: "Carlos Henrique",
    sectorId: "sec-ti",
    tags: ["Segurança", "MFA", "TI", "Normativa"],
    status: "Processed",
    version: 3,
    category: "Normativo",
    ocrText: "NORMATIVA TI 03/2026: É obrigatório o uso de autenticação de múltiplos fatores (MFA) por todos os administradores e colaboradores em até 48 horas de admissão no portal Firjan IA. Incidentes reportar a dpo@firjan.com.br"
  }
];

const DEFAULT_ARTICLES: WikiArticle[] = [
  {
    id: "wiki-lgpd",
    title: "Diretrizes de Proteção de Dados e LGPD",
    content: `### 1. Introdução à LGPD no Ambiente Corporativo\nTodos os colaboradores são guardiões das informações e dos dados pessoais tratados pela Firjan IA. Conforme a Lei Geral de Proteção de Dados (LGPD), todas as bases que contenham nomes, e-mails, salários ou CPF devem ser protegidas rigorosamente.\n\n### 2. Normas de Segurança Cruciais\n* **Ativação de MFA:** É obrigatório habilitar a Autenticação de Múltiplos Fatores (MFA) no portal Firjan IA em até 48 horas após ingressar no Sistema.\n* **Senhas:** Nunca reutilize senhas pessoais para ferramentas corporativas.\n* **Compartilhamento:** Fica estritamente proibido o compartilhamento de logins de acesso ou transferência de relatórios contendo dados pessoais por canais informais de comunicação (como WhatsApp, e-mails não corporativos ou serviços de arquivos públicos).\n\n### 3. Em Caso de Incidentes:\nQualquer suspeita de vazamento, perda de equipamento corporativo ou acesso não autorizado deve ser reportado de imediato à equipe de TI e ao DPO através do e-mail oficial: **dpo@firjan.com.br**..`,
    author: "Carlos Henrique",
    sectorId: "sec-ti",
    createdAt: "2026-05-10T14:30:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
    version: 2,
    status: "Approved",
    tags: ["LGPD", "Segurança", "Privacidade", "TI"],
    comments: [
      { id: "c1", authorName: "Mariana Costa", text: "Excelente resumo de conformidade. Todas as novas integrações do RH agora incluem leitura obrigatória deste artigo.", createdAt: "2026-05-12T09:15:00Z" }
    ]
  },
  {
    id: "wiki-viagem",
    title: "Procedimento para Reembolsos de Despesas e Viagens",
    content: `### Manual de Reembolso de Viagens Corporativas\nO objetivo deste documento é normatizar os gastos extraordinários cometidos a serviço da instituição.\n\n### 1. Prazos para Submissão\nO colaborador deve abrir a solicitação de reembolso no módulo financeiro em até **5 dias úteis** contados a partir da data de regresso da viagem. Toda submissão deve anexar fotos legíveis ou PDFs das notas fiscais válidas.\n\n### 2. Limites Diários Toleráveis:\n* **Alimentação Completa:** Limite máximo diário de **R$ 80,00** (não reembolsáveis bebidas alcoólicas).\n* **Transporte Individual (Aplicativos):** Cobertura integral desde que devidamente justificada a origem e destino associados ao trabalho corporativo.\n* **Deslocamento com Veículo Próprio:** Valor de reembolso calculado em **R$ 1,10 por quilômetro rodado**, exigindo envio do mapa do trajeto ou comprovação de quilometragem inicial e final.\n\n### 3. Fluxo de Autorizações\nO reembolso passará por ocorrência de conferência do setor de Recursos Humanos, seguida de validação final pelo Gestor do Setor. O pagamento é liquidado tradicionalmente na folha subsequente ou no segundo ciclo contábil do mês corrente.`,
    author: "Claudio Guedes",
    sectorId: "sec-fin",
    createdAt: "2026-04-18T09:00:00Z",
    updatedAt: "2026-04-18T09:00:00Z",
    version: 1,
    status: "Approved",
    tags: ["Reembolso", "Financeiro", "Normas", "Viagens"],
    comments: []
  },
  {
    id: "wiki-premio-firjan",
    title: "Prêmio Firjan de Sustentabilidade 2026 - Regulamento Interno",
    content: `### Regulamento do Prêmio Firjan de Sustentabilidade 2026\nAbaixo estão destacaram-se os parâmetros regulamentares essenciais obtidos do edital institucional da Firjan.\n\n### 1. Apresentação e Elegibilidade\nO prêmio visa reconhecer iniciativas que aliem o desenvolvimento sustentável com viabilidade econômica, proteção ao meio ambiente e responsabilidade ESG. Podem concorrer **Pessoas Jurídicas** com projetos concluídos ou em fase de implantação com resultados mensuráveis obtidos nos anos de 2024 e/ou 2025.\n\n### 2. Categorias de Participação:\na) Água e Efluentes;\nb) Biodiversidade e Serviços Ecossistêmicos;\nc) Mudanças Climáticas e Transição Energética;\nd) Resíduos Sólidos;\ne) Gestão de Impacto e Investimento Social;\nf) Estratégias de Implementação dos ODS (Agenda 2030);\ng) Governança Corporativa.\n\n### 3. Prazos e Submissão:\n* **Período de Inscrição:** As inscrições iniciam em **03/03/2026** e encerram impreterivelmente às **23h59 do dia 02/06/2026** (conforme prorrogação oficial de prazo).\n* **Formato do Arquivo:** Envio em arquivo digital unificado em **PDF**, tamanho máximo **30 MB** e limite de **40 páginas**. Deverá conter obrigatoriamente: descrição de projeto, objetivos, desenvolvimento e resultados detalhados.\n* **Imagens:** Envio obrigatório de pelo menos 2 imagens legíveis do projeto para veiculação publicitária.\n* **Contatos Oficiais:** Lídia Vaz Aguiar ou Viviane Parente, pelo telefone (21) 2563-4410 ou e-mail **premiosustentabilidade@firjan.com.br**..`,
    author: "Mariana Costa",
    sectorId: "sec-rh",
    createdAt: "2026-05-15T11:00:00Z",
    updatedAt: "2026-06-02T16:00:00Z",
    version: 2,
    status: "Approved",
    tags: ["Firjan", "Sustentabilidade", "ESG", "Incentivos"],
    comments: [
      { id: "c2", authorName: "Carlos Henrique", text: "Excelente! Esta informação é extremamente útil para orientar nossa submissão conjunta dos setores de TI e Operações.", createdAt: "2026-05-18T10:45:00Z" }
    ]
  }
];

export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lists stored globally for synchronization (preloaded with robust client fallbacks)
  const [sectors, setSectors] = useState<Sector[]>(DEFAULT_SECTORS);
  const [documents, setDocuments] = useState<DocumentMeta[]>(DEFAULT_DOCUMENTS);
  const [articles, setArticles] = useState<WikiArticle[]>(DEFAULT_ARTICLES);

  // PWA popup state
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // Device UI mode layout toggle: "web" full responsive design vs "app" polished native mobile mockup
  const [deviceMode, setDeviceMode] = useState<"web" | "app">("web");

  // Global theme switcher persisted in localStorage (Firjan slate dark theme vs clean high contrast light theme)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("cio-theme") as "light" | "dark") || "light";
  });

  // Interactive Guided Tour onboarding steps state
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Apply theme classes and state persistence
  useEffect(() => {
    localStorage.setItem("cio-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Launch interactive tour if user logged in for the first time
  useEffect(() => {
    if (user) {
      const isAlreadyCompleted = localStorage.getItem("cio-tour-completed");
      if (!isAlreadyCompleted) {
        // Delayed launch to ensure rendering completes seamlessly
        const tourTimer = setTimeout(() => {
          setTourActive(true);
          setTourStep(0);
          setView("dashboard"); // Force dashboard to ensure assets are mounted
        }, 1200);
        return () => clearTimeout(tourTimer);
      }
    }
  }, [user]);

  // Track the targeted elements' dimensions dynamically for contextual tour Tooltip alignment
  useEffect(() => {
    if (tourActive) {
      let activeElementId = "";
      if (tourStep === 0) activeElementId = "tour-search";
      else if (tourStep === 1) activeElementId = "tour-navigation";
      else if (tourStep === 2) activeElementId = "tour-gamification";

      const updatePosition = () => {
        const el = document.getElementById(activeElementId);
        if (el) {
          setTargetRect(el.getBoundingClientRect());
        } else {
          setTargetRect(null); // Fallback to centered popover overlay if screen space is too cramped (e.g. mobile hidden search)
        }
      };

      updatePosition();
      // Schedule ref update on resize or viewport offsets changes
      window.addEventListener("resize", updatePosition);
      const posTimer = setTimeout(updatePosition, 320); // allow transitions to end

      return () => {
        window.removeEventListener("resize", updatePosition);
        clearTimeout(posTimer);
      };
    } else {
      setTargetRect(null);
    }
  }, [tourActive, tourStep, view, deviceMode]);

  // Dynamic alerts list
  const [toasts, setToasts] = useState<Array<{
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    category: string;
  }>>([]);

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

  // Simulated background push notifications for real system activity
  useEffect(() => {
    if (!user) return;

    const t1 = setTimeout(() => {
      addToast(
        "Seja bem-vindo!", 
        `Olá, ${user.name.split(" ")[0]}. O seu onboarding da Firjan está 40% concluído! Vá na aba de Trilha para iniciar.`, 
        "info", 
        "Onboarding"
      );
    }, 3500);

    const t2 = setTimeout(() => {
      addToast(
        "Wiki Corporativa Atualizada", 
        "O artigo 'Uso do ChatGeral e Privacidade da LGPD' recebeu uma revisão oficial do time de compliance.", 
        "success", 
        "Wiki"
      );
    }, 12000);

    const t3 = setTimeout(() => {
      addToast(
        "Novo Fluxo BPM Atribuído", 
        "Você foi integrado ao circuito 'Solicitação de Suporte ao Usuário Firjan IA'. Verifique na aba BPM.", 
        "warning", 
        "BPM"
      );
    }, 25000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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

    return matches.slice(0, 5);
  };

  const handleSearchResultNavigation = (item: any) => {
    setView(item.targetView);
    setSearchQuery("");
    addToast(
      "Navegação Rápida",
      `Direcionado para "${item.name}" na aba correspondente.`,
      "success",
      "Portal"
    );
  };

  // Keep active user synchronized in localStorage for offline/static deployment resilience (e.g. Vercel)
  useEffect(() => {
    if (user) {
      localStorage.setItem("cio_local_active_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cio_local_active_user");
    }
  }, [user]);

  // Fetch session on load with robust localStorage fallback
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        } else {
          throw new Error("HTML response instead of JSON");
        }
      } catch (e) {
        console.error("Modo offline ou falha ao sincronizar sessão ativa, usando sessão local.", e);
        const localActiveUser = localStorage.getItem("cio_local_active_user");
        if (localActiveUser) {
          try {
            setUser(JSON.parse(localActiveUser));
          } catch (err) {
            // invalid json
          }
        }
      }
    };
    fetchSession();
  }, [booting]);

  // Sync static entities
  const syncPlatformEntities = async () => {
    try {
      const resSectors = await fetch("/api/sectors");
      const contentTypeSectors = resSectors.headers.get("content-type");
      if (resSectors.ok && contentTypeSectors && contentTypeSectors.includes("application/json")) {
        const dataSectors = await resSectors.json();
        if (dataSectors.sectors) setSectors(dataSectors.sectors);
      }

      const resDocs = await fetch("/api/documents");
      const contentTypeDocs = resDocs.headers.get("content-type");
      if (resDocs.ok && contentTypeDocs && contentTypeDocs.includes("application/json")) {
        const dataDocs = await resDocs.json();
        if (dataDocs.documents) setDocuments(dataDocs.documents);
      }

      const resWiki = await fetch("/api/wiki");
      const contentTypeWiki = resWiki.headers.get("content-type");
      if (resWiki.ok && contentTypeWiki && contentTypeWiki.includes("application/json")) {
        const dataWiki = await resWiki.json();
        if (dataWiki.articles) setArticles(dataWiki.articles);
      }
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
    localStorage.removeItem("cio_local_active_user");
    setUser(null);
    setView("dashboard");
  };

  const handlePwaInstallation = () => {
    setPwaInstalled(true);
    setTimeout(() => {
      setShowPwaBanner(false);
    }, 2500);
  };

  // Tour controls
  const handleTourNext = () => {
    if (tourStep < 2) {
      setTourStep(prev => prev + 1);
    } else {
      // Completed!
      setTourActive(false);
      localStorage.setItem("cio-tour-completed", "true");
      addToast(
        "Onboarding Concluído! 🏆",
        "Você completou o tour oficial do C.I.O AI e ganhou +50 XP adicionais!",
        "success",
        "Integração"
      );
      if (user) {
        setUser(prev => prev ? { ...prev, points: prev.points + 50 } : null);
      }
    }
  };

  const handleTourSkip = () => {
    setTourActive(false);
    localStorage.setItem("cio-tour-completed", "true");
    addToast(
      "Guia Minimizado",
      "Você pode reiniciar o guia contextual a qualquer momento pelo menu de ajuda.",
      "info",
      "Portal"
    );
  };

  const handleRestartTour = () => {
    setView("dashboard");
    setTourActive(true);
    setTourStep(0);
    setMobileMenuOpen(false);
  };

  // Toggle app vs web presentation mode
  const toggleDeviceMode = () => {
    setDeviceMode(prev => prev === "web" ? "app" : "web");
    addToast(
      "Apresentação Alternada",
      `Exibindo projeto no formato ${deviceMode === "web" ? "Aplicativo Mobile PWA" : "Sistemas Web Adaptivo"}.`,
      "info",
      "Visualização"
    );
  };

  // Search parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Switch View renderers
  const renderActiveView = () => {
    if (!user) return null;
    
    switch (view) {
      case "dashboard":
        return <DashboardView user={user} sectors={sectors} documents={documents} articles={articles} setView={setView} theme={theme} />;
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
        return <DashboardView user={user} sectors={sectors} documents={documents} articles={articles} setView={setView} theme={theme} />;
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

  if (user.role === 'Gestor' || user.role === 'Administrador' || user.role === 'Diretor') {
    navigationItems.push({ id: "admin", label: "Painel Sec & RBAC", icon: FileCheck });
  }

  const isDark = theme === "dark";

  // Render variables according to theme
  const bodyBackground = isDark ? "bg-[#0b0f19] text-slate-100" : "bg-[#f8fafc] text-slate-800";
  const headerClass = isDark ? "bg-[#111625]/95 border-[#1e293b]" : "bg-white/95 border-slate-200/80";
  const sidebarClass = isDark ? "bg-[#111625] border-r border-[#1e293b]" : "bg-white border-r border-slate-200";
  const searchInputClass = isDark ? "bg-[#161b2c] border-slate-700 text-white focus:border-[#003BD1]" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-[#003BD1]";

  // The comprehensive view wrapped inside smartphone or full-screen
  const isAppModel = deviceMode === "app";

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-colors duration-200 ${bodyBackground}`} id="app-viewport-root">
      
      {/* Decorative ambient background lights */}
      <div className={`fixed top-0 left-0 w-full h-[400px] pointer-events-none z-0 transition-opacity duration-300 ${
        isDark ? "bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,59,209,0.07),transparent)]" : "bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,59,209,0.03),transparent)]"
      }`} />
      
      {/* CORE WEB HEADER BAR */}
      <header className={`sticky top-0 border-b px-6 py-3.5 flex justify-between items-center z-40 backdrop-blur-md shadow-2xs ${headerClass}`} id="app-core-header">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 md:hidden rounded-lg border transition-all cursor-pointer ${
              isDark ? "hover:bg-slate-800 border-slate-700 text-slate-300" : "hover:bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#003BD1]" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setView('dashboard')}>
            {/* The beautiful responsive official logo component replacing previous orb */}
            <AppLogo size="sm" theme={theme} />
          </div>
        </div>

        {/* Quick Search Bar (Central Position) with real-time navigation across Docs, Wiki, Setores */}
        <div className="relative hidden md:block w-80" id="tour-search">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-full py-1.5 pl-8.5 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-[#003BD1] transition-all font-sans ${searchInputClass}`}
              placeholder="Busca rápida de Wiki, OCR Docs, Setor..."
            />
            <Search className="w-3.5 h-3.5 text-slate-450 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); }}
                className="absolute right-3 top-2 hover:bg-slate-200/40 rounded-full p-0.5 cursor-pointer text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick search dropdown matches */}
          {searchFocused && searchQuery.length > 0 && (
            <div className={`absolute top-full right-0 mt-2 w-96 rounded-2xl shadow-xl z-50 p-2 text-left animate-fade-in max-h-96 overflow-y-auto border ${
              isDark ? "bg-[#161b2b] border-slate-700" : "bg-white border-slate-200/90"
            }`}>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 font-mono">Resultados da Pesquisa</p>
              
              {getFilteredItems().length > 0 ? (
                <div className="space-y-1 mt-1">
                  {getFilteredItems().map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onMouseDown={() => handleSearchResultNavigation(item)}
                        className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 cursor-pointer transition-all border border-transparent ${
                          isDark ? "hover:bg-slate-800 hover:border-slate-700" : "hover:bg-slate-50 hover:border-slate-100"
                        }`}
                      >
                        <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-white ${item.badgeColor}`}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${isDark ? "text-slate-100" : "text-slate-800"}`}>{item.name}</p>
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

        {/* Header Right controllers (Theme, Presentation state, Gamification) */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:pointer-events-auto">
          
          {/* Active presenter view toggle: Web systems and mobile app mock */}
          <button 
            onClick={toggleDeviceMode}
            className={`p-1.5 sm:p-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-3xs ${
              isDark 
                ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80"
            }`}
            title="Alternar entre visualização Web e Aplicativo Mobile"
          >
            {isAppModel ? <Monitor className="w-4 h-4 text-[#003BD1]" /> : <Smartphone className="w-4 h-4 text-[#003BD1]" />}
            <span className="hidden lg:inline">{isAppModel ? "Modo Web" : "Modo App Container"}</span>
          </button>

          {/* Branded dual-theme toggler persisted globally with Firjan design systems */}
          <button
            id="theme-toggler"
            onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-3xs ${
              isDark 
                ? "bg-slate-800/85 border-slate-700 text-amber-400 hover:bg-slate-700" 
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/80"
            }`}
            title={`Ativar Modo ${isDark ? "Claro" : "Escuro (Estilo Firjan)"}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Direct Guide manual trigger button */}
          <button
            onClick={handleRestartTour}
            className={`p-2 rounded-xl border transition-all cursor-pointer hidden sm:block ${
              isDark 
                ? "bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-700" 
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
            title="Iniciar Tour Interativo"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          {/* Gamification progress pill */}
          <div 
            id="tour-gamification"
            onClick={() => setView('onboarding')}
            className={`flex items-center gap-2 border py-1.5 px-3 rounded-full cursor-pointer transition-all shadow-2xs ${
              isDark ? "bg-[#161b2c] border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
              {user.points} XP
            </span>
          </div>

          <div 
            onClick={() => setView('profile')}
            className={`flex items-center gap-2.5 cursor-pointer p-0.5 pr-2 rounded-xl transition-all border ${
              isDark ? "hover:bg-slate-800 border-transparent hover:border-slate-700" : "hover:bg-slate-50 border-transparent hover:border-slate-200"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-150 border border-slate-200/80 flex items-center justify-center font-bold text-xs text-[#003BD1] uppercase font-mono overflow-hidden shrink-0 shadow-2xs">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold max-w-[100px] truncate flex items-center gap-1">
                {user.name.split(" ")[0]}
                {user.points >= 300 && <BadgeCheck className="w-4 h-4 text-[#003BD1] fill-[#003BD1]/10" />}
              </p>
              <p className="text-[8px] text-[#003BD1] font-mono uppercase tracking-widest font-bold">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* CORE SPLIT PRESENTATION ARCHITECTURE OR NATIVE FRAME EMBED (Web/App toggle state fully responsive) */}
      <div className="flex-1 flex relative z-10">
        
        {/* DESKTOP DRAW SIDEBAR (Only visible in regular responsive web view) */}
        {!isAppModel && (
          <nav 
            id="tour-navigation"
            className={`hidden md:flex flex-col justify-between w-64 p-4 shrink-0 z-10 shadow-3xs ${sidebarClass}`}
          >
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
                          ? isDark 
                            ? "bg-slate-800 border border-slate-700 text-sky-400 shadow-2xs" 
                            : "bg-slate-50 border border-slate-200 text-[#003BD1] shadow-2xs" 
                          : isDark
                            ? "border border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                            : "border border-transparent text-slate-600 hover:text-[#003BD1] hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${isActive ? 'text-[#003BD1]' : 'text-slate-405'}`} />
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
              <div className={`p-3 border rounded-xl space-y-1 font-mono text-[9px] ${
                isDark ? "bg-[#161b2c] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                <p className="font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#003BD1]" /> Setor Ativo
                </p>
                <p className={`truncate font-semibold font-sans ${isDark ? "text-slate-350" : "text-slate-700"}`}>
                  {sectors.find(s => s.id === user.sectorId)?.name || "Geral Firjan"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-mono text-slate-500 hover:text-red-600 hover:bg-red-50/20 flex items-center gap-3 transition-all cursor-pointer border border-transparent hover:border-red-200/50"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Sair da Sessão
              </button>
            </div>
          </nav>
        )}

        {/* SIDEBAR: MOBILE OVERLAY DRAWER (Web standard view) */}
        {!isAppModel && (
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed inset-y-0 left-0 w-64 p-5 pt-20 flex flex-col justify-between z-35 md:hidden shadow-2xl ${
                  isDark ? "bg-[#111625] border-r border-slate-800" : "bg-white border-r border-slate-200"
                }`}
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
                              ? isDark ? "bg-slate-800 border border-slate-700 text-sky-450" : "bg-slate-50 border border-slate-200 text-[#003BD1]" 
                              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-[#003BD1] hover:bg-slate-50"
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
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-mono text-slate-500 hover:text-red-650 hover:bg-red-50 flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sair
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* DYNAMIC VIEW CONTAINER: WEB vs APP BEZEL MOCKUP SIMULATOR (100% RESPONSIVE) */}
        <div className="flex-1 flex justify-center items-stretch relative min-w-0" id="app-workspace-body">
          {isAppModel ? (
            /* PHONE MOCKUP SHELL CONTAINER (Fits viewport beautifully on desktop with sleek bezel) */
            <div className="flex-1 overflow-y-auto w-full flex items-center justify-center p-3 sm:p-5 bg-gradient-to-tr from-slate-100 to-slate-250 dark:from-[#080b12] dark:to-[#111726]">
              <div className={`shadow-2xl border-[10px] rounded-[42px] flex flex-col relative overflow-hidden transition-all duration-300 md:w-[380px] md:h-[760px] h-full w-full ${
                isDark ? "border-[#1e293b] bg-[#0c0f17] text-white" : "border-slate-800 bg-[#f8fafc] text-slate-800"
              }`}>
                {/* Phone Top Notch Status bar */}
                <div className="w-full h-8 px-5 shrink-0 flex justify-between items-center bg-black/4 text-slate-400 text-[10px] font-mono font-bold select-none leading-none z-10 relative">
                  <span className="text-[9px]">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="w-20 h-4 bg-slate-800 absolute left-1/2 -translate-x-1/2 rounded-b-xl flex items-center justify-center border-x border-b border-slate-700/50">
                    <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800/40" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[8.5px]">
                    <span>5G LTE</span>
                    <span>100% 🔋</span>
                  </div>
                </div>

                {/* Subview mobile scrolling content screen */}
                <div className="flex-grow overflow-y-auto px-4 py-4.5 pb-24 relative" id="app-mobile-scrollscreen">
                  <div className="space-y-4">
                    {/* Small inner header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/40">
                      <div className="flex items-center gap-1.5">
                        <AppLogo iconOnly size="xs" />
                        <span className="text-xs font-bold leading-none tracking-tight">C.I.O AI App</span>
                      </div>
                      <span className="text-[8px] font-mono bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase">Conectado</span>
                    </div>

                    {renderActiveView()}
                  </div>
                </div>

                {/* Mobile Bottom Native Navigation bar wrapper (Direct touch parameters) */}
                <div 
                  id="app-bottom-nav"
                  className={`absolute bottom-0 inset-x-0 h-16 border-t flex items-center justify-between px-6 z-30 shadow-lg ${
                    isDark ? "bg-[#121727] border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  {[
                    { id: "dashboard", label: "Painel", icon: Activity },
                    { id: "chat", label: "IA Chat", icon: Cpu },
                    { id: "onboarding", label: "Trilha", icon: GraduationCap },
                    { id: "profile", label: "Perfil", icon: User }
                  ].map((btn) => {
                    const BtnIcon = btn.icon;
                    const isActive = view === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => setView(btn.id)}
                        className={`flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
                          isActive 
                            ? "text-[#003BD1] scale-105 font-bold" 
                            : isDark ? "text-slate-450 hover:text-slate-200" : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        <BtnIcon className="w-5 h-5 shrink-0" />
                        <span className="text-[9px] font-medium tracking-tight mt-0.5">{btn.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* CONVENTIONAL RESPONSIVE FULL PAGE SCREEN CONTAINER */
            <main className="flex-grow p-4 sm:p-6 overflow-y-auto relative z-10" id="app-web-viewpane">
              <div className="max-w-6xl mx-auto space-y-6 pb-20">
                {renderActiveView()}
              </div>
            </main>
          )}
        </div>

      </div>

      {/* PWA FLOATING PROMPT PANEL */}
      {showPwaBanner && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-4 max-w-sm ${
          isDark ? "bg-[#111625] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-[#003BD1]/5 border border-[#003BD1]/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#003BD1]" />
            </div>
            <div>
              <p className="text-xs font-bold font-sans">C.I.O AI App</p>
              <p className="text-[10px] text-slate-400 leading-tight">Instale como aplicativo nativo em seu desktop ou celular.</p>
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

            <button 
              onClick={() => setShowPwaBanner(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-450 hover:text-slate-650 transition-all cursor-pointer"
              title="Fechar Notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Contextual Onboarding Guided Tour Tooltip Panel */}
      {tourActive && (
        <div className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-3xs overflow-hidden flex items-center justify-center pointer-events-auto select-none transition-all duration-300">
          {/* Spotlight Highlight Box pointing to targeted features */}
          {targetRect && (
            <div 
              className="absolute border-4 border-dashed border-[#003BD1] rounded-2xl bg-transparent transition-all duration-300 pointer-events-none animate-pulse"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                boxShadow: "0 0 0 999px rgba(0, 0, 0, 0.7)"
              }}
            />
          )}

          {/* Contextual Floating Tooltip Window */}
          <div 
            className={`absolute transition-all duration-300 p-5 rounded-2xl shadow-2xl border flex flex-col justify-between max-w-sm w-11/12 animate-fade-in ${
              isDark ? "bg-[#161b2b] border-[#003BD1]/40 text-slate-100" : "bg-white border-slate-200 text-[#0f172a]"
            }`}
            style={targetRect ? {
              top: targetRect.bottom + 18 + (targetRect.bottom + 250 > window.innerHeight ? -310 : 0),
              left: Math.max(16, Math.min(window.innerWidth - 380, targetRect.left + (targetRect.width / 2) - 180))
            } : {
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="space-y-2 text-left select-text">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono font-black text-[#003BD1]">
                <span>Guia de Visita ({tourStep + 1} de 3)</span>
                <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] font-bold">Sincronizado</span>
              </div>
              
              <h4 className="text-sm font-black tracking-tight flex items-center gap-2">
                {tourStep === 0 && "🔍 Pesquisa Rápida Inteligente"}
                {tourStep === 1 && "📋 Navegação por Abas"}
                {tourStep === 2 && "🏆 Sistema de Gamificação (XP)"}
              </h4>

              <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-350" : "text-slate-600"}`}>
                {tourStep === 0 && "Use esta barra para buscar de forma dinâmica em toda a plataforma. Ela retorna artigos chaves da Wiki, documentos indexados via OCR cognitivo e os setores institucionais."}
                {tourStep === 1 && "Navegue de forma ágil pelas abas principais. Acesse o Painel de controle, resolva dúvidas em tempo real com o Chat IA (Gemini), cumpra atividades e organize fluxos BPM."}
                {tourStep === 2 && "Sua jornada de integração recompensa você! Acompanhe seu progresso de XP em tempo real pelo novo gráfico interativo Recharts para alcançar metas institucionais."}
              </p>
            </div>

            <div className={`flex items-center justify-between mt-5 pt-3 border-t ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}>
              <button 
                onClick={handleTourSkip}
                className="text-[10px] font-mono font-bold uppercase hover:underline cursor-pointer opacity-70 hover:opacity-100"
              >
                Pular Tour
              </button>

              <div className="flex items-center gap-2">
                {tourStep > 0 && (
                  <button 
                    onClick={() => setTourStep(prev => prev - 1)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all ${
                      isDark ? "hover:bg-slate-800 border-slate-700 text-slate-300" : "hover:bg-slate-50 border-slate-150 text-slate-600"
                    } cursor-pointer`}
                  >
                    Voltar
                  </button>
                )}

                <button 
                  onClick={handleTourNext}
                  className="px-4 py-1.5 rounded-lg bg-[#003BD1] hover:bg-[#002cb3] text-white text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {tourStep === 2 ? "Concluir" : "Avançar"}
                </button>
              </div>
            </div>
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
              accentColor = isDark ? "border-emerald-900 bg-slate-900 text-slate-100 shadow-xl" : "border-emerald-250 bg-white text-slate-850 shadow-md";
              sideBanner = "bg-emerald-500";
              IconToast = ShieldCheck;
            } else if (toast.type === "warning") {
              accentColor = isDark ? "border-amber-900 bg-slate-900 text-slate-100 shadow-xl" : "border-amber-200 bg-white text-slate-850 shadow-md";
              sideBanner = "bg-amber-500";
              IconToast = AlertCircle;
            } else if (toast.type === "error") {
              accentColor = isDark ? "border-red-900 bg-slate-900 text-slate-100 shadow-xl" : "border-red-200 bg-white text-slate-850 shadow-md";
              sideBanner = "bg-red-500";
              IconToast = AlertCircle;
            } else {
              accentColor = isDark ? "border-slate-800 bg-slate-900 text-slate-100 shadow-xl" : "border-blue-150 bg-white text-slate-850 shadow-md";
              sideBanner = "bg-blue-600";
              IconToast = Bell;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto border p-4 rounded-2xl flex items-start gap-3.5 relative overflow-hidden ${accentColor}`}
              >
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${sideBanner}`} />

                <div className="shrink-0 mt-0.5">
                  <IconToast className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-[#003BD1] bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-150 dark:border-slate-700">
                      {toast.category}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold mt-1">{toast.title}</h5>
                  <p className="text-[11px] opacity-80 leading-snug mt-0.5">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 hover:bg-slate-100/20 rounded-lg text-slate-400 hover:text-slate-350 transition-all cursor-pointer"
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
