import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity } from "lucide-react";
import heroImage from "@assets/pexels-thirdman-7659565_1755038074358.jpg";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  accentText?: string;
  showSearchButton?: boolean;
  isSignedIn?: boolean;
}

export function HeroSection({ 
  title, 
  subtitle, 
  accentText = "Safe. Convenient. Trusted.", 
  showSearchButton = true,
  isSignedIn = false 
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Background Image - Healthcare Professional */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Healthcare professional providing medical consultation and blood pressure check"
          className="w-full h-full object-cover object-center"
        />
        {/* Medical-themed gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/70 to-green-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-transparent to-green-800/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Apple-style large headline */}
            <div 
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.85] text-white text-balance"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            
            {/* Apple-style subtitle */}
            <div className="max-w-4xl mx-auto mb-16">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed mb-8">
                {subtitle}
              </p>
              <p className="text-xl sm:text-2xl font-light text-white">
                {accentText}
              </p>
            </div>
            
            {/* Apple-style CTA buttons */}
            {showSearchButton && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <Link href="/providers">
                  <Button size="lg" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    {isSignedIn ? (
                      <>
                        <Activity className="mr-3 h-6 w-6" />
                        Find Healthcare Providers
                      </>
                    ) : (
                      "Find Providers"
                    )}
                  </Button>
                </Link>
                {!isSignedIn && (
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-xl px-12 py-6 rounded-full font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300">
                      Learn how it works
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10" />
    </section>
  );
}