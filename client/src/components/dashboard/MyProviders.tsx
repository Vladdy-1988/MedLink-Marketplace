import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, MessageCircle, Calendar, Clock, Heart } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface Provider {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  location: string;
  profileImageUrl?: string;
  verified: boolean;
  totalBookings: number;
  lastBookingDate?: string;
  services: Array<{
    id: string;
    name: string;
    basePrice: number;
  }>;
}

export function MyProviders() {
  const { user } = useAuth();

  const { data: providers, isLoading, error } = useQuery({
    queryKey: ["/api/providers/my-providers", user?.id],
    enabled: !!user?.id,
  });

  const { data: favoriteProviders, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/providers/favorites", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading || favoritesLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Healthcare Providers</h2>
          <p className="text-gray-600">Providers you've worked with and your favorites</p>
        </div>
        
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const myProviders = (providers as Provider[]) || [];
  const favorites = (favoriteProviders as Provider[]) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Healthcare Providers</h2>
        <p className="text-gray-600">Providers you've worked with and your favorites</p>
      </div>

      {/* Favorite Providers */}
      {favorites.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              Favorite Providers
            </h3>
          </div>
          <div className="grid gap-4">
            {favorites.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow" data-testid={`favorite-provider-${provider.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {(provider.name || "?").charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">{provider.name}</h4>
                          {provider.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{provider.specialization}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{provider.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{provider.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{provider.totalBookings} visits</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" data-testid={`message-provider-${provider.id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Link href={`/provider/${provider.id}`}>
                        <Button size="sm" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]" data-testid={`book-provider-${provider.id}`}>
                          Book Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Providers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Providers</h3>
          <Link href="/providers">
            <Button variant="outline" size="sm" data-testid="find-new-providers">
              Find New Providers
            </Button>
          </Link>
        </div>

        {myProviders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No providers yet</h4>
              <p className="text-gray-600 mb-4">
                Start by booking your first appointment to build your provider network
              </p>
              <Link href="/providers">
                <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]" data-testid="find-first-provider">
                  Find Healthcare Providers
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow" data-testid={`provider-${provider.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {(provider.name || "?").charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">{provider.name}</h4>
                          {provider.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{provider.specialization}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{provider.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{provider.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{provider.totalBookings} visits</span>
                          </div>
                          {provider.lastBookingDate && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Last visit: {new Date(provider.lastBookingDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {/* Services offered */}
                        {provider.services && provider.services.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {provider.services.slice(0, 3).map((service) => (
                              <Badge key={service.id} variant="outline" className="text-xs">
                                {service.name}
                              </Badge>
                            ))}
                            {provider.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" data-testid={`message-provider-${provider.id}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Link href={`/provider/${provider.id}`}>
                        <Button size="sm" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]" data-testid={`book-provider-${provider.id}`}>
                          Book Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
