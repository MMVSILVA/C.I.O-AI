import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Send, 
  Sparkles, 
  Trash2, 
  FileText, 
  ArrowUpRight, 
  Cpu, 
  HelpCircle,
  Paperclip,
  RotateCcw,
  BookOpen,
  CloudLightning,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AudioLines
} from "lucide-react";
import { ChatMessage, UserProfile } from "../types";

interface ChatViewProps {
  user: UserProfile;
}

export default function ChatView({ user }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [trainingFile, setTrainingFile] = useState<{ name: string; size: string } | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  // Web Speech API states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  // Suggested pre-filled prompt suggestions
  const initialSuggestions = [
    "Quais as categorias do Prêmio Firjan 2026?",
    "Qual o limite do reembolso de despesa?",
    "Quantos dias tenho para ativar o MFA corporativo?",
    "Como funciona o onboarding?"
  ];

  // Load chat history from server on mount
  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/chat/history");
      const data = await response.json();
      if (data.chat) {
        setMessages(data.chat);
      }
    } catch (e) {
      console.error("Erro ao carregar histórico do chat corporativo", e);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Check Speech Recognition support in current browser (Web Speech API)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stop listening automatically when active speech ends
      rec.interimResults = false;
      rec.lang = "pt-BR"; // Target pt-BR since C.I.O and onboarding is Portuguese

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error("Erro no reconhecimento de fala:", event);
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          setInput(prev => {
            const base = prev.trim();
            return base ? `${base} ${transcript}` : transcript;
          });
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      // Clean up speech synthesis on leave
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, isTraining]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        // Cancel active browser speaking to prevent feedback loops
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          setSpeakingMsgId(null);
        }
        recognitionRef.current.start();
      } catch (e) {
        console.error("Não foi possível iniciar o microfone:", e);
      }
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();

      // Clean up markdown markers for a pure reading
      const cleanText = text
        .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
        .replace(/\*([^*]+)\*/g, "$1") // italic
        .replace(/#[#]*\s/g, "") // headings
        .replace(/`([^`]+)`/g, "$1"); // inline snippets

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "pt-BR";

      // Select adequate Portuguese voice if it exists
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.startsWith("pt"));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onend = () => {
        setSpeakingMsgId(null);
      };
      utterance.onerror = () => {
        setSpeakingMsgId(null);
      };

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend;
    setInput("");
    setLoading(true);

    // Stop speaking if new user message is sent
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }

    // Optimistically insert user's message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      const data = await response.json();
      if (data.success) {
        // Replace list with backend state to match database records
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      // Fallback response inside list
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "Desculpe, ocorreu um erro ao consultar o Firjan IA. Por favor, reinicie e certifique-se de que o backend está respondendo.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = async () => {
    try {
      // Cancel speech synthesis on reset
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      }
      const response = await fetch("/api/chat/reset", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setMessages(data.chat);
        setTrainingFile(null);
      }
    } catch {
      console.error("Falha ao resetar diálogo.");
    }
  };

  // Upload/Training Document Simulation
  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cancel speech synthesis on simulation start
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }

    setTrainingFile({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB" });
    setIsTraining(true);
    setTrainingProgress(10);

    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Inject document training to server state automatically
          fetch("/api/documents/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: file.name.replace(".pdf", "").replace(".docx", ""),
              filename: file.name,
              category: "Manuais",
              tags: ["Treinamento-IA", "Custom-Doc"]
            })
          }).then(() => {
            // Push message to chat confirming OCR integration
            setMessages(prevChat => [...prevChat, {
              id: `train-${Date.now()}`,
              role: "model",
              text: `💡 **[Firjan IA Base Cognitiva Sincronizada]** Concluí o processamento OCR do documento corporativo **"${file.name}"**. Conceitos mapeados e disponíveis para consultas estruturadas via RAG a partir de agora!`,
              timestamp: new Date().toISOString()
            }]);
            setIsTraining(false);
          });

          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] text-slate-800 font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl mb-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#003BD1]/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#003BD1]" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5 text-slate-850 font-sans">
              Firjan IA Copiloto
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
            </h2>
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 bg-[#003BD1] rounded-full animate-pulse" />
              Modelo: Gemini 3.5-Flash RAG Ativo {speechSupported && "• Voz Disponível"}
            </p>
          </div>
        </div>

        <button 
          onClick={handleResetChat}
          title="Nova Conversa"
          className="p-2 px-3.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250 text-xs font-mono text-slate-500 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpar Conversa
        </button>
      </div>

      {/* Main chat body log list */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 select-text"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 border transition-all ${
                msg.role === 'user'
                  ? "bg-blue-50/80 border-blue-200 text-slate-800 shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 leading-relaxed font-normal shadow-sm"
              }`}
            >
              {/* Message Meta Info */}
              <div className={`flex items-center gap-4 mb-2 text-[10px] font-mono justify-between ${msg.role === 'user' ? 'text-[#003BD1]/80' : 'text-slate-400'}`}>
                <span className="font-extrabold uppercase tracking-wide flex items-center gap-1">
                  {msg.role === 'user' ? "Você (Funcionário)" : "Firjan IA Assistente"}
                </span>
                
                <div className="flex items-center gap-2">
                  {msg.role === 'model' && (
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className="p-1 px-2 hover:bg-slate-100 rounded text-slate-500 hover:text-[#003BD1] transition-all cursor-pointer flex items-center gap-1 border border-slate-150 bg-slate-50 animate-fade-in"
                      title="Ouvir resposta sintetizada de voz"
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3 h-3 text-rose-500 animate-pulse" />
                          <span className="text-[9px] text-rose-500 font-bold uppercase font-mono">Parar</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-slate-505" />
                          <span className="text-[9px] font-bold uppercase font-mono">Ouvir</span>
                        </>
                      )}
                    </button>
                  )}
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Msg Content */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed select-text font-sans">
                {msg.text}
              </div>

              {/* Grounding references link */}
              {msg.documentGrounding && (
                <div className="mt-3.5 pt-2 border-t border-slate-100 space-y-1.5">
                  <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest flex items-center gap-1 font-bold">
                    <BookOpen className="w-3 h-3 text-emerald-600" /> Fonte Base Corporativa Sincronizada:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.documentGrounding.map((g, gi) => (
                      <span key={gi} className="text-[10px] bg-emerald-50 border border-emerald-150 text-emerald-700 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-mono font-bold shadow-2xs">
                        <FileText className="w-3 h-3 text-emerald-600" />
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Training dynamic loaders */}
        {isTraining && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-250 rounded-2xl p-4 max-w-sm space-y-2 shadow-sm">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-600 animate-pulse flex items-center gap-1.5 font-bold">
                  <CloudLightning className="w-4 h-4 text-emerald-500" />
                  Minerando OCR Corporativo ...
                </span>
                <span className="text-slate-600">{trainingProgress}%</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{trainingFile?.name}</p>
              <div className="w-full h-1.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-[#003BD1] to-emerald-500 rounded-full" style={{ width: `${trainingProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Standard AI response loader */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 w-48 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#003BD1] animate-bounce animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-305 animate-bounce [animation-delay:0.4s]" />
              Sincronizando IA ...
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts list panel if no messages are present yet, or helper trigger */}
      {messages.length <= 1 && !loading && (
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 mb-4 shrink-0 shadow-xs">
          <p className="text-xs font-sans text-[#003BD1] mb-2.5 flex items-center gap-1.5 font-bold">
            <HelpCircle className="w-4 h-4 text-[#003BD1]" />
            Para começar, clique em uma das sugestões ou faça perguntas sobre o onboarding:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {initialSuggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-left py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#003BD1] hover:text-[#003BD1] text-slate-700 transition-all cursor-pointer flex items-center justify-between font-medium shadow-2xs text-[11px]"
              >
                <span>{sug}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 hover:text-[#003BD1]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel prompt box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
        className="flex gap-2.5 items-center bg-white p-3 rounded-2xl border border-slate-200 shrink-0 shadow-sm"
      >
        {/* Document attachment integration */}
        <label className="p-2.5 rounded-xl border border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-550 transition-all cursor-pointer" title="Anexar documento PDF/DOCX">
          <Paperclip className="w-4.5 h-4.5" />
          <input 
            type="file" 
            accept=".pdf,.docx,.txt" 
            className="hidden" 
            onChange={handleUploadSimulate} 
          />
        </label>

        {/* Voice command microphone button (Web Speech API) */}
        {speechSupported ? (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer relative flex items-center justify-center ${
              isListening 
                ? "bg-rose-50 border-rose-300 text-rose-600 shadow-xs ring-2 ring-rose-300 animate-pulse" 
                : "border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-550"
            }`}
            title={isListening ? "Parar de ouvir (Microfone ativo)" : "Falar comando de voz (Speech-to-Text)"}
          >
            {isListening ? (
              <MicOff className="w-4.5 h-4.5 text-rose-600" />
            ) : (
              <Mic className="w-4.5 h-4.5 text-slate-500" />
            )}
            
            {/* Ambient indicator of speaking visual feedback */}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            className="p-2.5 rounded-xl border border-slate-200 opacity-40 cursor-not-allowed text-slate-400"
            disabled
            title="Reconhecimento de fala indisponível no navegador atual"
          >
            <MicOff className="w-4.5 h-4.5" />
          </button>
        )}

        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Ouvindo... Fale sua dúvida sobre a Firjan agora!" : "Pergunte ao Firjan IA... (ou fale pelo microfone)"}
          className="flex-1 bg-transparent py-2 px-1 focus:outline-none text-sm text-slate-850 placeholder-slate-400"
          disabled={loading || isTraining}
        />

        <button 
          type="submit"
          disabled={loading || isTraining || !input.trim()}
          className="p-3 bg-[#003BD1] hover:bg-[#002cb3] disabled:opacity-30 disabled:hover:bg-[#003BD1] rounded-xl transition-all cursor-pointer shrink-0 shadow"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
