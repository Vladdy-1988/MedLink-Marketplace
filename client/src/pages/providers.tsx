import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { serviceCategories } from "@/lib/serviceCatalog";
import { Search, Filter, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Providers() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showRapidOnly, setShowRapidOnly] = useState(false);

  // Fetch real providers from API
  const { data: providersData = [], isLoading: providersLoading, error: providersError } = useQuery({
    queryKey: ["/api/providers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/providers");
      return response.json();
    },
  });

  // Check URL parameters to auto-enable rapid services filter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('rapid') === 'true') {
      setShowRapidOnly(true);
    }
  }, [location]);

  // Convert API data to provider format
  const allProviders = providersData.map((provider: any) => ({
    services: Array.isArray(provider.services) ? provider.services : [],
    id: provider.id,
    userId: provider.userId,
    name: `${provider.firstName} ${provider.lastName}`,
    specialty: provider.specialization,
    experience: `${provider.yearsExperience} years exp.`,
    rating: parseFloat(provider.rating) || 4.5,
    reviewCount: provider.reviewCount || 0,
    location:
      Array.isArray(provider.serviceAreas) && provider.serviceAreas.length > 0
        ? String(provider.serviceAreas[0])
        : "Calgary, AB",
    price: "Message Provider",
    description: provider.bio || "Experienced healthcare provider offering quality in-home services.",
    image: provider.profileImageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    verified: provider.isVerified || false,
    tags: [provider.specialization],
    category: provider.specialization.toLowerCase().replace(/\s+/g, '-'),
    rapidService: Array.isArray(provider.services)
      ? provider.services.some((service: any) => {
          const category = String(service?.category || "").toLowerCase();
          const name = String(service?.name || "").toLowerCase();
          return category.includes("rapid") || name.includes("rapid");
        })
      : false,
  }));

  if (providersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-[720px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-10 w-64" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-[420px] w-full rounded-3xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (providersError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Providers</h1>
          <p className="text-gray-600">Please refresh and try again.</p>
        </div>
      </div>
    );
  }

  // Use only real providers from API

  const filteredProviders = allProviders.filter((provider: any) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // More flexible service matching - check against specialty and category
    const serviceSlug = selectedServiceType.replace(/-/g, " ");
    const matchesProviderSpecialty =
      provider.category === selectedServiceType ||
      provider.specialty.toLowerCase().replace(/\s+/g, "-") === selectedServiceType ||
      provider.specialty.toLowerCase().includes(serviceSlug);
    const matchesProviderServices = provider.services.some((service: any) => {
      const category = String(service?.category || "").toLowerCase().replace(/\s+/g, "-");
      const name = String(service?.name || "").toLowerCase().replace(/\s+/g, "-");
      return category === selectedServiceType || name.includes(selectedServiceType);
    });
    const matchesService =
      selectedServiceType === "all" || matchesProviderSpecialty || matchesProviderServices;
    
    const matchesLocation = selectedLocation === "all" || provider.location.includes(selectedLocation);
    
    // Rapid services filter
    const matchesRapid = !showRapidOnly || provider.rapidService === true;
    
    return matchesSearch && matchesService && matchesLocation && matchesRapid;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      case "price-high":
        return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
      default:
        return b.reviewCount - a.reviewCount;
    }
  });
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedServiceType !== "all" ||
    selectedLocation !== "all" ||
    showRapidOnly;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Search Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Healthcare Providers</h1>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Label className="sr-only">Search providers</Label>
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {serviceCategories.map((service) => (
                  <SelectItem key={service.id} value={service.name.toLowerCase().replace(/\s+/g, '-')}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Calgary</SelectItem>
                <SelectItem value="NW">NW Calgary</SelectItem>
                <SelectItem value="SW">SW Calgary</SelectItem>
                <SelectItem value="SE">SE Calgary</SelectItem>
                <SelectItem value="NE">NE Calgary</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Rapid Services Toggle */}
            <div 
              onClick={() => setShowRapidOnly(!showRapidOnly)}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                showRapidOnly 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              <Zap className={`h-4 w-4 mr-2 ${showRapidOnly ? 'text-white' : 'text-blue-600'}`} />
              <span className="font-medium text-sm">Rapid Services</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Type Filter */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Service Type</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {serviceCategories.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox id={service.name.toLowerCase().replace(/\s+/g, '-')} />
                        <Label htmlFor={service.name.toLowerCase().replace(/\s+/g, '-')} className="text-sm text-gray-700">{service.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</Label>
                  <div className="space-y-2">
                    {[
                      { id: "under-75", label: "Under $75" },
                      { id: "75-100", label: "$75 - $100" },
                      { id: "100-plus", label: "$100+" }
                    ].map((price) => (
                      <div key={price.id} className="flex items-center space-x-2">
                        <Checkbox id={price.id} />
                        <Label htmlFor={price.id} className="text-sm text-gray-700">{price.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Rating</Label>
                  <div className="space-y-2">
                    {[
                      { id: "4.5-plus", label: "4.5+ stars" },
                      { id: "4.0-plus", label: "4.0+ stars" }
                    ].map((rating) => (
                      <div key={rating.id} className="flex items-center space-x-2">
                        <Checkbox id={rating.id} />
                        <Label htmlFor={rating.id} className="text-sm text-gray-700">{rating.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rapid Services Filter */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Service Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rapid-services" 
                        checked={showRapidOnly}
                        onCheckedChange={(checked) => setShowRapidOnly(checked === true)}
                      />
                      <Label htmlFor="rapid-services" className="text-sm text-gray-700 flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-blue-600" />
                        Rapid Services Only
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Provider Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {showRapidOnly ? 'Rapid Service Providers' : 'Healthcare Providers'}
                </h2>
                <p className="text-gray-600">
                  {sortedProviders.length} providers found in Calgary
                  {showRapidOnly && ' offering rapid services'}
                </p>
              </div>
            </div>
            
            {/* Provider Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {sortedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            
            {sortedProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {hasActiveFilters
                    ? "No providers found matching your criteria."
                    : "No providers found in your area yet."}
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedServiceType("all");
                    setSelectedLocation("all");
                  }}
                  className="mt-4"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
