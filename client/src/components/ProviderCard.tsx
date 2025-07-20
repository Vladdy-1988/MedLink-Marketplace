import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "wouter";

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
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative">
        <img 
          src={provider.image} 
          alt={provider.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          {provider.verified && (
            <span className="bg-[hsl(159,100%,34%)] text-white px-3 py-1 rounded-full text-sm font-medium">
              Verified
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">{provider.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({provider.reviewCount})</span>
          </div>
        </div>
        <p className="text-[hsl(159,100%,34%)] font-medium mb-2">
          {provider.specialty} • {provider.experience}
        </p>
        <p className="text-gray-600 mb-4">{provider.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{provider.location}</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{provider.price}</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/provider/${provider.id}`}>
          <Button className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
            View Profile & Book
          </Button>
        </Link>
      </div>
    </div>
  );
}
