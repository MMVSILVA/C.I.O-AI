import React from "react";

interface AppLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
  theme?: "light" | "dark";
}

export default function AppLogo({ className = "", size = "md", iconOnly = false, theme = "light" }: AppLogoProps) {
  // Dimensions map based on size
  const sizes = {
    xs: { width: iconOnly ? 24 : 85, height: 24, iconSize: 22 },
    sm: { width: iconOnly ? 32 : 110, height: 32, iconSize: 30 },
    md: { width: iconOnly ? 44 : 155, height: 44, iconSize: 40 },
    lg: { width: iconOnly ? 64 : 225, height: 64, iconSize: 58 },
    xl: { width: iconOnly ? 110 : 360, height: 110, iconSize: 100 }
  };

  const currentSize = sizes[size];
  const isDark = theme === "dark";

  // Stylized vectors for the flowing ribbon "C" flame
  const renderIcon = (dSize: number) => (
    <svg
      width={dSize}
      height={dSize}
      viewBox="0 0 100 100"
      className="overflow-visible select-none shrink-0"
    >
      <defs>
        {/* Dynamic gradient definitions matching Firjan & Cyber tones */}
        <linearGradient id="logoFlameGrad" x1="0%" y1="90%" x2="90%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo */}
          <stop offset="35%" stopColor="#7C3AED" /> {/* Purple */}
          <stop offset="65%" stopColor="#003BD1" /> {/* Firjan Blue */}
          <stop offset="100%" stopColor="#00FFFF" /> {/* Aqua Cyan */}
        </linearGradient>

        <linearGradient id="innerRibbonGrad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#003BD1" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        <radialGradient id="flameCoreHighlight" cx="65%" cy="30%" r="35%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#CEF6FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#003BD1" stopOpacity="0" />
        </radialGradient>

        <filter id="flameBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Stylized flowing "C" path */}
      {/* Outer elegant ribbon sweep */}
      <path
        d="M 68 28 C 45 8, 12 25, 12 55 C 12 78, 30 90, 52 90 C 72 90, 84 76, 85 64 C 85.5 58, 79 56, 76 60 C 70 71, 58 78, 48 78 C 30 78, 24 64, 24 50 C 24 34, 38 22, 58 22 C 68 22, 75 28, 77 35 C 78.5 40, 84 41, 85 35 C 87 23, 78 8, 68 28 Z"
        fill="url(#logoFlameGrad)"
        className="drop-shadow-xs"
      />

      {/* Inner supportive 3D flow crease */}
      <path
        d="M 52 82 C 34 82, 21 68, 20 50 C 19 33, 31 18, 48 16 C 58 15, 62 18, 64 22 C 65 24, 61 28, 58 27 C 48 24, 34 32, 32 48 C 30 63, 40 72, 53 72 C 60 72, 65 67, 68 62 C 70 59, 74 61, 73 64 C 68 76, 61 82, 52 82 Z"
        fill="url(#innerRibbonGrad)"
        opacity="0.85"
      />

      {/* The upper flame flare termination */}
      <path
        d="M 62 25 C 65 14, 75 5, 80 8 C 85 11, 82 25, 78 32 C 74 38, 66 40, 62 35 C 58 31, 59 36, 62 25 Z"
        fill="url(#logoFlameGrad)"
        filter="url(#flameBlur)"
      />

      {/* Burning energy flare source core inside the flame tip */}
      <circle
        cx="72"
        cy="22"
        r="11"
        fill="url(#flameCoreHighlight)"
        className="animate-pulse"
      />
      <circle
        cx="72"
        cy="22"
        r="3"
        fill="#FFFFFF"
      />
    </svg>
  );

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} id="app-logo-icon">
        {renderIcon(currentSize.iconSize)}
      </div>
    );
  }

  // Full combination: Icon + "C.I.O AI" text + subtext matching attached image EXACTLY
  return (
    <div className={`flex items-center gap-3 select-none text-left ${className}`} id="app-logo-full">
      {/* Dynamic sized Icon */}
      {renderIcon(currentSize.iconSize)}

      {/* Branded Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline relative">
          <span className={`font-sans tracking-tight font-black ${
            size === "xs" ? "text-base" :
            size === "sm" ? "text-lg" :
            size === "md" ? "text-2xl" :
            size === "lg" ? "text-3xl" : "text-5xl"
          } ${isDark ? "text-white" : "text-[#0F172A]"}`}>
            C.I.O
          </span>
          <span className={`font-sans tracking-tight font-black ml-1.5 bg-gradient-to-r from-[#7C3AED] via-[#003BD1] to-[#01B9FE] bg-clip-text text-transparent relative ${
            size === "xs" ? "text-base" :
            size === "sm" ? "text-lg" :
            size === "md" ? "text-2xl" :
            size === "lg" ? "text-3xl" : "text-5xl"
          }`}>
            AI
            {/* The little shiny star sparkle directly over the 'i' of 'AI' */}
            <span className="absolute -top-1 right-[-4px] animate-pulse">
              <svg
                width={size === "xs" ? "8" : size === "sm" ? "10" : size === "md" ? "12" : "16"}
                height={size === "xs" ? "8" : size === "sm" ? "10" : size === "md" ? "12" : "16"}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 0L14.88 9.12L24 12L14.88 14.88L12 24L9.12 14.88L0 12L9.12 9.12L12 0Z"
                  fill="#00FFFF"
                />
              </svg>
            </span>
          </span>
        </div>
        
        {/* Caption subtext */}
        <span className={`font-sans font-medium tracking-normal mt-1 block opacity-85 shrink-0 ${
          size === "xs" ? "text-[6px] tracking-tight mt-0.5" :
          size === "sm" ? "text-[8px]" :
          size === "md" ? "text-[9.5px]" :
          size === "lg" ? "text-[12px]" : "text-[14px]"
        } ${isDark ? "text-slate-350" : "text-slate-500"}`}>
          Corporate Intelligence & Onboarding AI
        </span>
      </div>
    </div>
  );
}
