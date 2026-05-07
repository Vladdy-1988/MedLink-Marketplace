import { useState, useEffect, useMemo } from "react";
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
import { providerSpecializations, serviceCategories } from "@/lib/serviceCatalog";
import { Search, Filter, Zap, HeartPulse, Home, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

function toDisplaySpecialization(value: unknown): string {
  const raw = String(value || "").trim();
  if (!raw) return "Healthcare";

  return (
    providerSpecializations.find(
      (specialization) => specialization.toLowerCase() === raw.toLowerCase(),
    ) ||
    raw.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
  );
}

function normalizeFilterText(value: unknown): string {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function Providers() {
  const [location] = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [filters, setFilters] = useState({
    serviceType: "",
    location: "",
    serviceTypes: [] as string[],
    priceRanges: [] as string[],
    ratings: [] as string[],
    rapidOnly: false,
    sortBy: "newest",
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const searchParams = new URLSearchParams();
  if (debouncedQ) searchParams.set("q", debouncedQ);
  if (filters.serviceType) searchParams.set("serviceType", filters.serviceType);
  // serviceTypes (sidebar checkboxes) are filtered client-side — see displayedProviders below
  if (filters.location) searchParams.set("location", filters.location);
  if (filters.sortBy && filters.sortBy !== "newest") searchParams.set("sortBy", filters.sortBy);

  const priceMap: Record<string, [number, number]> = {
    "under-75": [0, 75],
    "75-100": [75, 100],
    "100-plus": [100, 9999],
  };
  const selectedPriceRange =
    filters.priceRanges.length === 1 ? priceMap[filters.priceRanges[0]] : undefined;
  if (selectedPriceRange) {
    const [min, max] = selectedPriceRange;
    searchParams.set("priceMin", String(min));
    searchParams.set("priceMax", String(max));
  }

  const ratingValues = filters.ratings.reduce<number[]>((values, rating) => {
    if (rating === "4.5-plus") {
      values.push(4.5);
    } else if (rating === "4.0-plus") {
      values.push(4.0);
    }

    return values;
  }, []);
  if (ratingValues.length > 0) {
    searchParams.set("rating", String(Math.min(...ratingValues)));
  }

  const { data: providersData = [], isLoading: providersLoading, error: providersError } = useQuery({
    queryKey: ["/api/providers/search", debouncedQ, filters],
    queryFn: async () => {
      const queryString = searchParams.toString();
      const response = await apiRequest(
        "GET",
        queryString ? `/api/providers/search?${queryString}` : "/api/providers/search",
      );
      return response.json();
    },
  });

  useEffect(() => {
    document.title = "Find Providers — MedLink Marketplace";
  }, []);

  const categoryFilterOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...serviceCategories.map((category) => category.name),
          ...providerSpecializations,
        ]),
      ).sort((a, b) => a.localeCompare(b)),
    [],
  );

  // Check URL parameters to auto-enable rapid services filter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("rapid") === "true") {
      setFilters((prev) => ({ ...prev, rapidOnly: true }));
    }
  }, [location]);

  // Convert API data to provider format
  const allProviders = (providersData as any[]).map((provider: any) => ({
    services: Array.isArray(provider.services) ? provider.services : [],
    id: provider.id,
    userId: provider.userId,
    name: `${provider.firstName} ${provider.lastName}`,
    specialty: toDisplaySpecialization(provider.specialization),
    experience: `${provider.yearsExperience} years exp.`,
    rating: parseFloat(provider.rating) || 4.5,
    reviewCount: provider.reviewCount || 0,
    patientCount: provider.patientCount || 0,
    location:
      Array.isArray(provider.serviceAreas) && provider.serviceAreas.length > 0
        ? String(provider.serviceAreas[0])
        : "Calgary, AB",
    basePrice:
      provider.basePricing !== null && provider.basePricing !== undefined
        ? Number(provider.basePricing)
        : Array.isArray(provider.services)
          ? provider.services
              .map((service: any) => Number(service?.price))
              .find((price: number) => Number.isFinite(price)) ?? null
          : null,
    price: "Message Provider",
    description: provider.bio || "Experienced healthcare provider offering quality in-home services.",
    image: provider.profileImageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    verified: provider.isVerified || false,
    tags: [toDisplaySpecialization(provider.specialization)],
    category: String(provider.specialization || "").toLowerCase().replace(/\s+/g, '-'),
    rapidService: Array.isArray(provider.services)
      ? provider.services.some((service: any) => {
          const category = String(service?.category || "").toLowerCase();
          const name = String(service?.name || "").toLowerCase();
          return category.includes("rapid") || name.includes("rapid");
        })
      : false,
  }));

  const displayedProviders = allProviders
    .filter((p) => !filters.rapidOnly || p.rapidService === true)
    .filter((provider) => {
      if (filters.serviceTypes.length === 0) return true;

      const specialty = normalizeFilterText(provider.specialty);
      const serviceTexts: string[] = provider.services.flatMap((service: any): string[] => [
        normalizeFilterText(service?.name),
        normalizeFilterText(service?.category),
      ]);

      return filters.serviceTypes.some((selected) => {
        const selectedText = normalizeFilterText(selected);
        return (
          specialty === selectedText ||
          specialty.includes(selectedText) ||
          selectedText.includes(specialty) ||
          serviceTexts.some(
            (serviceText) =>
              serviceText === selectedText ||
              serviceText.includes(selectedText) ||
              selectedText.includes(serviceText),
          )
        );
      });
    });

  const resetAllFilters = () => {
    setSearchInput("");
    setDebouncedQ("");
    setFilters({
      serviceType: "",
      location: "",
      serviceTypes: [],
      priceRanges: [],
      ratings: [],
      rapidOnly: false,
      sortBy: "newest",
    });
  };

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

  const hasActiveFilters =
    searchInput.trim().length > 0 ||
    filters.serviceType !== "" ||
    filters.location !== "" ||
    filters.rapidOnly ||
    filters.serviceTypes.length > 0 ||
    filters.priceRanges.length > 0 ||
    filters.ratings.length > 0;

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <Navigation />
      
      {/* Search Header */}
      <section className="border-b border-sky-100/80 bg-[radial-gradient(circle_at_14%_18%,rgba(20,184,166,0.15),transparent_28%),radial-gradient(circle_at_86%_0%,rgba(96,165,250,0.18),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f5fbff_100%)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-teal-700">
              <HeartPulse className="h-3.5 w-3.5" />
              Verified Calgary house calls
            </div>
            <h1 className="text-4xl font-black tracking-tight text-blue-950 sm:text-5xl">
              Find care that comes home.
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Search in-home healthcare providers, compare service categories, and book non-emergency care with clearer confidence.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                Provider review
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm">
                <Home className="h-4 w-4 text-blue-600" />
                In-home services
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm">
                <Zap className="h-4 w-4 text-amber-500" />
                Rapid care filter
              </span>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 gap-4 rounded-[1.25rem] border border-white/90 bg-white/90 p-4 shadow-[0_18px_50px_rgba(15,76,117,0.12)] backdrop-blur md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Label className="sr-only">Search providers</Label>
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search providers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-12 rounded-full border-sky-100 bg-white pl-11 text-base font-medium shadow-sm"
              />
            </div>
            
            <Select
              value={filters.serviceType || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  serviceType: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-full border-sky-100 bg-white text-base font-semibold shadow-sm">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {serviceCategories.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.location || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  location: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-full border-sky-100 bg-white text-base font-semibold shadow-sm">
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
            
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: value,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-full border-sky-100 bg-white text-base font-semibold shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Rapid Services Toggle */}
            <button
              type="button"
              aria-pressed={filters.rapidOnly}
              aria-label="Toggle rapid services filter"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  rapidOnly: !prev.rapidOnly,
                }))
              }
              className={`flex h-12 items-center justify-center rounded-full border px-4 py-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                filters.rapidOnly 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-[0_10px_24px_rgba(37,99,235,0.22)]'
                  : 'bg-white text-gray-700 border-sky-100 shadow-sm hover:border-blue-300'
              }`}
            >
              <Zap className={`h-4 w-4 mr-2 ${filters.rapidOnly ? 'text-white' : 'text-blue-600'}`} />
              <span className="text-base font-semibold">Rapid Services</span>
            </button>
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
                  <Label className="mb-1 block text-base font-semibold text-gray-700">Service Categories</Label>
                  <p className="mb-3 text-sm text-gray-500">
                    All marketplace categories are available here.
                  </p>
                  <div className="space-y-2">
                    {categoryFilterOptions.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.serviceTypes.includes(category)}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              serviceTypes: checked === true
                                ? [...prev.serviceTypes, category]
                                : prev.serviceTypes.filter((item) => item !== category),
                            }))
                          }
                        />
                        <Label htmlFor={`category-${category}`} className="text-base text-gray-700">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <Label className="mb-3 block text-base font-semibold text-gray-700">Price Range</Label>
                  <div className="space-y-2">
                    {[
                      { id: "under-75", label: "Under $75" },
                      { id: "75-100", label: "$75 - $100" },
                      { id: "100-plus", label: "$100+" }
                    ].map((price) => (
                      <div key={price.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={price.id}
                          checked={filters.priceRanges.includes(price.id)}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRanges: checked === true
                                ? [...prev.priceRanges, price.id]
                                : prev.priceRanges.filter((item) => item !== price.id),
                            }))
                          }
                        />
                        <Label htmlFor={price.id} className="text-base text-gray-700">{price.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div>
                  <Label className="mb-3 block text-base font-semibold text-gray-700">Rating</Label>
                  <div className="space-y-2">
                    {[
                      { id: "4.5-plus", label: "4.5+ stars" },
                      { id: "4.0-plus", label: "4.0+ stars" }
                    ].map((rating) => (
                      <div key={rating.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={rating.id}
                          checked={filters.ratings.includes(rating.id)}
                          onCheckedChange={(checked) =>
                            setFilters((prev) => ({
                              ...prev,
                              ratings: checked === true
                                ? [...prev.ratings, rating.id]
                                : prev.ratings.filter((item) => item !== rating.id),
                            }))
                          }
                        />
                        <Label htmlFor={rating.id} className="text-base text-gray-700">{rating.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rapid Services Filter */}
                <div>
                  <Label className="mb-3 block text-base font-semibold text-gray-700">Service Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rapid-services"
                        checked={filters.rapidOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            rapidOnly: checked as boolean,
                          }))
                        }
                      />
                      <Label htmlFor="rapid-services" className="flex items-center text-base text-gray-700">
                        <Zap className="h-3 w-3 mr-1 text-blue-600" />
                        Rapid Services Only
                      </Label>
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" className="w-full text-base" onClick={resetAllFilters}>
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Provider Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filters.rapidOnly ? "Rapid Service Providers" : "Healthcare Providers"}
                </h2>
                <p className="text-base text-gray-600">
                  {displayedProviders.length} provider{displayedProviders.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            
            {/* Provider Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {displayedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            
            {displayedProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {hasActiveFilters
                    ? "No providers found matching your criteria."
                    : "No providers found in your area yet."}
                </p>
                <Button 
                  onClick={resetAllFilters}
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
