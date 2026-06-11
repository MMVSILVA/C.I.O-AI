import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Cpu, ShieldCheck, Terminal } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Iniciando barramento de segurança...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        // Dynamic status text updates based on loading benchmarks
        if (prev === 25) setStatusText("Carregando bases cognitivas corporativas...");
        if (prev === 55) setStatusText("Sincronizando regulamento Firjan de Sustentabilidade...");
        if (prev === 80) setStatusText("Ajustando barreiras de privacidade e LGPD...");
        
        return prev + 5;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0d] flex flex-col items-center justify-center overflow-hidden z-50 text-white font-sans">
      {/* Decorative cyber backdrop grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e24_1px,transparent_1px),linear-gradient(to_bottom,#1e1e24_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      
      {/* Background neon ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#004f9f]/10 rounded-full filter blur-[125px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f29900]/5 rounded-full filter blur-[125px] pointer-events-none animate-pulse" />
 
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center z-10 text-center px-4"
      >
        <div className="relative mb-6">
          {/* Pulsing neon rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#004f9f] to-[#f29900] blur-xl opacity-35 animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-[#0b1329]/80 border border-[#1e1e24] flex items-center justify-center backdrop-blur-md">
            <Cpu className="w-12 h-12 text-[#3b82f6] animate-pulse" />
          </div>
        </div>
 
        <h1 className="text-4xl md:text-5xl font-black tracking-widest bg-gradient-to-r from-white via-blue-200 to-[#004f9f] bg-clip-text text-transparent">
          FIRJAN IA
        </h1>
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-450 font-mono mt-2.5 select-none font-bold">
          Sistema Firjan • Inteligência Artificial
        </p>
 
        {/* Loader panel */}
        <div className="mt-12 w-80 md:w-96 p-4 rounded-xl bg-black/45 border border-[#1e1e24] backdrop-blur-md shadow-2xl">
          <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mb-2 font-bold">
            <span className="flex items-center gap-1.5 text-sky-300">
              <Terminal className="w-3.5 h-3.5" />
              SYSTEM_BOOT
            </span>
            <span className="text-[#3b82f6] animate-pulse">{progress}%</span>
          </div>
 
          <div className="w-full h-2 bg-black rounded-full overflow-hidden p-0.5 border border-[#1e1e24]">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-[#004f9f] to-[#f29900]"
              style={{ width: `${progress}%` }}
              layoutId="bootProgressBar"
            />
          </div>
 
          <p className="text-[10px] font-mono text-neutral-500 mt-3 truncate text-left flex items-center justify-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            {statusText}
          </p>
        </div>
      </motion.div>
 
      {/* Footer credits in margin */}
      <div className="absolute bottom-8 text-[9px] text-neutral-600 font-mono flex items-center gap-2 z-10 select-none font-bold">
        <span>SECURITY LEVEL: RBAC_HIGH_SEC</span>
        <span>•</span>
        <span>FIRJAN COMPLIANT V3</span>
      </div>
    </div>
  );
}
