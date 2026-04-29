interface MedlinkLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function MedlinkLogo({ className = "", showText = true, size = "md" }: MedlinkLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M17 7.5h6a2.2 2.2 0 0 1 2.2 2.2v6.1h6.1a2.2 2.2 0 0 1 2.2 2.2v6a2.2 2.2 0 0 1-2.2 2.2h-6.1v6.1a2.2 2.2 0 0 1-2.2 2.2h-6a2.2 2.2 0 0 1-2.2-2.2v-6.1H8.7a2.2 2.2 0 0 1-2.2-2.2v-6a2.2 2.2 0 0 1 2.2-2.2h6.1V9.7A2.2 2.2 0 0 1 17 7.5z"
            fill="white"
            stroke="url(#markGradient)"
            strokeWidth="3"
            strokeLinejoin="round"
            className="drop-shadow-md"
          />
          <path
            d="M19.1 13.4h1.8a1 1 0 0 1 1 1v5.1h5.1a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1h-5.1v5.1a1 1 0 0 1-1 1h-1.8a1 1 0 0 1-1-1v-5.1H13a1 1 0 0 1-1-1v-1.8a1 1 0 0 1 1-1h5.1v-5.1a1 1 0 0 1 1-1z"
            fill="url(#markGradient)"
            opacity="0.92"
          />
          <defs>
            <linearGradient id="markGradient" x1="5" y1="6" x2="35" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(207, 90%, 54%)" />
              <stop offset="100%" stopColor="hsl(174, 68%, 46%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent ${textSizeClasses[size]} tracking-tight`}>
          Med<span className="text-[hsl(207,90%,54%)]">L</span>ink
        </span>
      )}
    </div>
  );
}
