import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  FileText, 
  User, 
  Clock, 
  Tag, 
  Bookmark, 
  Heart, 
  Lock, 
  ClipboardCheck, 
  Settings, 
  Layers, 
  MessageSquareOff,
  CornerDownRight,
  SendHorizontal
} from "lucide-react";
import { WikiArticle, UserProfile, Sector } from "../types";

interface WikiViewProps {
  user: UserProfile;
  sectors: Sector[];
}

export default function WikiView({ user, sectors }: WikiViewProps) {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);
  
  // Create state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTagsStr, setNewTagsStr] = useState("");
  const [newSector, setNewSector] = useState("sec-ti");

  // Comment state
  const [commentText, setCommentText] = useState("");

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/wiki");
      const data = await response.json();
      if (data.articles) {
        setArticles(data.articles);
        if (!selectedArticle && data.articles.length > 0) {
          setSelectedArticle(data.articles[0]);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar base wiki", e);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const parsedTags = newTagsStr.split(",").map(t => t.trim()).filter(t => t !== "");
      const res = await fetch("/api/wiki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          sectorId: newSector,
          tags: parsedTags.length > 0 ? parsedTags : ["Geral"]
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsCreating(false);
        setNewTitle("");
        setNewContent("");
        setNewTagsStr("");
        fetchArticles();
        
        // Select the newly created article automatically
        setSelectedArticle(data.article);
      }
    } catch {
      console.error("Erro ao submeter artigo wiki corporativo.");
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedArticle) return;

    try {
      const res = await fetch(`/api/wiki/${selectedArticle.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update inside selected article to display immediately
        setSelectedArticle(prev => {
          if (!prev) return null;
          return {
            ...prev,
            comments: [...prev.comments, data.comment]
          };
        });
        setCommentText("");
        // Reload global list
        fetchArticles();
      }
    } catch {
      console.error("Falha ao comentar.");
    }
  };

  // Simulate Content Approval Workflow
  const handleApproveArticle = (artId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === artId) {
        return {
          ...art,
          status: 'Approved' as const,
          version: art.version + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return art;
    }));

    if (selectedArticle && selectedArticle.id === artId) {
      setSelectedArticle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'Approved' as const,
          version: prev.version + 1,
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  return (
    <div className="text-slate-800 font-sans grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* Sidebar: Articles List */}
      <div className="lg:col-span-4 bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between h-full shadow-sm">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#003BD1] flex items-center gap-1.5 font-bold">
              <Layers className="w-4 h-4 text-[#003BD1]" />
              Wiki Institucional
            </h3>
            
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer border border-[#003BD1]/10 text-[#003BD1]"
            >
              <Plus className="w-3.5 h-3.5" /> Novo Artigo
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            {articles.map((art) => {
              const secName = sectors.find(s => s.id === art.sectorId)?.name || "Geral";
              return (
                <button
                  key={art.id}
                  onClick={() => { setSelectedArticle(art); setIsCreating(false); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between cursor-pointer ${
                    selectedArticle?.id === art.id && !isCreating
                      ? "bg-blue-50/80 border-[#003BD1]/25 shadow-xs"
                      : "bg-slate-50/50 border-slate-200/60 hover:border-[#003BD1]/20 animate-fade-in"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-800 truncate">{art.title}</p>
                    <p className="text-[10px] text-[#003BD1] mt-1 font-medium">{secName}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="text-[8px] font-mono text-slate-450">v{art.version}</span>
                    <span className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded ${
                      art.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : 'bg-amber-50 text-amber-700 border border-amber-250'
                    }`}>
                      {art.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center gap-1 leading-relaxed">
          <span>COAUTHOR PRIVILEGE CONTROLS (RBAC)</span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col overflow-y-auto h-full shadow-sm">
        
        {/* CREATE NEW ARTICLE FORM */}
        {isCreating ? (
          <form onSubmit={handleCreateArticle} className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-600 pb-2 border-b border-slate-100 uppercase tracking-wider font-mono font-bold">
              Formular Novo Artigo Estruturado
            </h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-mono">Título do Artigo</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ex: Procedimento Operacional de Treinamento e Segurança"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#003BD1] text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-mono">Setor Proprietário</label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-750"
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-mono">Tags (Separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  placeholder="ex: Normas, TI, Sustentabilidade"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#003BD1] text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-mono font-bold">Markdown do Artigo (No estilo Notion Editor)</label>
              <textarea 
                rows={10}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`Use markdown para enriquecer o texto. ex: 
### 1. Instruções de Treino
O colaborador deve iniciar...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#003BD1] leading-relaxed text-slate-850"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2 justify-end">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-250 hover:bg-slate-50 text-xs font-mono font-bold uppercase transition-all cursor-pointer text-slate-600"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#003BD1] hover:bg-[#002cb3] text-xs font-mono font-bold uppercase transition-all text-white cursor-pointer shadow"
              >
                Publicar na Base Corporativa
              </button>
            </div>
          </form>
        ) : selectedArticle ? (
          <div className="space-y-6">
            
            {/* Read mode header */}
            <div className="border-b border-slate-150 pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] bg-blue-50 border border-[#003BD1]/15 text-[#003BD1] font-mono px-2.5 py-0.5 rounded uppercase tracking-wider font-extrabold">
                  {sectors.find(s => s.id === selectedArticle.sectorId)?.name || "Geral"}
                </span>

                <div className="flex gap-2">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Versão: {selectedArticle.version}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-800">{selectedArticle.title}</h2>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[#003BD1]" /> Autor: {selectedArticle.author}
                  </span>
                  <span>•</span>
                  <span>Publicado em: {new Date(selectedArticle.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>

                {/* Workflow approvals for Managers/Admins */}
                {selectedArticle.status === 'PendingApproval' && (user.role === 'Gestor' || user.role === 'Administrador') && (
                  <button
                    onClick={() => handleApproveArticle(selectedArticle.id)}
                    className="p-1 px-3.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" /> Aprovar Documento
                  </button>
                )}
              </div>
            </div>

            {/* Read main container content, formatted dynamically */}
            <div className="p-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-sans select-text">
              {selectedArticle.content}
            </div>

            {/* Article category tag items */}
            {selectedArticle.tags && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                {selectedArticle.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-slate-600 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Tag className="w-3 h-3 text-emerald-600" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* COLLABORATIVE COMMODITY TIMELINE - Real comment interactions */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-sans uppercase tracking-wider text-[#003BD1] font-bold">
                Anotações & Comentários ({selectedArticle.comments.length})
              </h4>

              {/* Action commenting */}
              <form onSubmit={submitComment} className="flex gap-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Deixar anotação colaborativa para os leitores..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:border-[#003BD1]"
                  required
                />
                <button 
                  type="submit" 
                  className="p-2.5 px-4 bg-[#003BD1] hover:bg-[#002cb3] rounded-xl text-xs font-sans font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <SendHorizontal className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Feed of comments */}
              <div className="space-y-3">
                {selectedArticle.comments.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-mono py-1">Nenhum comentário na versão corrente.</p>
                ) : (
                  selectedArticle.comments.map((comm) => (
                    <div key={comm.id} className="p-3 bg-slate-50/40 rounded-xl border border-slate-200 flex gap-3 text-xs animate-fade-in">
                      <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] text-[#003BD1] shrink-0 font-bold uppercase font-mono">
                        {comm.authorName.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-slate-800">{comm.authorName}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{new Date(comm.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-600 font-mono text-[11px] leading-relaxed flex items-center gap-1">
                          <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {comm.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
            <MessageSquareOff className="w-12 h-12 text-slate-350/50 mb-3" />
            <p className="text-xs font-mono">Nenhum artigo selecionado</p>
          </div>
        )}

      </div>

    </div>
  );
}
