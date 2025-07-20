import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { featuredProviders } from "@/lib/mockData";
import { Search, Filter } from "lucide-react";

export default function Providers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  // Mock expanded provider list
  const allProviders = [
    ...featuredProviders,
    {
      id: 4,
      name: "Dr. Emily Wong",
      specialty: "Lab Technician",
      experience: "6 years exp.",
      rating: 4.7,
      reviewCount: 68,
      location: "NE Calgary",
      price: "$65/test",
      description: "Certified medical laboratory technician specializing in home blood work and diagnostic testing.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Blood Work", "Diagnostics"],
      category: "lab"
    },
    {
      id: 5,
      name: "James Thompson",
      specialty: "Massage Therapist",
      experience: "15 years exp.",
      rating: 4.8,
      reviewCount: 143,
      location: "SW Calgary",
      price: "$90/session",
      description: "Registered massage therapist specializing in therapeutic massage and pain management.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      verified: true,
      tags: ["Therapeutic Massage", "Pain Management"],
      category: "alternative"
    }
  ];

  const filteredProviders = allProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedServiceType === "all" || provider.category === selectedServiceType;
    const matchesLocation = selectedLocation === "all" || provider.location.includes(selectedLocation);
    
    return matchesSearch && matchesService && matchesLocation;
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
                <SelectItem value="nursing">Nursing Care</SelectItem>
                <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                <SelectItem value="dental">Dental Services</SelectItem>
                <SelectItem value="lab">Lab Services</SelectItem>
                <SelectItem value="alternative">Alternative Therapy</SelectItem>
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
                  <div className="space-y-2">
                    {[
                      { id: "nursing", label: "Nursing Care" },
                      { id: "physiotherapy", label: "Physiotherapy" },
                      { id: "dental", label: "Dental Services" },
                      { id: "lab", label: "Lab Services" },
                      { id: "alternative", label: "Alternative Therapy" }
                    ].map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox id={service.id} />
                        <Label htmlFor={service.id} className="text-sm text-gray-700">{service.label}</Label>
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
                <h2 className="text-2xl font-bold text-gray-900">Healthcare Providers</h2>
                <p className="text-gray-600">{sortedProviders.length} providers found in Calgary</p>
              </div>
            </div>
            
            {/* Provider Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
