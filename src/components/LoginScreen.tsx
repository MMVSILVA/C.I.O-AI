import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Briefcase, 
  KeyRound, 
  ShieldCheck,
  Search,
  Building,
  Check,
  Compass,
  Info,
  Sparkles,
  AlertCircle,
  Award
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import AppLogo from "./AppLogo";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

// Complete realistic list of positions (cargos) inside the Firjan System (including SESI and SENAI)
const CARGOS_FIRJAN_SYSTEM = [
  {
    name: "Analista de Inteligência Industrial",
    entity: "Firjan",
    description: "Realiza estudos macroeconômicos, sondagens estatísticas e levantamento de indicativos de mercado setoriais do RJ.",
    suggestedSector: "sec-dec",
    suggestedRole: "Colaborador"
  },
  {
    name: "Economista Institucional",
    entity: "Firjan",
    description: "Focado em pesquisas conjunturais, análise de flutuações do PIB, inflação e produtividade dos setores produtivos fluminenses.",
    suggestedSector: "sec-dec",
    suggestedRole: "Colaborador"
  },
  {
    name: "Especialista em Relações Internacionais",
    entity: "Firjan",
    description: "Fomenta canais de exportação, atração de investimentos produtivos globais e acordos de livre comércio.",
    suggestedSector: "sec-ddi",
    suggestedRole: "Colaborador"
  },
  {
    name: "Consultor de Transição Energética e Sustentabilidade",
    entity: "Firjan",
    description: "Apoia indústrias associadas a implantar práticas de adequação ESG, pegada de carbono, energia limpa e economia circular.",
    suggestedSector: "sec-ddi",
    suggestedRole: "Gestor"
  },
  {
    name: "Assessor de Defesa de Interesses (Advocacy)",
    entity: "Firjan",
    description: "Articula posicionamentos estratégicos e pleitos perante órgãos governamentais e fóruns legislativos estaduais.",
    suggestedSector: "sec-ddi",
    suggestedRole: "Gestor"
  },
  {
    name: "Assessor de Imprensa e Comunicação",
    entity: "Firjan",
    description: "Propaga notícias e pautas industriais para canais de imprensa corporativos e cobertura de eventos institucionais.",
    suggestedSector: "sec-dir",
    suggestedRole: "Colaborador"
  },
  {
    name: "Professor de Ensino Fundamental & Médio",
    entity: "SESI",
    description: "Atua na rede de Escolas SESI RJ promovendo metodologias dinâmicas de ciências, tecnologia, artes e matemática.",
    suggestedSector: "sec-geb",
    suggestedRole: "Colaborador"
  },
  {
    name: "Médico do Trabalho / Saúde Ocupacional",
    entity: "SESI",
    description: "Médico focado em avaliações ocupacionais preventivas, atestados de integridade, laudos físicos e qualidade de vida.",
    suggestedSector: "sec-sst",
    suggestedRole: "Colaborador"
  },
  {
    name: "Engenheiro de Segurança do Trabalho",
    entity: "SESI",
    description: "Mapeia insalubridade, elabora planos de contingência contra acidentes industriais e fiscaliza cumprimento normativo.",
    suggestedSector: "sec-sst",
    suggestedRole: "Gestor"
  },
  {
    name: "Psicólogo Escolar e Psicossocial",
    entity: "SESI",
    description: "Desenvolve apoio emocional, dinâmicas de inclusão escolar, acolhimento psicopedagógico e bem-estar estudantil.",
    suggestedSector: "sec-geb",
    suggestedRole: "Colaborador"
  },
  {
    name: "Técnico de Promoção da Saúde & Estilo de Vida",
    entity: "SESI",
    description: "Organiza atividades físicas esportivas, ginástica laboral in-company e campanhas públicas de vacinação na indústria.",
    suggestedSector: "sec-sst",
    suggestedRole: "Colaborador"
  },
  {
    name: "Instrutor de Educação Profissional",
    entity: "SENAI",
    description: "Ministra treinamentos práticos de nível técnico em laboratórios de automação industrial, elétrica, robótica e TI.",
    suggestedSector: "sec-dep",
    suggestedRole: "Colaborador"
  },
  {
    name: "Especialista em Desenvolvimento Tecnológico",
    entity: "SENAI",
    description: "Desenha testes laboratoriais avançados e soluções de P&D (Pesquisa e Desenvolvimento) no Instituto SENAI de Tecnologia.",
    suggestedSector: "sec-ist",
    suggestedRole: "Colaborador"
  },
  {
    name: "Supervisor de Laboratórios e Calibração",
    entity: "SENAI",
    description: "Responsável por garantir a rastreabilidade metrológica, qualidade técnica e auditoria em ensaios fabris RJ.",
    suggestedSector: "sec-ist",
    suggestedRole: "Gestor"
  },
  {
    name: "Consultor de Manufatura Avançada e Engenharia de Software",
    entity: "SENAI",
    description: "Conduz projetos de transformação produtiva ligada a conceitos de Indústria 4.0, IoT, gêmeos digitais e computação.",
    suggestedSector: "sec-ist",
    suggestedRole: "Gestor"
  },
  {
    name: "Orientador Pedagógico Tecnológico",
    entity: "SENAI",
    description: "Garante conformidade de matriz curricular, diretrizes acadêmicas de laboratório e acompanhamento de alunos ativos.",
    suggestedSector: "sec-dep",
    suggestedRole: "Colaborador"
  }
];

