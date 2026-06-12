import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { 
  UserProfile, 
  WikiArticle, 
  DocumentMeta, 
  BusinessFlow, 
  OnboardingModule, 
  ChatMessage, 
  AuditLog, 
  Sector 
} from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- LOCAL DATABASE SYSTEM PERSISTENCE ---
const USERS_DB_PATH = path.join(process.cwd(), "users-db.json");

function loadUsers(): UserProfile[] {
  try {
    if (fs.existsSync(USERS_DB_PATH)) {
      const data = fs.readFileSync(USERS_DB_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar banco de dados local de usuários:", error);
  }

  // Lista padrão estrita com e-mails corporativos @firjan.com.br, sem o Alexandre Silva
  const defaultUsers: UserProfile[] = [
    {
      id: "user-juliana",
      name: "Juliana Mendes",
      email: "juliana@firjan.com.br",
      role: "Colaborador",
      sectorId: "sec-rh",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      points: 320,
      mfaEnabled: true,
      onboardingProgress: 100
    },
    {
      id: "user-renato",
      name: "Renato Albuquerque",
      email: "renato@firjan.com.br",
      role: "Diretor",
      sectorId: "sec-dir",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      points: 500,
      mfaEnabled: true,
      onboardingProgress: 100
    }
  ];
  saveUsers(defaultUsers);
  return defaultUsers;
}

function saveUsers(usersList: UserProfile[]) {
  try {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(usersList, null, 2), "utf8");
  } catch (error) {
    console.error("Erro ao atualizar banco de dados local de usuários:", error);
  }
}

let users: UserProfile[] = loadUsers();

let sectors: Sector[] = [
  {
    id: "sec-dir",
    name: "Diretoria Geral",
    responsible: "Renato Albuquerque",
    roleDescription: "Administração estratégica, governança corporativa e expansão.",
    email: "diretoria@firjan.com.br",
    connections: ["sec-ti", "sec-rh", "sec-fin"],
    size: 5
  },
  {
    id: "sec-ti",
    name: "Tecnologia da Informação",
    responsible: "Carlos Henrique",
    roleDescription: "Infraestrutura de nuvem, segurança corporativa, desenvolvimento e suporte.",
    parentId: "sec-dir",
    connections: ["sec-rh", "sec-fin"],
    email: "ti@firjan.com.br",
    size: 24
  },
  {
    id: "sec-rh",
    name: "Recursos Humanos (Gente & Gestão)",
    responsible: "Mariana Costa",
    roleDescription: "Onboarding, recrutamento, capacitação profissional e plano de cargos.",
    parentId: "sec-dir",
    connections: ["sec-ti"],
    email: "rh@firjan.com.br",
    size: 12
  },
  {
    id: "sec-fin",
    name: "Financeiro & Contas",
    responsible: "Claudio Guedes",
    roleDescription: "Controle de despesas, faturamento, reembolso de viagens e auditoria fiscal.",
    parentId: "sec-dir",
    connections: ["sec-ti", "sec-dir"],
    email: "financeiro@firjan.com.br",
    size: 8
  }
];

let wikiArticles: WikiArticle[] = [
  {
    id: "wiki-lgpd",
    title: "Diretrizes de Proteção de Dados e LGPD",
    content: `### 1. Introdução à LGPD no Ambiente Corporativo
Todos os colaboradores são guardiões das informações e dos dados pessoais tratados pela Firjan IA. Conforme a Lei Geral de Proteção de Dados (LGPD), todas as bases que contenham nomes, e-mails, salários ou CPF devem ser protegidas rigorosamente.

### 2. Normas de Segurança Cruciais
* **Ativação de MFA:** É obrigatório habilitar a Autenticação de Múltiplos Fatores (MFA) no portal Firjan IA em até 48 horas após ingressar no Sistema.
* **Senhas:** Nunca reutilize senhas pessoais para ferramentas corporativas.
* **Compartilhamento:** Fica estritamente proibido o compartilhamento de logins de acesso ou transferência de relatórios contendo dados pessoais por canais informais de comunicação (como WhatsApp, e-mails não corporativos ou serviços de arquivos públicos).

### 3. Em Caso de Incidentes:
Qualquer suspeita de vazamento, perda de equipamento corporativo ou acesso não autorizado deve ser reportado de imediato à equipe de TI e ao DPO através do e-mail oficial: **dpo@firjan.com.br**.`,
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
    content: `### Manual de Reembolso de Viagens Corporativas
O objetivo deste documento é normatizar os gastos extraordinários cometidos a serviço da instituição.

### 1. Prazos para Submissão
O colaborador deve abrir a solicitação de reembolso no módulo financeiro em até **5 dias úteis** contados a partir da data de regresso da viagem. Toda submissão deve anexar fotos legíveis ou PDFs das notas fiscais válidas.

### 2. Limites Diários Toleráveis:
* **Alimentação Completa:** Limite máximo diário de **R$ 80,00** (não reembolsáveis bebidas alcoólicas).
* **Transporte Individual (Aplicativos):** Cobertura integral desde que devidamente justificada a origem e destino associados ao trabalho corporativo.
* **Deslocamento com Veículo Próprio:** Valor de reembolso calculado em **R$ 1,10 por quilômetro rodado**, exigindo envio do mapa do trajeto ou comprovação de quilometragem inicial e final.

### 3. Fluxo de Autorizações
O reembolso passará por conferência do setor de Recursos Humanos, seguida de validação final pelo Gestor do Setor. O pagamento é liquidado tradicionalmente na folha subsequente ou no segundo ciclo contábil do mês corrente.`,
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
    content: `### Regulamento do Prêmio Firjan de Sustentabilidade 2026
Abaixo estão destacados os parâmetros regulamentares essenciais obtidos do edital institucional da Firjan.

### 1. Apresentação e Elegibilidade
O prêmio visa reconhecer iniciativas que aliem o desenvolvimento sustentável com viabilidade econômica, proteção ao meio ambiente e responsabilidade ESG. Podem concorrer **Pessoas Jurídicas** com projetos concluídos ou em fase de implantação com resultados mensuráveis obtidos nos anos de 2024 e/ou 2025.

### 2. Categorias de Participação:
a) Água e Efluentes;
b) Biodiversidade e Serviços Ecossistêmicos;
c) Mudanças Climáticas e Transição Energética;
d) Resíduos Sólidos;
e) Gestão de Impacto e Investimento Social;
f) Estratégias de Implementação dos ODS (Agenda 2030);
g) Governança Corporativa.

### 3. Prazos e Submissão:
* **Período de Inscrição:** As inscrições iniciam em **03/03/2026** e encerram impreterivelmente às **23h59 do dia 02/06/2026** (conforme prorrogação oficial de prazo).
* **Formato do Arquivo:** Envio em arquivo digital unificado em **PDF**, tamanho máximo **30 MB** e limite de **40 páginas**. Deverá conter obrigatoriamente: descrição de projeto, objetivos, desenvolvimento e resultados detalhados.
* **Imagens:** Envio obrigatório de pelo menos 2 imagens legíveis do projeto para veiculação publicitária.
* **Contatos Oficiais:** Lídia Vaz Aguiar ou Viviane Parente, pelo telefone (21) 2563-4410 ou e-mail **premiosustentabilidade@firjan.com.br**.`,
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

let documents: DocumentMeta[] = [
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

let businessFlows: BusinessFlow[] = [
  {
    id: "flow-reembolso",
    name: "Fluxo de Solicitação de Reembolso",
    description: "Etapas formais para requisição de valores gastos em viagens ou insumos extraordinários.",
    sectorId: "sec-fin",
    status: "Ativo",
    steps: [
      { id: "step-1", title: "Compilar Despesas", description: "O colaborador reúne as notas fiscais legíveis e preenche o formulário informando a motivação.", responsible: "Colaborador Solicitante", status: "Concluido", durationExpected: "1 dia" },
      { id: "step-2", title: "Aprovação do Gestor", description: "O gestor do respectivo orçamento analisa a conformidade com as regras de diárias e limites.", responsible: "Gestor do Setor", status: "Em Executando", durationExpected: "2 dias" },
      { id: "step-3", title: "Conciliação e Auditoria", description: "O financeiro valida a idoneidade das notas fiscais e agenda o repasse no fluxo de pagamento.", responsible: "Setor Financeiro", status: "Pendente", durationExpected: "2 dias" }
    ]
  },
  {
    id: "flow-onboarding",
    name: "Fluxograma de Onboarding e Admissão",
    description: "Caminho operacional desde a assinatura do pré-contrato até a conclusão da trilha tecnológica.",
    sectorId: "sec-rh",
    status: "Ativo",
    steps: [
      { id: "step-on-1", title: "Assinatura e Documentos", description: "RH recolhe documentos admissionais e gera o login institucional em ambiente seguro.", responsible: "Gente & Gestão", status: "Concluido", durationExpected: "1 dia" },
      { id: "step-on-2", title: "Liberação de Equipamento", description: "O TI configura o computador pessoal, cadastra o e-mail oficial e cobra a ativação do MFA.", responsible: "T.I.", status: "Concluido", durationExpected: "1 dia" },
      { id: "step-on-3", title: "Trilha Inicial Firjan IA", description: "O novo funcionário realiza as tarefas no Onboarding Digital, obtém 300 pontos e recebe certificado.", responsible: "Colaborador Novo", status: "Em Executando", durationExpected: "5 dias" }
    ]
  }
];

let onboardingModules: OnboardingModule[] = [
  {
    id: "mod-cultura",
    title: "1. Introdução à Cultura e Missão do Sistema Firjan",
    description: "Entenda o propósito estratégico de nossa organização, regras básicas de convivência e inovação digital.",
    pointsValue: 100,
    isCompleted: true,
    duration: "40 min",
    category: "Cultura",
    lessons: [
      { id: "les-c1", title: "Nosso Propósito e Manifesto de Inovação", content: "Nosso objetivo é acelerar a inteligência coletiva e o desenvolvimento industrial do estado de Rio de Janeiro, utilizando a inteligência artificial para otimizar processos.", isCompleted: true },
      { id: "les-c2", title: "Valores Centrais: Cooperação, Integridade e Inovação", content: "Compartilhamento transparente e uso ético de tecnologias cognitivas para impulsionar a indústria de forma sustentável.", isCompleted: true }
    ]
  },
  {
    id: "mod-seguranca",
    title: "2. Segurança de Contas, Senhas e LGPD",
    description: "Aprenda as práticas mandatórias para evitar ataques cibernéticos e atuar em estrita conformidade com a LGPD.",
    pointsValue: 100,
    isCompleted: true,
    duration: "1h 15m",
    category: "Segurança",
    lessons: [
      { id: "les-s1", title: "Configuração do MFA e Controle de Acessos", content: "Todos os acessos corporativos devem possuir autenticação secundária ativa por aplicativo autenticador do Google ou Microsoft.", isCompleted: true },
      { id: "les-s2", title: "Como Identificar Phishing e Vazamento de Dados", content: "Nunca clique em links suspeitos ou forneça token de segurança por chats informais. Reporte no ato para ti@cioai.com.br", isCompleted: true }
    ]
  },
  {
    id: "mod-processos",
    title: "3. Processos Internos e Solicitações Corriqueiras",
    description: "Como solicitar reembolso de despesas de viagem, requisitar suporte tecnológico, e utilizar metodologias ágeis.",
    pointsValue: 100,
    isCompleted: false,
    duration: "50 min",
    category: "Processos",
    lessons: [
      { id: "les-p1", title: "Normatização de Reembolsos e Prestação de Contas", content: "Preencha suas despesas em até 5 dias úteis com os devidos cupons fiscais digitalizados. Limite de alimentação: R$ 80/dia.", isCompleted: false },
      { id: "les-p2", title: "Gestão do Conhecimento com nossa Wiki Corporativa", content: "Qualquer colaborador com cargo habilitado pode formular e propor atualizações nas páginas da wiki institutional.", isCompleted: false }
    ]
  },
  {
    id: "mod-tecnico",
    title: "4. Onboarding Técnico e Mentoria de Ferramentas",
    description: "Entendimento conceitual do software que desenvolvemos, arquitetura de sistemas e canais de deploy.",
    pointsValue: 150,
    isCompleted: false,
    duration: "2h 00m",
    category: "Tecnico",
    lessons: [
      { id: "les-t1", title: "Visão Geral do Produto e Plataformas de Integração", content: "Nossos microsserviços utilizam Node.js e Docker, providos em arquitetura Cloud Run de alta elasticidade.", isCompleted: false }
    ]
  }
];

let activeChats: ChatMessage[] = [
  { id: "m-welcome", role: "model", text: "Olá! Eu sou o assistente de inteligência artificial da **Firjan IA**. Eu fui treinado com os documentos e normas de nossa federação (como as diretrizes da LGPD, os fluxos de reembolso de viagem, e as regras do Prêmio Firjan de Sustentabilidade 2026). Como posso te guiar hoje?", timestamp: new Date().toISOString() }
];

let auditLogs: AuditLog[] = [
  { id: "log-1", timestamp: "2026-06-02T22:30:10Z", userEmail: "vinidoctor@gmail.com", action: "Visualizou Documento (regulamento_premio_sustentabilidade_2026.pdf)", sector: "Diretoria Geral", ip: "172.24.8.44" },
  { id: "log-2", timestamp: "2026-06-02T21:40:55Z", userEmail: "vinidoctor@gmail.com", action: "Atualizou Artigo Wiki (Diretrizes de Proteção de Dados)", sector: "Tecnologia da Informação", ip: "172.24.8.44" },
  { id: "log-3", timestamp: "2026-06-02T19:12:00Z", userEmail: "juliana@corporativo.com", action: "Acessou Módulo Onboarding Digital", sector: "Recursos Humanos", ip: "189.12.87.1" }
];

let selectedUser: UserProfile | null = null; // Always initialize with the login screen (null session)

// --- API ENDPOINTS ---

// Session APIS
app.get("/api/auth/me", (req, res) => {
  res.json({ user: selectedUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.toLowerCase().endsWith("@firjan.com.br")) {
    return res.status(400).json({ 
      success: false, 
      error: "E-mail institucional inválido. Use um endereço terminado em @firjan.com.br" 
    });
  }
  
  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (foundUser) {
    selectedUser = foundUser;
    res.json({ success: true, user: foundUser });
  } else {
    res.status(404).json({ 
      success: false, 
      error: "Este e-mail @firjan.com.br não está cadastrado. Por favor, vá em 'Cadastre-se' para criar seu perfil corporativo." 
    });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, role, sectorId } = req.body;
  
  if (!email || !email.toLowerCase().endsWith("@firjan.com.br")) {
    return res.status(400).json({ 
      success: false, 
      error: "O e-mail deve obrigatoriamente terminar com @firjan.com.br" 
    });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ 
      success: false, 
      error: "Este e-mail já está cadastrado no banco de dados local." 
    });
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: name || "Novo Colaborador",
    email: email.toLowerCase(),
    role: role || "Colaborador",
    sectorId: sectorId || "sec-rh",
    points: 100,
    mfaEnabled: false,
    onboardingProgress: 10
  };

  users.push(newUser);
  saveUsers(users); // PERSIST IN BANCO DE DADOS LOCAL
  selectedUser = newUser;
  res.json({ success: true, user: newUser });
});

app.post("/api/auth/logout", (req, res) => {
  selectedUser = null;
  res.json({ success: true });
});

app.post("/api/auth/profile/update", (req, res) => {
  if (!selectedUser) {
    return res.status(401).json({ success: false, error: "Usuário não autenticado." });
  }

  const { name, email, role, sectorId, avatar } = req.body;

  if (email && !email.toLowerCase().endsWith("@firjan.com.br")) {
    return res.status(400).json({ 
      success: false, 
      error: "O e-mail deve obrigatoriamente terminar com @firjan.com.br" 
    });
  }

  const idx = users.findIndex(u => u.id === selectedUser!.id);
  if (idx !== -1) {
    if (name) users[idx].name = name;
    if (email) users[idx].email = email.toLowerCase();
    if (role) users[idx].role = role;
    if (sectorId) users[idx].sectorId = sectorId;
    if (avatar !== undefined) users[idx].avatar = avatar;

    selectedUser = users[idx];
    saveUsers(users); // PERSIST IN BANCO DE DADOS LOCAL
    res.json({ success: true, user: selectedUser });
  } else {
    res.status(404).json({ success: false, error: "Usuário não encontrado." });
  }
});

app.post("/api/auth/mfa-toggle", (req, res) => {
  if (!selectedUser) {
    return res.status(401).json({ success: false, error: "Não autenticado." });
  }
  selectedUser.mfaEnabled = !selectedUser.mfaEnabled;
  const idx = users.findIndex(u => u.id === selectedUser.id);
  if (idx !== -1) {
    users[idx].mfaEnabled = selectedUser.mfaEnabled;
    saveUsers(users); // PERSIST IN BANCO DE DADOS LOCAL
  }
  res.json({ success: true, mfaEnabled: selectedUser.mfaEnabled });
});

// Sector API
app.get("/api/sectors", (req, res) => {
  res.json({ sectors });
});

// Wiki APIs
app.get("/api/wiki", (req, res) => {
  res.json({ articles: wikiArticles });
});

app.post("/api/wiki", (req, res) => {
  const { title, content, sectorId, tags } = req.body;
  const newArticle: WikiArticle = {
    id: `wiki-${Date.now()}`,
    title: title || "Novo Artigo Base de Conhecimento",
    content: content || "Defina o corpo textual aqui...",
    author: selectedUser.name,
    sectorId: sectorId || selectedUser.sectorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    status: "Approved",
    tags: tags || ["Geral"],
    comments: []
  };
  wikiArticles.unshift(newArticle);
  
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail: selectedUser.email,
    action: `Criou Artigo Wiki (${newArticle.title})`,
    sector: sectors.find(s => s.id === selectedUser.sectorId)?.name || "Geral",
    ip: "172.24.8.44"
  });

  res.json({ success: true, article: newArticle });
});

app.post("/api/wiki/:id/comment", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const article = wikiArticles.find(a => a.id === id);
  if (article) {
    const newComment = {
      id: `comment-${Date.now()}`,
      authorName: selectedUser.name,
      text: text || "",
      createdAt: new Date().toISOString()
    };
    article.comments.push(newComment);
    res.json({ success: true, comment: newComment });
  } else {
    res.status(404).json({ error: "Artigo não encontrado." });
  }
});

