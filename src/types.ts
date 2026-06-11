export type UserRole = 'Colaborador' | 'Gestor' | 'Administrador' | 'Diretor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sectorId: string;
  avatar?: string;
  points: number; // Gamification points
  mfaEnabled: boolean;
  onboardingProgress: number; // percentage 0-100
}

export interface Sector {
  id: string;
  name: string;
  responsible: string;
  roleDescription: string;
  parentId?: string; // Hierarchical mapping
  connections: string[]; // connects with other sector IDs
  email: string;
  size: number;
}

export interface WikiArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  sectorId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: 'Draft' | 'PendingApproval' | 'Approved';
  tags: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface DocumentMeta {
  id: string;
  filename: string;
  title: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  sectorId: string;
  tags: string[];
  ocrText?: string;
  status: 'Processed' | 'Processing' | 'Failed';
  version: number;
  category: 'Normativo' | 'Processos' | 'Manuais' | 'Regulamentos';
}

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  responsible: string;
  status: 'Pendente' | 'Em Executando' | 'Concluido';
  durationExpected: string;
}

export interface BusinessFlow {
  id: string;
  name: string;
  description: string;
  sectorId: string;
  status: 'Ativo' | 'Rascunho' | 'Inativo';
  steps: FlowStep[];
}

export interface OnboardingModule {
  id: string;
  title: string;
  description: string;
  pointsValue: number;
  isCompleted: boolean;
  duration: string;
  category: 'Cultura' | 'Processos' | 'Segurança' | 'Tecnico';
  lessons: {
    id: string;
    title: string;
    content: string;
    isCompleted: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  documentGrounding?: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  sector: string;
  ip: string;
}
