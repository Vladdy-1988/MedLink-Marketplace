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
          {/* Background circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#gradient)"
            className="drop-shadow-md"
          />
          
          {/* House outline without door */}
          <path
            d="M10 18l10-8 10 8v12a2 2 0 01-2 2H12a2 2 0 01-2-2V18z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Centered Heart */}
          <path
            d="M20 24l-3-2.7c-3.2-2.9-5-4.6-5-7 0-2 1.5-3.5 3.5-3.5 1 0 1.9.5 2.5 1.2.6-.7 1.5-1.2 2.5-1.2 2 0 3.5 1.5 3.5 3.5 0 2.4-1.8 4.1-5 7L20 24z"
            fill="white"
            opacity="0.95"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent ${textSizeClasses[size]} tracking-tight`}>
          Med<span className="text-[hsl(207,90%,54%)]">L</span>ink
        </span>
      )}
    </div>
  );
}