// Document Management APIs
app.get("/api/documents", (req, res) => {
  res.json({ documents });
});

app.post("/api/documents/upload", (req, res) => {
  const { title, filename, category, tags, base64Data } = req.body;
  
  // Simulated intelligent OCR text extractor based on category keying
  let simulatedOcr = `CONTRATO DIGITAL EXTRAÍDO POR OCR EM ${new Date().toLocaleDateString('pt-BR')}. Documento focado em ${category || "Geral"}. `;
  if (title) simulatedOcr += `Título: ${title}. `;
  simulatedOcr += "Responsável: " + selectedUser.name + ". Conteúdo preliminar de conformidade auditado e classificado com sucesso.";

  const newDoc: DocumentMeta = {
    id: `doc-${Date.now()}`,
    filename: filename || "uploaded_document.pdf",
    title: title || "Relatório Institucional de Operações",
    fileSize: "3.2 MB",
    uploadedAt: new Date().toISOString(),
    uploadedBy: selectedUser.name,
    sectorId: selectedUser.sectorId,
    tags: tags || ["Upload", category || "Geral"],
    ocrText: simulatedOcr,
    status: "Processed",
    version: 1,
    category: category || "Manuais"
  };
  documents.unshift(newDoc);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail: selectedUser.email,
    action: `Submeteu Documento com OCR (${newDoc.filename})`,
    sector: sectors.find(s => s.id === selectedUser.sectorId)?.name || "Geral",
    ip: "172.24.8.44"
  });

  res.json({ success: true, document: newDoc });
});