// Complete realistic list of institutional sectors (setores) in Sistema Firjan (including SESI and SENAI)
const SETORES_FIRJAN_SYSTEM = [
  {
    id: "sec-dir",
    code: "DIR",
    name: "Diretoria Geral",
    entity: "Firjan",
    description: "Direcionamento corporativo estratégico, governança integrada do Sistema, relações institucionais superiores e fusões.",
    email: "diretoria@firjan.com.br"
  },
  {
    id: "sec-ti",
    code: "DTI",
    name: "Tecnologia da Informação",
    entity: "Firjan",
    description: "Infraestrutura de redes, cibersegurança lógica, administração do portal secure e desenvolvimento tecnológico (DTI).",
    email: "ti@firjan.com.br"
  },
  {
    id: "sec-rh",
    code: "DHR",
    name: "Gente & Recursos Humanos",
    entity: "Firjan",
    description: "Gestão completa de admissões, onboarding digital, gamificação, plano de cargos e salários e capacitação interna (DHR).",
    email: "rh@firjan.com.br"
  },
  {
    id: "sec-fin",
    code: "DFI",
    name: "Financeiro & Custos",
    entity: "Firjan",
    description: "Emissão de relatórios contábeis, controladoria de orçamentos, auditoria tributária e reembolsos de viagens (DFI).",
    email: "financeiro@firjan.com.br"
  },
  {
    id: "sec-dec",
    code: "DEC",
    name: "Inteligência Industrial & Estudos Econômicos",
    entity: "Firjan",
    description: "Pesquisa de fôlego fluminense, monitoramento da atividade industrial e elaboração de indicadores estatísticos (DEC).",
    email: "dec@firjan.com.br"
  },
  {
    id: "sec-ddi",
    code: "DDI",
    name: "Defesa de Interesses Industriais",
    entity: "Firjan",
    description: "Estudos setoriais regulatórios, defesa em debates fiscais, fomento econômico de polos estaduais do RJ e práticas ESG (DDI).",
    email: "ddi@firjan.com.br"
  },
  {
    id: "sec-geb",
    code: "GEB / Escola SESI",
    name: "Educação Básica (SESI)",
    entity: "SESI",
    description: "Gerencia a infraestrutura acadêmica de todas as Escolas SESI RJ, focadas na educação regular básica e de jovens.",
    email: "educacao-sesi@firjan.com.br"
  },
  {
    id: "sec-sst",
    code: "SST",
    name: "Saúde Ocupacional & Segurança (SESI)",
    entity: "SESI",
    description: "Centraliza atendimentos preventivos médicos, consultorias de ergonomias e qualidade de vida na indústria do RJ.",
    email: "sst-sesi@firjan.com.br"
  },
  {
    id: "sec-ist",
    code: "IST / SENAI",
    name: "Institutos SENAI de Tecnologia",
    entity: "SENAI",
    description: "Garante ensaios em laboratórios industriais certificados, soluções de engenharia, calibração e metrologia de precisão (IST).",
    email: "ist-senai@firjan.com.br"
  },
  {
    id: "sec-dep",
    code: "DEP",
    name: "Educação Profissional",
    entity: "SENAI",
    description: "Desenvolve as trilhas profissionalizantes, cursos de aprendizagem e qualificação rápida requisitada pelas indústrias.",
    email: "aprendizagem-senai@firjan.com.br"
  }
];

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Colaborador");
  const [sectorId, setSectorId] = useState("sec-rh");
  const [mfaChecked, setMfaChecked] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Directory UI specific state variables
  const [searchQueryDirectory, setSearchQueryDirectory] = useState("");
  const [dirActiveTab, setDirActiveTab] = useState<"cargos" | "setores">("cargos");
  const [entityFilter, setEntityFilter] = useState<"todos" | "firjan" | "sesi" | "senai">("todos");
  const [recentlyPrefilled, setRecentlyPrefilled] = useState<string | null>(null);

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Strict frontend validation
    if (!email.toLowerCase().endsWith("@firjan.com.br")) {
      setMessage({ 
        text: "Acesso reservado. Use o seu e-mail corporativo terminado em @firjan.com.br", 
        isError: true 
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, sectorId })
      });
      const data = await response.json();
      if (data.success) {
        if (mfaChecked || data.user.mfaEnabled) {
          setMessage({ text: "✓ MFA Verificado com sucesso. Acessando portal seguro...", isError: false });
          setTimeout(() => onLoginSuccess(data.user), 1000);
        } else {
          onLoginSuccess(data.user);
        }
      } else {
        setMessage({ text: data.error || "Credenciais não encontradas nas bases institucionais.", isError: true });
      }
    } catch {
      setMessage({ text: "Falha de conexão com o servidor Firjan IA.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInput = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Strict frontend validation
    if (!email.toLowerCase().endsWith("@firjan.com.br")) {
      setMessage({ 
        text: "E-mail inválido. O registro exige um e-mail do Sistema Firjan terminando em @firjan.com.br", 
        isError: true 
      });
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setMessage({ text: "Por favor, digite seu nome completo para fins de compliance.", isError: true });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, sectorId })
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: "✓ Cadastro corporativo realizado com sucesso! Logando...", isError: false });
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1200);
      } else {
        setMessage({ text: data.error || "Erro ao realizar cadastro institucional.", isError: true });
      }
    } catch {
      setMessage({ text: "Erro ao contatar o servidor institucional.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith("@firjan.com.br")) {
      setMessage({ text: "Por favor, indique um e-mail corporativo válido @firjan.com.br", isError: true });
      return;
    }
    setMessage({ text: "✓ Instruções de redefinição enviadas para " + email, isError: false });
  };

  const handleSSOLogin = (provider: 'Google' | 'Microsoft') => {
    setLoading(true);
    setMessage(null);
    const mockEmail = `colaborador@firjan.com.br`;

    // Handshake simulation with clean profile
    setTimeout(() => {
      onLoginSuccess({
        id: `sso-${Date.now()}`,
        name: `Colaborador ${provider}`,
        email: mockEmail,
        role: "Colaborador",
        sectorId: "sec-rh",
        avatar: "",
        points: 100,
        mfaEnabled: true,
        onboardingProgress: 20
      });
      setLoading(false);
    }, 1200);
  };

  // Pre-fill helper when clicking directories in the sidebar
  const handlePrefillFromDirectory = (item: any, type: "cargo" | "sector") => {
    if (type === "cargo") {
      setRole(item.suggestedRole as UserRole);
      setSectorId(item.suggestedSector);
      setRecentlyPrefilled(`Cargo "${item.name}" e Setor associados carregados no formulário!`);
    } else if (type === "sector") {
      setSectorId(item.id);
      setRecentlyPrefilled(`Setor "${item.name}" selecionado com sucesso!`);
    }

    // Auto toggle registering for convenience if not already open
    if (!isRegistering) {
      setIsRegistering(true);
    }

    setTimeout(() => {
      setRecentlyPrefilled(null);
    }, 4500);
  };

  // Normalized search query matcher with robust fallback for "SANAI" typo matching "SENAI"
  const getFilteredDirectoryItems = () => {
    const rawQuery = searchQueryDirectory.toLowerCase();
    // Intelligent resolution so "SANAI" matches results having "SENAI"
    const query = rawQuery.replace("sanai", "senai");

    if (dirActiveTab === "cargos") {
      return CARGOS_FIRJAN_SYSTEM.filter(cargo => {
        const matchesSearch = cargo.name.toLowerCase().includes(query) || 
                              cargo.description.toLowerCase().includes(query) || 
                              cargo.entity.toLowerCase().includes(query);
        const matchesEntity = entityFilter === "todos" || cargo.entity.toLowerCase() === entityFilter;
        return matchesSearch && matchesEntity;
      });
    } else {
      return SETORES_FIRJAN_SYSTEM.filter(sector => {
        const matchesSearch = sector.name.toLowerCase().includes(query) || 
                              sector.code.toLowerCase().includes(query) || 
                              sector.description.toLowerCase().includes(query) ||
                              sector.entity.toLowerCase().includes(query);
        const matchesEntity = entityFilter === "todos" || sector.entity.toLowerCase() === entityFilter;
        return matchesSearch && matchesEntity;
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 xl:p-8 overflow-y-auto font-sans text-slate-800">
      {/* Light elegant industrial pattern layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />
      
      {/* Ambient soft blue lighting shape overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#003BD1]/5 rounded-full filter blur-[140px] pointer-events-none" />

      {/* Modern Two-column split board, adapting fluidly to viewport scaling to be more compact */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch z-10 my-4">
        
        {/* ================= COLUMN 1: SECURITY GATE & LOGIN/REGISTER FORM ================= */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200 p-5 md:p-7 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden"
        >
          {/* Firjan Institutional Color Accent Bar (Azul Science: #003BD1) */}
          <div className="absolute top-0 left-0 w-full h-[5px] bg-[#003BD1]" />

          <div>
            {/* Head Branding Header */}
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <AppLogo size="lg" />
              </div>

              {/* Call to action descriptive prompt requested */}
              <div className="mt-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-left">
                <p className="text-[11px] text-slate-600 leading-normal text-justify px-1 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#003BD1] shrink-0 mt-0.5" />
                  <span>
                    Bem-vindo ao <strong>C.I.O AI</strong>. Insira seu e-mail corporativo do Sistema Firjan para autenticar o login ou criar sua credencial institucional.
                  </span>
                </p>
              </div>
            </div>

            {/* Global Prefill Success Banner notification */}
            <AnimatePresence>
              {recentlyPrefilled && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 mb-4 bg-blue-50 border border-blue-200 text-[#003BD1] text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 animate-spin text-[#003BD1]" />
                  <span>{recentlyPrefilled}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Prompt */}
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-3.5 mb-5 rounded-xl border text-xs font-mono text-center flex items-center justify-center gap-2 ${
                  message.isError 
                    ? "bg-red-50 border-red-200 text-red-700" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                {message.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* --- FORGOT PASSWORD VIEW --- */}
            {isForgotPassword ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">E-mail Corporativo</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-mono text-slate-900"
                      placeholder="exemplo@firjan.com.br"
                      required
                    />
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 bg-[#003BD1] hover:bg-[#002cb3] text-white font-bold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-white" />
                  Solicitar Chave Corporativa
                </button>

                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setMessage(null); }}
                  className="w-full text-center text-xs text-slate-500 hover:text-[#003BD1] transition-all mt-4 underline"
                >
                  Retornar ao Portal
                </button>
              </form>
            ) : (
              <div>
                {/* --- SSO SIGN IN SECTORS --- */}
                {!isRegistering && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => handleSSOLogin('Microsoft')}
                      className="bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-slate-700"
                    >
                      <span className="w-2.5 h-2.5 bg-[#f25f22] rounded-xs" />
                      Microsoft 365
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSSOLogin('Google')}
                      className="bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer text-slate-700"
                    >
                      <span className="w-2.5 h-2.5 bg-[#4285f4] rounded-full" />
                      Google Workspace
                    </button>
                  </div>
                )}

                {!isRegistering && (
                  <div className="relative flex items-center justify-center my-5">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="absolute bg-white px-4 text-[10px] uppercase font-bold font-mono text-slate-400 tracking-widest">
                      Ou credenciais locais
                    </span>
                  </div>
                )}

                {/* --- MAIN FORMS --- */}
                <form onSubmit={isRegistering ? handleRegisterInput : handleTraditionalLogin} className="space-y-4">
                  
                  {isRegistering && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Nome Completo</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all text-slate-900"
                          placeholder="ex: Carlos Henrique"
                          required
                        />
                        <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">E-mail Corporativo</label>
                      {!isRegistering && (
                        <span className="text-[10px] text-[#003BD1] font-bold font-mono">@firjan.com.br</span>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-mono text-slate-900"
                        placeholder="sufixo@firjan.com.br"
                        required
                      />
                      <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {!isRegistering && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Senha de Acesso</label>
                        <button 
                          type="button" 
                          onClick={() => setIsForgotPassword(true)}
                          className="text-[10px] text-slate-500 hover:text-[#003BD1] transition-all underline font-semibold font-mono"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-mono text-slate-900"
                          placeholder="••••••••"
                          required
                        />
                        <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                  )}

                  {/* RBAC ROLES AND SECTORS CHOOSE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#003BD1]" />
                        Cargo / Nível de Acesso
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#003BD1] focus:border-[#003BD1] text-slate-800"
                      >
                        <option value="Colaborador">Colaborador (Pleno)</option>
                        <option value="Gestor">Gestor / Coordenador</option>
                        <option value="Administrador">Administrador de TI</option>
                        <option value="Diretor">Diretor Operacional</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#003BD1]" />
                        Setor Organizacional
                      </label>
                      <select
                        value={sectorId}
                        onChange={(e) => setSectorId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#003BD1] focus:border-[#003BD1] text-slate-800"
                      >
                        <optgroup label="Federação & Administrativo">
                          <option value="sec-dir">DIR - Diretoria Geral</option>
                          <option value="sec-ti">DTI - Tecnologia da Informação</option>
                          <option value="sec-rh">DHR - Gente & Recursos Humanos</option>
                          <option value="sec-fin">DFI - Financeiro & Custos</option>
                          <option value="sec-dec">DEC - Inteligência Industrial & Estudos Econômicos</option>
                          <option value="sec-ddi">DDI - Defesa de Interesses Industriais</option>
                        </optgroup>
                        <optgroup label="SESI (Saúde & Escola SESI)">
                          <option value="sec-geb">Escola SESI - Educação Básica</option>
                          <option value="sec-sst">SST - Saúde Ocupacional & Segurança</option>
                        </optgroup>
                        <optgroup label="SENAI (Escola Técnica & Tecnologia)">
                          <option value="sec-ist">IST - Institutos SENAI de Tecnologia</option>
                          <option value="sec-dep">DEP - Educação Profissional</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {!isRegistering && (
                    <div className="flex items-center gap-2 py-1 select-none">
                      <input
                        type="checkbox"
                        id="mfaCheck"
                        checked={mfaChecked}
                        onChange={(e) => setMfaChecked(e.target.checked)}
                        className="rounded border-slate-300 bg-white text-[#003BD1] focus:ring-[#003BD1] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="mfaCheck" className="text-xs text-slate-500 cursor-pointer flex items-center gap-1.5 font-mono font-medium">
                        <ShieldCheck className="w-4 h-4 text-[#003BD1]" /> Ativar MFA institucional nesta sessão
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-3 bg-[#003BD1] hover:bg-[#002cb3] text-white font-extrabold tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer rounded-xl"
                  >
                    {loading ? "Autenticando..." : isRegistering ? "Confirmar Cadastro no DB Local" : "Entrar no Portal C.I.O AI"}
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => { setIsRegistering(!isRegistering); setMessage(null); }}
                    className="text-xs text-[#003BD1] hover:underline font-bold cursor-pointer"
                  >
                    {isRegistering ? "Já possui cadastro? Entrar com e-mail corporativo" : "Não possui cadastro? Registrar e-mail @firjan.com.br"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ================= COLUMN 2: SEARCHABLE COMPREHENSIVE CARGOS & SETORES DIRECTORY ================= */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-12 xl:col-span-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-lg flex flex-col justify-between"
        >
          <div>
            {/* Header Description of corporate framework */}
            <div className="mb-4">
              <span className="text-[10px] font-mono tracking-widest font-black text-[#003BD1] uppercase block mb-1">
                🌐 Sistema Firjan Integrado
              </span>
              <h3 className="text-lg font-black tracking-tight text-slate-800">
                Guia de Estrutura Organizacional
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Navegue pela lista autoritativa de cargos e divisões do Sistema. Busque qualquer termo e clique para carregar os parâmetros ideais no formulário.
              </p>
            </div>

            {/* Structured Search Box with clear mechanism and smart replacement for typo "sanai" */}
            <div className="relative mb-4">
              <input 
                type="text"
                value={searchQueryDirectory}
                onChange={(e) => setSearchQueryDirectory(e.target.value)}
                placeholder="Busque cargo, setor, sigla ou 'SESI'..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:border-[#003BD1] focus:ring-1 focus:ring-[#003BD1] transition-all font-sans text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQueryDirectory && (
                <button 
                  onClick={() => setSearchQueryDirectory("")}
                  className="absolute right-3 top-2 flex items-center hover:bg-slate-200/50 p-0.5 rounded-full text-slate-400"
                >
                  <span className="text-[9px] leading-none font-sans font-medium mr-1 select-none">Limpar</span>
                  ✕
                </button>
              )}
            </div>

            {/* Principal Directory Navigation Tab switcher */}
            <div className="grid grid-cols-2 gap-1 bg-slate-200/55 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDirActiveTab("cargos")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  dirActiveTab === "cargos" 
                    ? "bg-white text-[#003BD1] shadow-2xs" 
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <Briefcase className="w-4.5 h-4.5" />
                Cargos ({CARGOS_FIRJAN_SYSTEM.length})
              </button>
              <button
                type="button"
                onClick={() => setDirActiveTab("setores")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  dirActiveTab === "setores" 
                    ? "bg-white text-[#003BD1] shadow-2xs" 
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <Building className="w-4.5 h-4.5" />
                Setores ({SETORES_FIRJAN_SYSTEM.length})
              </button>
            </div>

            {/* Secondary Institution selector pill group */}
            <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none">
              {(["todos", "firjan", "sesi", "senai"] as const).map((inst) => {
                const isActive = entityFilter === inst;
                return (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => setEntityFilter(inst)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? "bg-[#003BD1] text-white border-transparent shadow-3xs" 
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {inst}
                  </button>
                );
              })}
            </div>

            {/* Catalog list feed, scrolling elements cleanly with height constraints */}
            <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2 pb-2 scrollbar-thin">
              {getFilteredDirectoryItems().length > 0 ? (
                getFilteredDirectoryItems().map((item, index) => {
                  const ent = item.entity.toLowerCase();
                  const isSesi = ent === "sesi";
                  const isSenai = ent === "senai";
                  
                  // Branded color flags based on system entities
                  const entityBadgeClass = isSesi 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : isSenai 
                      ? "bg-teal-50 text-teal-700 border-teal-200" 
                      : "bg-blue-50 text-blue-700 border-blue-200";

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      key={index}
                      className="bg-white border border-slate-150 p-3 rounded-2xl flex flex-col justify-between gap-2.5 hover:border-[#003BD1] hover:shadow-2xs transition-all text-left"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">
                            {dirActiveTab === "setores" && (item as any).code ? `[${(item as any).code}] ` : ""}
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <span className={`text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 ${entityBadgeClass}`}>
                          {item.entity}
                        </span>
                      </div>

                      {/* Prefill form Trigger action footer */}
                      <button
                        type="button"
                        onClick={() => handlePrefillFromDirectory(item, dirActiveTab === "cargos" ? "cargo" : "sector")}
                        className="w-full text-right text-[10px] font-bold text-[#003BD1] hover:text-[#002cb3] cursor-pointer hover:underline flex items-center justify-end gap-1 font-mono uppercase bg-slate-50 py-1.5 px-2.5 rounded-lg border border-slate-100"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Usar no Formulário
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-white border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-400 font-mono">
                    Nenhum cargo ou setor correspondente.
                  </p>
                  <p className="text-[10px] text-slate-350 mt-1">
                    Tente buscar por termos mais genéricos.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Oportunidades & Portais Oficiais section */}
          <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💼</span>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Links Úteis & Oportunidades</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="https://jobs.i-hunter.com/firjan/oportunidades" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-[#003BD1] hover:text-[#003BD1] p-2 rounded-xl text-[10px] font-bold transition-all text-slate-700 flex flex-col justify-between"
              >
                <span className="text-slate-400 text-[8px] font-mono leading-none font-bold block mb-1">VAGAS & CARREIRA</span>
                <div className="flex items-center justify-between gap-1 w-full text-left">
                  <span className="truncate">Oportunidades</span>
                  <span className="text-[#003BD1] font-bold">↗</span>
                </div>
              </a>
              <a 
                href="https://firjan.com.br/pagina-inicial.htm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-[#003BD1] hover:text-[#003BD1] p-2 rounded-xl text-[10px] font-bold transition-all text-slate-700 flex flex-col justify-between"
              >
                <span className="text-slate-400 text-[8px] font-mono leading-none font-bold block mb-1">SISTEMA FIRJAN</span>
                <div className="flex items-center justify-between gap-1 w-full text-left">
                  <span className="truncate">Site Oficial</span>
                  <span className="text-[#003BD1] font-bold">↗</span>
                </div>
              </a>
            </div>
          </div>

          {/* Institutional footer compliance statement tag */}
          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 uppercase font-mono font-bold tracking-widest">
            <span>© 2026 Sistema Firjan</span>
            <span>Segurança Homologada</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
