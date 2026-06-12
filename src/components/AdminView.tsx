import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  ShieldCheck, 
  History, 
  Settings, 
  Terminal, 
  Compass, 
  UserPlus, 
  AlertOctagon, 
  Cpu, 
  CheckCircle2, 
  KeyRound,
  FileText
} from "lucide-react";
import { AuditLog, UserProfile, Sector } from "../types";

interface AdminViewProps {
  user: UserProfile;
  sectors: Sector[];
}

export default function AdminView({ user, sectors }: AdminViewProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'settings'>('users');
  
  // Settings indicators
  const [ragAccuracyLevel, setRagAccuracyLevel] = useState(98);
  const [mfaEnforcedGlobal, setMfaEnforcedGlobal] = useState(true);
  const [activeModel, setActiveModel] = useState("gemini-3.5-flash");
  
  // Simulated list of cataloged employees
  const [employees, setEmployees] = useState<UserProfile[]>([
    { id: "e-1", name: "Alexandre Silva", email: "vinidoctor@gmail.com", role: "Gestor", sectorId: "sec-ti", points: 450, mfaEnabled: true, onboardingProgress: 85 },
    { id: "e-2", name: "Juliana Mendes", email: "juliana@corporativo.com", role: "Colaborador", sectorId: "sec-rh", points: 200, mfaEnabled: false, onboardingProgress: 35 },
    { id: "e-3", name: "Claudio Guedes", email: "claudio@corporativo.com", role: "Gestor", sectorId: "sec-fin", points: 310, mfaEnabled: true, onboardingProgress: 100 },
    { id: "e-4", name: "Renato Albuquerque", email: "renato@corporativo.com", role: "Diretor", sectorId: "sec-dir", points: 500, mfaEnabled: true, onboardingProgress: 100 }
  ]);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/audit-logs");
      const data = await response.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error("Falha ao receber logs de auditoria do servidor.", e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab]);

  const handleUpdateRole = (empId: string, newRole: UserProfile['role']) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        return { ...emp, role: newRole };
      }
      return emp;
    }));
  };

  return (
    <div className="text-slate-800 font-sans space-y-6 animate-fade-in">
      
      {/* Tab select bar */}
      <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl flex-wrap gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-105 flex items-center justify-center shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-mono">Painel de Administração (RBAC)</h2>
            <p className="text-[10px] text-slate-550">Controles de privilégios de usuários, trilhas de auditoria LGPD e chaves da IA.</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono">
          <button 
            onClick={() => setActiveTab('users')}
            className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Users className="w-3.5 h-3.5" />
            Usuários
          </button>
          
          <button 
            onClick={() => setActiveTab('audit')}
            className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <History className="w-3.5 h-3.5" />
            Audit (LGPD)
          </button>
          
          <button 
            onClick={() => { setActiveTab('settings'); fetchLogs(); }}
            className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Settings className="w-3.5 h-3.5" />
            IA & SSO
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC COMPONENT PANEL BASED ON TABS */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl min-h-[400px] shadow-xs">
        
        {/* TAB 1: USERS PRIVILEGES LIST */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-mono uppercase text-blue-600 font-bold">Gerir Cargos & Perfis Admissionais</span>
              <span className="text-[10px] text-slate-400 font-mono">RBAC Enforcement Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                    <th className="py-2 px-3">Colaborador</th>
                    <th className="py-2 px-3">Setor Vinculado</th>
                    <th className="py-2 px-3">Admissão (Onboarding)</th>
                    <th className="py-2 px-3">Privilégios (Função)</th>
                    <th className="py-2 px-3 text-right">Selos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => {
                    const sectorName = sectors.find(s => s.id === emp.sectorId)?.name || emp.sectorId;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-105 text-blue-600 flex items-center justify-center font-bold font-mono">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700">{emp.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-blue-600 font-mono">{sectorName.split(" ")[0]}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-650">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                              <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${emp.onboardingProgress}%` }} />
                            </div>
                            {emp.onboardingProgress}% (XP: {emp.points})
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={emp.role}
                            onChange={(e) => handleUpdateRole(emp.id, e.target.value as any)}
                            className="bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Colaborador">Colaborador</option>
                            <option value="Gestor">Gestor</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Diretor">Diretor</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`text-[9px] uppercase font-mono py-0.5 px-2 rounded-full ${
                            emp.mfaEnabled 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-250/60" 
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {emp.mfaEnabled ? "✓ MFA Ativo" : "✕ Sem MFA"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SYSTEM LOGS TIMELINE */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-mono uppercase text-blue-600 flex items-center gap-1.5 font-bold">
                <Terminal className="w-4 h-4 text-blue-600" />
                Logs Finais de Auditoria (Rastreabilidade)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Conformidade LGPD ativa</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[400px] pr-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200/60 flex flex-wrap justify-between items-center text-xs font-mono gap-3 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                        {log.sector}
                      </span>
                      <strong className="text-slate-700">{log.action}</strong>
                    </div>
                    <p className="text-[10px] text-slate-450">Autor: {log.userEmail} • IP Terminal: {log.ip}</p>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}

              {logs.length === 0 && (
                <p className="text-center font-mono py-6 text-slate-400">Nenhum evento registrado.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MODEL CONFIGS */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div className="pb-2 border-b border-slate-200">
              <span className="text-xs font-mono uppercase text-blue-600 font-bold">Sincronização de Chaves & Motores de IA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 font-bold">
                  <Cpu className="w-4 h-4" />
                  Módulo de Inteligência Artificial
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Modelo Selecionado para o Chat RAG</label>
                    <select
                      value={activeModel}
                      onChange={(e) => setActiveModel(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg p-2.5 text-xs text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recomendado para Q&A)</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Complex reasoning)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Acurácia Semântica Mínima: {ragAccuracyLevel}%</label>
                    <input 
                      type="range"
                      min={80}
                      max={100}
                      value={ragAccuracyLevel}
                      onChange={(e) => setRagAccuracyLevel(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 font-extrabold">
                  <KeyRound className="w-4 h-4" />
                  Conformidade de SSO & MFA
                </h4>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between select-none p-1.5 rounded bg-slate-100/60 hover:bg-slate-100 border border-slate-200/50 transition-colors">
                    <div>
                      <p className="text-slate-700 font-semibold">Exigir MFA Globalmente</p>
                      <p className="text-[9px] text-slate-500">Obrigar todos os novos colaboradores</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={mfaEnforcedGlobal}
                      onChange={(e) => setMfaEnforcedGlobal(e.target.checked)}
                      className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/50 border border-blue-105 rounded-lg text-blue-800 text-[10px] leading-relaxed">
                    ⚙️ Sincronização automática com a ferramenta de **Secrets** do AI Studio concluída. O bot consome a chave do servidor do ambiente.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