// Process Flows
app.get("/api/flows", (req, res) => {
  res.json({ flows: businessFlows });
});

// Onboarding Digital
app.get("/api/onboarding", (req, res) => {
  res.json({ modules: onboardingModules });
});

app.post("/api/onboarding/complete-lesson", (req, res) => {
  const { moduleId, lessonId } = req.body;
  let pointsAwarded = 0;
  
  onboardingModules = onboardingModules.map(mod => {
    if (mod.id === moduleId) {
      const lessonsUpdated = mod.lessons.map(lesson => {
        if (lesson.id === lessonId && !lesson.isCompleted) {
          lesson.isCompleted = true;
          pointsAwarded += 25; // 25 points per lesson
        }
        return lesson;
      });

      const allCompleted = lessonsUpdated.every(l => l.isCompleted);
      if (allCompleted && !mod.isCompleted) {
        mod.isCompleted = true;
        pointsAwarded += 50; // Bonus for module completion
      }

      return {
        ...mod,
        lessons: lessonsUpdated,
        isCompleted: allCompleted
      };
    }
    return mod;
  });

  if (pointsAwarded > 0) {
    selectedUser.points += pointsAwarded;
    // Recalculate global progress percentage
    const totalLessons = onboardingModules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = onboardingModules.reduce((sum, m) => sum + m.lessons.filter(l => l.isCompleted).length, 0);
    const percentage = Math.round((completedLessons / totalLessons) * 100);
    selectedUser.onboardingProgress = percentage;

    // Persist in mock users list
    const idx = users.findIndex(u => u.id === selectedUser.id);
    if (idx !== -1) {
      users[idx].points = selectedUser.points;
      users[idx].onboardingProgress = selectedUser.onboardingProgress;
    }
  }

  res.json({ success: true, user: selectedUser, pointsAwarded });
});

