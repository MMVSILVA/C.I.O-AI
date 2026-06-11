import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  FileText, 
  Search, 
  Upload, 
  Tag, 
  Compass, 
  Eye, 
  Trash, 
  CloudLightning, 
  Cpu, 
  CheckCircle2, 
  FileSearch,
  Filter
} from "lucide-react";
import { DocumentMeta, UserProfile } from "../types";

interface DocsViewProps {
  user: UserProfile;
}

export default function DocsView({ user }: DocsViewProps) {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMeta | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // For uploading animation state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<'Normativo' | 'Processos' | 'Manuais' | 'Regulamentos'>('Manuais');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchDocs = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
        if (!selectedDoc && data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar documentos", e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Trigger actual backend POST simulation with the dynamic metadata
          fetch("/api/documents/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: uploadTitle,
              filename: uploadFile ? uploadFile.name : `${uploadTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`,
              category: uploadCategory,
              tags: ["OCR", "Indexado", uploadCategory]
            })
          }).then(async (res) => {
            const data = await res.json();
            if (data.success) {
              setUploading(false);
              setUploadTitle("");
              setUploadFile(null);
              fetchDocs();
              
              // Automatically select the newly created document
              setSelectedDoc(data.document);
            }
          });
          
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Filter logic: Search input queries title + category + tag list + OCR text!
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.ocrText || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="text-[#f4f4f5] font-sans grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      
      {/* Left side: Upload Form + Document listing (span 5) */}
      <div className="lg:col-span-5 bg-[#0a0f21]/90 border border-[#1e293b] p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md h-full shadow-xl">
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#3b82f6] flex items-center gap-1.5 font-bold">
              <Compass className="w-4 h-4 text-blue-400" />
              Repositório OCR Corporativo
            </h3>
            <span className="text-[10px] text-neutral-500 font-mono font-bold">LGPD Sec</span>
          </div>

          {/* Quick upload drop simulator */}
          <form onSubmit={handleSimulatedUpload} className="p-3 bg-black border border-[#1e293b] rounded-xl space-y-2.5">
            <span className="text-[10px] font-mono text-[#10b981] uppercase block tracking-wider font-extrabold">Submeter Novo PDF com OCR</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input 
                type="text" 
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Título do Documento"
                className="bg-[#050505] border border-[#1e293b] rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 text-white focus:outline-none"
                required
              />
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
                className="bg-[#050505] border border-[#1e293b] rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-blue-500"
              >
                <option value="Manuais">Manuais</option>
                <option value="Normativo">Normativos</option>
                <option value="Processos">Processos</option>
                <option value="Regulamentos">Regulamentos</option>
              </select>
            </div>

            {uploading ? (
              <div className="space-y-1 py-1">
                <div className="flex justify-between text-[10px] font-mono text-blue-400">
                  <span className="animate-pulse">Extraindo Texto via OCR...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden p-0.5 border border-[#1e293b]">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-[#10b981] rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-[#1e293b] hover:border-blue-500/20 rounded-lg text-xs bg-neutral-900/10 cursor-pointer text-neutral-400 hover:text-white transition-all">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>{uploadFile ? uploadFile.name : "Selecionar PDF"}</span>
                  <input 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                        setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                      }
                    }} 
                  />
                </label>
                <button
                  type="submit"
                  disabled={!uploadTitle}
                  className="py-2 px-4.5 bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold uppercase rounded-lg text-white transition-all cursor-pointer shadow disabled:opacity-30"
                >
                  Indexar
                </button>
              </div>
            )}
          </form>

          {/* Search filter components */}
          <div className="space-y-2">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar em títulos, tags ou OCR..."
                className="w-full bg-[#050505] border border-[#1e293b] rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500 text-white"
              />
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {["All", "Normativo", "Processos", "Manuais", "Regulamentos"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[9px] font-mono uppercase px-2 py-1 rounded-md border transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-blue-600 border-[#1e293b] text-white"
                      : "bg-[#050505] border-[#1e293b] text-neutral-400 hover:text-white hover:bg-[#0d0d10]"
                  }`}
                >
                  {cat === "All" ? "Todos" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Core file inventory */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-420px)] pr-1">
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between cursor-pointer ${
                  selectedDoc?.id === doc.id
                    ? "bg-blue-950/15 border-blue-500/30"
                    : "bg-black/30 border-[#1e293b] hover:border-blue-500/15"
                }`}
              >
                <div className="min-w-0 pr-2 space-y-1">
                  <p className="font-semibold text-neutral-200 truncate">{doc.title}</p>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase">{doc.filename} • {doc.fileSize}</p>
                </div>
                <div className="flex flex-col items-end shrink-0 justify-center">
                  <span className="text-[8px] uppercase tracking-wider font-mono font-bold bg-[#050505] border border-[#1e293b] text-neutral-400 px-1.5 py-0.5 rounded">
                    {doc.category}
                  </span>
                </div>
              </button>
            ))}

            {filteredDocs.length === 0 && (
              <p className="text-center text-xs text-neutral-550 font-mono py-6">Nenhum documento atende aos filtros.</p>
            )}
          </div>
        </div>

        <div className="text-[9px] font-mono text-neutral-500 leading-relaxed pt-2 border-t border-[#1e293b] select-none">
          <span>SECURE REPOSITORY • INTEGRADO COM RAG COGNITIVO</span>
        </div>
      </div>

      {/* Right side: Selected Document Metadata & OCR Preview Panel (span 7) */}
      <div className="lg:col-span-7 bg-[#0a0f21]/90 border border-[#1e293b] rounded-2xl p-6 backdrop-blur-md flex flex-col overflow-y-auto h-full shadow-xl">
        {selectedDoc ? (
          <div className="space-y-5">
            
            {/* Header info */}
            <div className="pb-4 border-b border-[#1e293b] space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-blue-300 bg-blue-950/20 border border-blue-500/15 px-2.5 py-0.5 rounded uppercase font-bold text-[9px]">
                  {selectedDoc.category}
                </span>
                <span className="text-neutral-500 uppercase">Enviado em: {new Date(selectedDoc.uploadedAt).toLocaleDateString('pt-BR')}</span>
              </div>

              <h2 className="text-lg font-extrabold text-white">{selectedDoc.title}</h2>
              
              <div className="flex items-center gap-3 text-xs text-neutral-400 pt-0.5">
                <span className="font-mono">Faturamento: {selectedDoc.uploadedBy}</span>
                <span>•</span>
                <span className="font-mono">Tamanho: {selectedDoc.fileSize}</span>
              </div>
            </div>

            {/* tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedDoc.tags.map((tag, idx) => (
                <span key={idx} className="bg-black border border-[#10b981]/25 text-neutral-300 text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#10b981]" />
                  {tag}
                </span>
              ))}
            </div>

            {/* OCR Extracted display block */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#10b981] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <CloudLightning className="w-4 h-4 text-[#10b981]" />
                Texto Analítico do OCR Sincronizado
              </span>

              <div className="bg-[#050505]/75 p-4 rounded-xl border border-[#1e293b] text-xs font-mono text-neutral-200 leading-relaxed text-justify relative min-h-36 select-text">
                
                {selectedDoc.ocrText ? (
                  <p>{selectedDoc.ocrText}</p>
                ) : (
                  <p className="text-neutral-500 italic">O texto correspondente está sendo minerado pela máquina de OCR.</p>
                )}

                {/* Cyber style scanner accent overlay */}
                <div className="absolute top-1 right-2 p-1 text-[8px] bg-blue-950/40 border border-blue-500/20 text-blue-400 font-bold uppercase rounded">
                  Status: Processed_Secure
                </div>
              </div>
            </div>

            {/* AI Action suggestion warning */}
            <div className="p-3.5 bg-blue-950/10 border border-blue-500/10 rounded-xl text-xs text-blue-300 flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-[#10b981]" />
              <p className="font-mono text-[11px] leading-normal">
                Este arquivo já está integrado ao copiloto institucional! Vá ao menu do **Chat IA** e faça perguntas com o termo **"{selectedDoc.title.split(" ").slice(0, 2).join(" ")}"** para testar as conexões RAG em tempo real.
              </p>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-500 py-12">
            <FileSearch className="w-12 h-12 text-blue-400/20 mb-3 animate-pulse" />
            <p className="text-xs font-mono">Nenhum espécime documental selecionado no repositório</p>
          </div>
        )}
      </div>

    </div>
  );
}
