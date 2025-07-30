import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { featuredProviders, serviceCategories } from "@/lib/mockData";
import { Search, Filter, Zap } from "lucide-react";

export default function Providers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showRapidOnly, setShowRapidOnly] = useState(false);

  // Add rapid service capability to featured providers
  const enhancedFeaturedProviders = featuredProviders.map(provider => ({
    ...provider,
    rapidService: provider.category === "nursing" ? true : false
  }));

  // Mock expanded provider list covering all service categories
  const allProviders = [
    ...enhancedFeaturedProviders,
    {
      id: 4,
      name: "Dr. Emily Wong",
      specialty: "Lab Technician",
      experience: "6 years exp.",
      rating: 4.7,
      reviewCount: 68,
      location: "NE Calgary",
      price: "Message Provider",
      description: "Certified medical laboratory technician specializing in home blood work and diagnostic testing.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Blood Work", "Diagnostics", "RAPID"],
      category: "mobile-lab-tests",
      rapidService: true
    },
    {
      id: 5,
      name: "Dr. Michael Davis",
      specialty: "General Practitioner",
      experience: "18 years exp.",
      rating: 4.9,
      reviewCount: 186,
      location: "SW Calgary",
      price: "Message Provider",
      description: "Family physician providing comprehensive primary care, health assessments, and preventive medicine.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Family Medicine", "Health Checkups"],
      category: "general-practice"
    },
    {
      id: 6,
      name: "Jennifer Williams",
      specialty: "Occupational Therapist",
      experience: "11 years exp.",
      rating: 4.8,
      reviewCount: 92,
      location: "NW Calgary",
      price: "Message Provider",
      description: "OT specializing in home assessments, adaptive equipment, and daily living skills training.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Home Safety", "Adaptive Equipment"],
      category: "occupational-therapy"
    },
    {
      id: 7,
      name: "Dr. Patricia Lee",
      specialty: "Mental Health Counselor",
      experience: "14 years exp.",
      rating: 4.9,
      reviewCount: 134,
      location: "SE Calgary",
      price: "Message Provider",
      description: "Licensed therapist providing individual and family counseling in the comfort of your home.",
      image: "https://images.unsplash.com/photo-1594824570509-1b0b83d63c49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Family Therapy", "Anxiety Treatment", "RAPID"],
      category: "mental-health",
      rapidService: true
    },
    {
      id: 8,
      name: "Rachel Anderson",
      specialty: "Registered Dietitian",
      experience: "9 years exp.",
      rating: 4.7,
      reviewCount: 78,
      location: "NE Calgary",
      price: "Message Provider",
      description: "Nutrition specialist providing personalized meal planning and dietary consultations.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Meal Planning", "Diabetes Nutrition"],
      category: "nutrition"
    },
    {
      id: 9,
      name: "Dr. Mark Thompson",
      specialty: "Podiatrist",
      experience: "16 years exp.",
      rating: 4.8,
      reviewCount: 105,
      location: "SW Calgary",
      price: "Message Provider",
      description: "Foot care specialist providing diabetic foot care, nail treatments, and mobility assessments.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Diabetic Foot Care", "Nail Care"],
      category: "podiatry"
    },
    {
      id: 10,
      name: "Sarah Mitchell",
      specialty: "Speech Therapist",
      experience: "12 years exp.",
      rating: 4.9,
      reviewCount: 87,
      location: "NW Calgary",
      price: "Message Provider",
      description: "Speech-language pathologist specializing in communication disorders and swallowing therapy.",
      image: "https://images.unsplash.com/photo-1594824570509-1b0b83d63c49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Communication Therapy", "Swallowing Disorders"],
      category: "speech-therapy"
    }
  ];

  const filteredProviders = allProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // More flexible service matching - check against specialty and category
    const matchesService = selectedServiceType === "all" || 
                          provider.category === selectedServiceType ||
                          provider.specialty.toLowerCase().replace(/\s+/g, '-') === selectedServiceType ||
                          provider.specialty.toLowerCase().includes(selectedServiceType.replace(/-/g, ' '));
    
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
                <p className="text-gray-600 text-lg">No providers found matching your criteria.</p>
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