// Audit trail
app.get("/api/audit-logs", (req, res) => {
  res.json({ logs: auditLogs });
});

// Gemini Chat & Smart RAG Query API
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "A mensagem é obrigatória." });
  }

  // Save user message to active chat log
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    role: "user",
    text: message,
    timestamp: new Date().toISOString()
  };
  activeChats.push(userMsg);

  // LOGICAL RAG (Retrieval-Augmented Generation) PIPELINE:
  // We scan user input keywords to supply institutional database context directly into Gemini's system instructions!
  let matchedContext = "";
  let groundedDocs: string[] = [];

  const lowerMsg = message.toLowerCase();

  // 1. Check matching with Wiki procedures
  wikiArticles.forEach(art => {
    let matches = false;
    art.tags.forEach(t => {
      if (lowerMsg.includes(t.toLowerCase())) matches = true;
    });
    if (lowerMsg.includes(art.title.toLowerCase()) || lowerMsg.includes("regulamento") || lowerMsg.includes("sustentabilidade") || lowerMsg.includes("premio") || lowerMsg.includes("firjan")) {
      matches = true;
    }
    if (lowerMsg.includes("reembolso") || lowerMsg.includes("viagem") || lowerMsg.includes("despesa")) {
      if (art.id === "wiki-viagem") matches = true;
    }
    if (lowerMsg.includes("mfa") || lowerMsg.includes("segurança") || lowerMsg.includes("lgpd")) {
      if (art.id === "wiki-lgpd") matches = true;
    }

    if (matches) {
      matchedContext += `\n[Contexto de Base de Conhecimento: ${art.title}]\n${art.content}\n`;
      if (!groundedDocs.includes(art.title)) {
        groundedDocs.push(art.title);
      }
    }
  });

  // 2. Check matching with documents OCR text
  documents.forEach(doc => {
    if (doc.ocrText && (lowerMsg.includes("documento") || lowerMsg.includes("pdf") || lowerMsg.includes(doc.filename.toLowerCase()) || (doc.tags && doc.tags.some(t => lowerMsg.includes(t.toLowerCase()))))) {
      matchedContext += `\n[Texto OCR Extraído de Documento: ${doc.filename}]\n${doc.ocrText}\n`;
      if (!groundedDocs.includes(doc.title)) {
        groundedDocs.push(doc.title);
      }
    }
  });

  // Construct standard instruction system
  const systemInstruction = `Você é o assistente de inteligência artificial chamado **Firjan IA** (Plataforma IA do Sistema Firjan).
Seu papel é responder de forma direta, profissional e precisa às dúvidas institucionais, fornecendo instruções com base nos regulamentos internos e normas da federação. Use uma linguagem corporativa, prestativa, formal e moderna.

Sempre consulte o seguinte contexto institucional que foi recuperado de forma autônoma de nossos canais internos ou arquivos corporativos para enriquecer sua resposta (se houver correspondência com a pergunta):
---
CONTEXTO CORPORATIVO DISPONÍVEL:
${matchedContext || "Nenhum documento específico foi vinculado a esta consulta de forma automática. Responda usando boas práticas corporativas gerais e referencie que o funcionário pode consultar o RH ou o TI."}
---

Instruções adicionais cruciais extraídas do Regulamento do Prêmio Firjan de Sustentabilidade 2026 de nossos registros:
- Inscrições: de 03/03/2026 até 02/06/2026 às 23h59.
- Submissão: PDF unificado, max 40 páginas, max 30MB.
- Categorias: Água e Efluentes, Biodiversidade, Mudanças Climáticas, Resíduos Sólidos, Impacto Social, ODS e Governança.
- Contato: premiosustentabilidade@firjan.com.br ou pelo telefone (21) 2563-4410.

Se o usuário perguntar sobre conformidade, reembolso ou integração, use essa base de dados estrita. Ao término, cite gentilmente quais bases corporativas apoiaram sua formulação.`;

  // Instantiate Gemini SDK Server side
  let replyText = "";
  let isFromModelSdk = false;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (key && !key.includes("MY_GEMINI_API_KEY") && key !== "") {
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      if (geminiResponse && geminiResponse.text) {
        replyText = geminiResponse.text;
        isFromModelSdk = true;
      }
    }
  } catch (error: any) {
    console.error("Erro na chamada à API Gemini server-side:", error);
    replyText = `⚠️ **[Conexão Local de Transição]** Desculpe, não conseguimos conectar ao modelo de linguagem de nuvem no momento (${error.message || "Erro de rede"}).\n\nNo entanto, com base no nosso sistema corporativo integrado de RAG, posso confirmar o seguinte:\n\n`;
  }

  // Fallback simulator if SDK failed or key is missing
  if (!isFromModelSdk) {
    // Generate logical answers from our internal high-fidelity mock knowledge base
    if (lowerMsg.includes("firjan") || lowerMsg.includes("sustentabilidade") || lowerMsg.includes("premio") || lowerMsg.includes("regulamento")) {
      replyText += `**Sobre o Prêmio Firjan de Sustentabilidade 2026:**
Consultei o regulamento oficial anexado. As inscrições começaram em **03/03/2026** e estendem-se até **02/06/2026 ás 23h59** (conforme prorrogação formal do edital). 
Os arquivos de submissão do projeto devem ser consolidados em um arquivo único **PDF** com no máximo **30 megabytes** e até **40 páginas**.

O regulamento lista as seguintes 7 categorias:
1. Água e Efluentes
2. Biodiversidade e Serviços Ecossistêmicos
3. Mudanças Climáticas e Transição Energética
4. Resíduos Sólidos
5. Gestão de Impacto e Investimento Social
6. Estratégias de ODS (Agenda 2030)
7. Governança Corporativa

As lideranças do projeto na Firjan são *Lídia Vaz Aguiar e Viviane Parente*, através do e-mail oficial: **premiosustentabilidade@firjan.com.br** ou telefones (21) 2563-4410. Devemos submeter as candidaturas de nossa instituição antes do final do prazo no dia 02 de Junho de 2026!`;
    } else if (lowerMsg.includes("reembolso") || lowerMsg.includes("viagem") || lowerMsg.includes("despesa")) {
      replyText += `**Sobre Reembolsos de Viagem e Despesas Corporativas:**
De acordo com o Manual do Setor Financeiro atualizado:
- Você deve submeter todas as despesas em até **5 dias úteis** após a conclusão da viagem através do nosso módulo.
- É obrigatório digitalizar os comprovantes fiscais (notas válidas).
- Limite diário de alimentação: **R$ 80,00**.
- Deslocamento próprio reembolsado a **R$ 1,10 por quilômetro rodado**.
- O fluxo de liberação exige a aprovação do seu Gestor antes de seguir para pagamento.`;
    } else if (lowerMsg.includes("mfa") || lowerMsg.includes("segurança") || lowerMsg.includes("lgpd") || lowerMsg.includes("senha")) {
      replyText += `**Sobre Diretrizes de Segurança de TI e LGPD:**
Com esteio na nossa normativa interna de segurança digital:
- É mandatório habilitar o **MFA (Autenticação de Múltiplos Fatores)** nas ferramentas corporativas em até **48 horas** de sua contratação.
- Nunca partilhe dados pessoais corporativos ou listas de clientes em canais externos ou não-oficiais (como aplicativos de mensagens pessoais).
- Em qualquer situação anômala ou suspeita de ataque cibernético, notifique prontamente a governança corporativa em: **dpo@cio-ai.com.br**.`;
    } else if (lowerMsg.includes("onboarding") || lowerMsg.includes("trilha") || lowerMsg.includes("começar")) {
      replyText += `**Boas-vindas à Integração Institucional Firjan IA!**
Para iniciar sua imersão com sucesso:
- Navegue até a aba **Integração/Onboarding** para encontrar seus 4 módulos de capacitação.
- Cada módulo concluído adiciona **100 a 150 pontos** de gamificação ao seu perfil.
- Obter **300 pontos** gera automaticamente o seu selo verificado e o certificado de conclusão oficial da Firjan.`;
    } else {
      replyText = `Com base nas diretrizes estratégicas da **Firjan IA**, compreendo sua dúvida de caráter institucional sobre "${message}". 

Para auxiliá-lo de imediato com precisão:
- **Base Recomendada:** Você pode obter informações pesquisando termos como **"Prêmio Firjan Sustentabilidade"**, **"Segurança e LGPD"**, ou **"Reembolsos"** no nosso repositório.
- **Trilhas:** Acesse o menu de **Onboarding/Integração** no painel lateral para sanar dúvidas de integração.
- **Canais Internos:** Se sua dúvida envolver questões específicas, fale com a equipe de Recursos Humanos pelo canal oficial da Firjan.`;
    }
  }

  // Save models answer to chat state
  const modelMsg: ChatMessage = {
    id: `msg-${Date.now()}-reply`,
    role: "model",
    text: replyText,
    timestamp: new Date().toISOString(),
    documentGrounding: groundedDocs.length > 0 ? groundedDocs : undefined,
    suggestedPrompts: groundedDocs.length > 0 ? undefined : [
      "Regulamento Prêmio Firjan 2026",
      "Manual de Reembolsos de Viagens",
      "Termos de MFA e LGPD corporativos"
    ]
  };
  activeChats.push(modelMsg);

  res.json({ success: true, message: modelMsg });
});

// Fetch active chat log
app.get("/api/chat/history", (req, res) => {
  res.json({ chat: activeChats });
});

// Clear active chat log (Reset)
app.post("/api/chat/reset", (req, res) => {
  activeChats = [
    { id: "m-welcome", role: "model", text: "Olá! Chat reiniciado com sucesso. Como posso te guiar hoje com as diretrizes do prêmio Firjan, LGPD ou integração?", timestamp: new Date().toISOString() }
  ];
  res.json({ success: true, chat: activeChats });
});


// --- VITE MIDDLEWARE SETUP ---
// Integrated development mode handling fallback file rendering

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[C.I.O AI Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
