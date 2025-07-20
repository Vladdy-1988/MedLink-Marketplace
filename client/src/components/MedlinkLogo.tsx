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
          
          {/* House outline perfectly centered - rounded corners, no door */}
          <path
            d="M9 21l11-9 11 9v13a2 2 0 01-2 2H11a2 2 0 01-2-2V21z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Heart perfectly centered in house */}
          <path
            d="M20 27l-3-2.5c-2-1.8-3-2.8-3-4.5 0-1.3 1-2.3 2.3-2.3.6 0 1.1.2 1.4.6.3-.4.8-.6 1.4-.6 1.3 0 2.3 1 2.3 2.3 0 1.7-1 2.7-3 4.5L20 27z"
            fill="white"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(207, 90%, 54%)" />
              <stop offset="100%" stopColor="hsl(259, 78%, 60%)" />
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