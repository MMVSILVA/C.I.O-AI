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
    <div className="text-[#f4f4f5] font-sans grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* Sidebar: Articles List */}
      <div className="lg:col-span-4 bg-[#0a0f21]/90 border border-[#1e293b] p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-blue-400 flex items-center gap-1.5 font-bold">
              <Layers className="w-4 h-4" />
              Wiki Institucional
            </h3>
            
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1 px-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer border border-blue-500/25"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" /> Novo Artigo
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
                      ? "bg-blue-950/15 border-blue-500/25 shadow-md"
                      : "bg-[#050505]/40 border-[#1e293b]/60 hover:border-blue-500/15 animate-fade-in"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-neutral-200 truncate">{art.title}</p>
                    <p className="text-[10px] text-blue-400 mt-1">{secName}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="text-[8px] font-mono text-neutral-500">v{art.version}</span>
                    <span className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1 rounded ${
                      art.status === 'Approved' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/15' : 'bg-amber-950/40 text-amber-300 border border-amber-500/10'
                    }`}>
                      {art.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1e293b] text-[10px] font-mono text-neutral-500 flex items-center gap-1 leading-relaxed">
          <span>COAUTHOR PRIVILEGE CONTROLS (RBAC)</span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="lg:col-span-8 bg-[#0a0f21]/90 border border-[#1e293b] rounded-2xl p-6 backdrop-blur-md flex flex-col overflow-y-auto h-full shadow-xl">
        
        {/* CREATE NEW ARTICLE FORM */}
        {isCreating ? (
          <form onSubmit={handleCreateArticle} className="space-y-4">
            <h3 className="text-sm font-semibold text-[#10b981] pb-2 border-b border-[#1e293b] uppercase tracking-wider font-mono font-bold">
              Formular Novo Artigo Estruturado
            </h3>

            <div className="space-y-1">
              <label className="text-xs text-blue-400 font-mono">Título do Artigo</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ex: Procedimento Operacional de Treinamento e Segurança"
                className="w-full bg-[#030303] border border-[#1e293b] rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-blue-400 font-mono">Setor Proprietário</label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full bg-[#030303] border border-[#1e293b] rounded-xl p-3 text-xs text-neutral-300"
                >
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-blue-400 font-mono">Tags (Separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  placeholder="ex: Normas, TI, Sustentabilidade"
                  className="w-full bg-[#030303] border border-[#1e293b] rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-blue-400 font-mono font-bold">Markdown do Artigo (No estilo Notion Editor)</label>
              <textarea 
                rows={10}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`Use markdown para enriquecer o texto. ex: 
### 1. Instruções de Treino
O colaborador deve iniciar...`}
                className="w-full bg-[#030303] border border-[#1e293b] rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-blue-500 leading-relaxed text-white"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2 justify-end">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl border border-[#1e293b] hover:bg-white/5 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold uppercase transition-all text-white cursor-pointer shadow"
              >
                Publicar na Base Corporativa
              </button>
            </div>
          </form>
        ) : selectedArticle ? (
          <div className="space-y-6">
            
            {/* Read mode header */}
            <div className="border-b border-[#1e293b] pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] bg-blue-950/25 border border-blue-500/15 text-blue-300 font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                  {sectors.find(s => s.id === selectedArticle.sectorId)?.name || "Geral"}
                </span>

                <div className="flex gap-2">
                  <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#10b981]" /> Versão: {selectedArticle.version}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-white">{selectedArticle.title}</h2>

              <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-blue-400" /> Autor: {selectedArticle.author}
                  </span>
                  <span>•</span>
                  <span>Publicado em: {new Date(selectedArticle.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>

                {/* Workflow approvals for Managers/Admins */}
                {selectedArticle.status === 'PendingApproval' && (user.role === 'Gestor' || user.role === 'Administrador') && (
                  <button
                    onClick={() => handleApproveArticle(selectedArticle.id)}
                    className="p-1 px-3.5 bg-[#10b981] text-black hover:bg-emerald-400 text-[10px] font-bold uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" /> Aprovar Documento
                  </button>
                )}
              </div>
            </div>

            {/* Read main container content, formatted dynamically */}
            <div className="p-1 text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap font-sans select-text">
              {selectedArticle.content}
            </div>

            {/* Article category tag items */}
            {selectedArticle.tags && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1e293b]">
                {selectedArticle.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-neutral-400 bg-black border border-[#1e293b] py-1 px-2.5 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#10b981]" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* COLLABORATIVE COMMODITY TIMELINE - Real comment interactions */}
            <div className="space-y-4 pt-6 border-t border-[#1e293b]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-blue-300">
                Anotações & Comentários ({selectedArticle.comments.length})
              </h4>

              {/* Action commenting */}
              <form onSubmit={submitComment} className="flex gap-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Deixar anotação colaborativa para os leitores..."
                  className="flex-1 bg-[#050505] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
                  required
                />
                <button 
                  type="submit" 
                  className="p-2.5 px-4 bg-blue-650 hover:bg-blue-600 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <SendHorizontal className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Feed of comments */}
              <div className="space-y-3">
                {selectedArticle.comments.length === 0 ? (
                  <p className="text-[10px] text-neutral-500 font-mono py-1">Nenhum comentário na versão corrente.</p>
                ) : (
                  selectedArticle.comments.map((comm) => (
                    <div key={comm.id} className="p-3 bg-[#050505]/40 rounded-xl border border-[#1e293b] flex gap-3 text-xs animate-fade-in">
                      <div className="w-6 h-6 rounded-full bg-blue-950/20 border border-[#1e293b] flex items-center justify-center text-[10px] text-[#10b981] shrink-0 font-bold uppercase font-mono">
                        {comm.authorName.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-200">{comm.authorName}</span>
                          <span className="text-[9px] text-neutral-500 font-mono">{new Date(comm.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-neutral-400 font-mono text-[11px] leading-relaxed flex items-center gap-1">
                          <CornerDownRight className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
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
          <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-500 py-12">
            <MessageSquareOff className="w-12 h-12 text-blue-400/20 mb-3" />
            <p className="text-xs font-mono">Nenhum artigo selecionado</p>
          </div>
        )}

      </div>

    </div>
  );
}
