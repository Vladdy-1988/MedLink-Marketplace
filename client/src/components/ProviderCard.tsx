import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, CheckCircle, Heart, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Provider {
  id: number;
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
}

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={provider.image} 
          alt={provider.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Verification Badge */}
        {provider.verified && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/95 text-gray-900 border-0 shadow-lg backdrop-blur-sm">
              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
              Verified
            </Badge>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`} />
        </button>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-white/95 text-gray-900 border-0 shadow-sm backdrop-blur-sm">
              {provider.specialty}
            </Badge>
            <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <Clock className="w-3 h-3 mr-1 text-gray-600" />
              <span className="text-xs font-medium text-gray-900">Available today</span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        {/* Provider Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[hsl(207,90%,54%)] transition-colors leading-tight">
              {provider.name}
            </h3>
            <div className="flex items-center bg-gray-50 rounded-full px-2 py-1">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              <span className="font-semibold text-gray-900 text-sm">{provider.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="font-medium text-[hsl(207,90%,54%)]">{provider.experience}</span>
            <span className="mx-2">•</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span>{provider.location}</span>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {provider.description}
          </p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {provider.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-blue-50 text-blue-700 border-0 text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
          {provider.tags.length > 3 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0 text-xs">
              +{provider.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xl font-bold text-gray-900">
              {provider.price}
            </div>
            <div className="text-sm text-gray-500">per visit</div>
          </div>
          <div className="text-xs text-gray-500">
            ({provider.reviewCount} reviews)
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Link href={`/provider/${provider.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-gray-200 hover:border-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,54%)] font-semibold rounded-xl h-12 transition-all duration-200"
            >
              View Profile
            </Button>
          </Link>
          <Link href={`/booking/${provider.id}/consultation`} className="flex-1">
            <Button className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-200">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}