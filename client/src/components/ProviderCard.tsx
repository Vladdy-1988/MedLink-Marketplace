import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, CheckCircle, Heart, Clock, MessageCircle, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Provider {
  id: number;
  userId?: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: string;
  description: string;
  image: string;
  verified: boolean;
  tags: string[];
  rapidService?: boolean;
}

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleMessageProvider = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to message healthcare providers and get personalized quotes",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }

    setIsMessaging(true);
    try {
      // First, find the provider's user ID
      const providerResponse = await apiRequest("GET", `/api/providers/${provider.id}`);
      const providerData = await providerResponse.json();
      
      if (!providerData.userId) {
        throw new Error("Provider user ID not found");
      }

      // Send an initial message
      const messageData = {
        receiverId: providerData.userId,
        content: `Hi ${provider.name}, I'm interested in your healthcare services and would like to get a personalized quote. Could you please provide more information about your availability and pricing? Thank you!`,
      };

      await apiRequest("POST", "/api/messages", messageData);
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${provider.name}`,
      });

      // Navigate to messages page
      setLocation("/patient-dashboard?tab=messages");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-3xl hover:-translate-y-2 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        <img 
          src={provider.image} 
          alt={provider.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        
        {/* Verification and Rapid Service Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {provider.verified && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg backdrop-blur-sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {provider.rapidService && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              Rapid
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200 hover:bg-white"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`} />
        </button>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm backdrop-blur-sm">
              {provider.specialty}
            </Badge>
            <div className="flex items-center bg-black/20 backdrop-blur-md rounded-full px-3 py-1 shadow-sm">
              <Clock className="w-3 h-3 mr-1 text-white" />
              <span className="text-xs font-medium text-white">Available today</span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4 relative z-10">
        {/* Provider Info */}
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[hsl(207,90%,54%)] transition-colors leading-tight">
              {provider.name}
            </h3>
            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full px-3 py-1.5 shadow-md">
              <Star className="w-4 h-4 text-white mr-1 fill-current" />
              <span className="font-bold text-white text-sm">{provider.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3 bg-slate-50/80 rounded-lg px-3 py-2">
            <span className="font-semibold text-[hsl(207,90%,54%)] bg-blue-100 px-2 py-1 rounded-full text-xs mr-2">{provider.experience}</span>
            <span className="mx-1">•</span>
            <MapPin className="w-4 h-4 mr-1 text-slate-500" />
            <span className="font-medium">{provider.location}</span>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-4 font-medium">
            {provider.description}
          </p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 text-xs font-medium px-3 py-1 shadow-sm"
            >
              {tag}
            </Badge>
          ))}
          {provider.tags.length > 3 && (
            <Badge variant="secondary" className="bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border border-gray-200 text-xs px-3 py-1 shadow-sm">
              +{provider.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Quote and Reviews */}
        <div className="flex items-center justify-between pt-3 pb-2 border-t border-gray-100">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-2 rounded-xl">
            <div className="text-lg font-bold text-gray-900">
              Get a Quote
            </div>
            <div className="text-sm text-gray-500 font-medium">Personalized pricing</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">
              ({provider.reviewCount} reviews)
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(provider.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Link href={`/provider/${provider.id}`} className="flex-1 min-w-0">
            <Button 
              variant="outline" 
              className="w-full border-2 border-slate-200 hover:border-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,54%)] font-semibold rounded-2xl h-12 transition-all duration-200 bg-gradient-to-r from-white to-slate-50 hover:from-blue-50 hover:to-indigo-50 shadow-sm hover:shadow-md text-sm"
            >
              View Profile
            </Button>
          </Link>
          <Button 
            onClick={handleMessageProvider}
            disabled={isMessaging}
            className="flex-1 min-w-0 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(207,90%,44%)] hover:from-[hsl(207,90%,44%)] hover:to-[hsl(207,90%,34%)] font-semibold rounded-2xl h-12 shadow-lg hover:shadow-xl transition-all duration-200 text-white border-0 text-sm disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            {isMessaging ? "Sending..." : user ? "Message" : "Sign In to Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}