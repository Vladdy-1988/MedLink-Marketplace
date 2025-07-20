import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, Users, Award, Heart, MessageCircle, Link as LinkIcon } from "lucide-react";
import { featuredProviders } from "@/lib/mockData";
import { Link } from "wouter";

export default function ProviderProfile() {
  const [, params] = useRoute("/provider/:id");
  const providerId = params?.id ? parseInt(params.id) : 1;
  
  // Find provider or use first one as fallback
  const provider = featuredProviders.find(p => p.id === providerId) || featuredProviders[0];

  const services = [
    {
      id: 1,
      name: "Wound Care",
      description: "Professional wound assessment and dressing changes",
      price: 85,
      duration: 60
    },
    {
      id: 2,
      name: "Medication Management",
      description: "Medication reviews and administration support",
      price: 75,
      duration: 45
    }
  ];

  const reviews = [
    {
      id: 1,
      patientName: "Margaret R.",
      rating: 5,
      comment: "Sarah was incredibly professional and caring. Her wound care expertise helped my father heal much faster than expected.",
      date: "2 days ago"
    },
    {
      id: 2,
      patientName: "John D.",
      rating: 5,
      comment: "Excellent service and very knowledgeable. Would definitely recommend to others.",
      date: "1 week ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Hero Section */}
              <div className="relative h-64">
                <img 
                  src={provider.image} 
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
                  <p className="text-lg">{provider.specialty} • {provider.experience}</p>
                </div>
                {provider.verified && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[hsl(159,100%,34%)] text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{provider.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{provider.reviewCount}</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-600">Years</div>
                  </div>
                </div>
                
                {/* About */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    I am a dedicated {provider.specialty} with over 12 years of experience providing compassionate healthcare services. I specialize in wound care, medication management, and post-operative care, bringing professional medical services directly to patients' homes. My approach focuses on patient comfort, safety, and comprehensive care that promotes healing and wellness.
                  </p>
                </div>
                
                {/* Services */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{service.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold text-[hsl(207,90%,54%)]">
                              ${service.price}/visit
                            </div>
                            <div className="text-sm text-gray-500">{service.duration} min</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {/* Certifications */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications & Credentials</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "RN License (Alberta)",
                      "ACLS Certified",
                      "Wound Care Specialist"
                    ].map((cert, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Reviews */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400 text-sm">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                          </div>
                          <p className="text-gray-700 mb-2">"{review.comment}"</p>
                          <div className="text-sm text-gray-500">- {review.patientName}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{provider.price}</div>
                  <div className="text-sm text-gray-600">Base price for services</div>
                </div>
                
                <Link href={`/booking/${provider.id}/1`}>
                  <Button className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] py-4 text-lg mb-4">
                    Book Appointment
                  </Button>
                </Link>
                
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-600 mb-2">Available areas:</div>
                  <div className="text-sm font-medium text-gray-900">{provider.location}</div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Response time:
                    </div>
                    <span className="font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Availability:
                    </div>
                    <span className="font-medium">Mon-Fri, 8AM-6PM</span>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Provider
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
