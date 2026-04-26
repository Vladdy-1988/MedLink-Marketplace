import { useRoute, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Clock, Heart, MessageCircle, Calendar, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const FALLBACK_PROVIDER_IMAGE =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";

export default function ProviderProfile() {
  const [, singularParams] = useRoute("/provider/:id");
  const [, pluralParams] = useRoute("/providers/:id");
  const providerId = singularParams?.id
    ? parseInt(singularParams.id)
    : pluralParams?.id
      ? parseInt(pluralParams.id)
      : 1;
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isMessaging, setIsMessaging] = useState(false);
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  
  // Fetch provider data from API
  const { data: provider, isLoading, isError } = useQuery({
    queryKey: ["/api/providers", providerId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/providers/${providerId}`);
      return response.json();
    },
  });

  const { data: servicesData = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/providers", providerId, "services"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/providers/${providerId}/services`);
      return response.json();
    },
    enabled: !!provider,
  });

  const { data: reviewsData = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/providers", providerId, "reviews"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/providers/${providerId}/reviews`);
      return response.json();
    },
    enabled: !!provider,
  });

  useEffect(() => {
    if (provider) {
      const providerName = `${provider.firstName || ""} ${provider.lastName || ""}`.trim() || "Provider";
      document.title = `${providerName} — MedLink Marketplace`;
    }
  }, [provider]);

  const heroImage = provider?.profileImageUrl || FALLBACK_PROVIDER_IMAGE;

  useEffect(() => {
    setHeroImageLoaded(false);
  }, [heroImage, providerId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Skeleton className="h-[420px] w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[320px] w-full rounded-3xl" />
            <Skeleton className="h-[320px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Provider</h1>
            <p className="text-gray-600">Please refresh and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
            <Link href="/providers">
              <Button>Browse All Providers</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${provider.firstName || ""} ${provider.lastName || ""}`.trim();
  const providerLocation =
    Array.isArray(provider.serviceAreas) && provider.serviceAreas.length > 0
      ? provider.serviceAreas.join(" • ")
      : "Calgary, AB";
  const providerRating = Number.parseFloat(provider.rating ?? "0") || 0;
  const services = (servicesData as any[]).map((service) => ({
    ...service,
    duration: Number(service.duration),
    price: Number(service.price),
  }));
  const defaultServiceId = services[0]?.id || 1;
  const reviews = (reviewsData as any[]).map((review) => ({
    ...review,
    patientName: review.patientName || "Verified Patient",
    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "",
  }));

  const sendProviderMessage = async (serviceName?: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to message this healthcare provider and get a personalized quote",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }

    setIsMessaging(true);
    try {
      const subject = serviceName ? ` regarding ${serviceName}` : "";
      const messageData = {
        receiverId: provider.userId,
        content: `Hi ${fullName}, I'm interested in your healthcare services${subject} and would like to get a personalized quote. Could you please share your availability and next steps? Thank you!`,
      };

      await apiRequest("POST", "/api/messages", messageData);

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${fullName}`,
      });

      setLocation("/dashboard/patient?tab=messages");
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

  const joinWaitlist = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to join this provider's waitlist.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }

    if (user.userType !== "patient") {
      toast({
        title: "Patients Only",
        description: "Only patient accounts can join provider waitlists.",
        variant: "destructive",
      });
      return;
    }

    setIsJoiningWaitlist(true);
    try {
      await apiRequest("POST", "/api/waitlist", { providerId });
      toast({
        title: "Joined Waitlist",
        description: `We'll notify you when ${fullName} has an opening.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.replace(/^\d+:\s*/, "")
          : "Failed to join the waitlist. Please try again.";
      toast({
        title: "Unable to Join Waitlist",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navigation />
      
      {/* Hero Section - Apple-inspired full-width design */}
      <motion.section 
        className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          {!heroImageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
          )}
          <motion.img 
            src={heroImage}
            alt={`${provider.firstName} ${provider.lastName}`}
            className="w-full h-full object-cover opacity-40"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            onLoad={() => setHeroImageLoaded(true)}
            onError={() => setHeroImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Provider Info */}
            <motion.div 
              className="text-white space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {provider.isVerified && (
                <motion.div 
                  className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm font-medium">Verified Provider</span>
                </motion.div>
              )}
              
              <div>
                <motion.h1 
                  className="text-6xl lg:text-7xl font-black leading-[0.9] mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {provider.firstName} {provider.lastName}
                </motion.h1>
                <motion.p 
                  className="text-xl lg:text-2xl text-gray-300 font-light mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {provider.specialization} • {provider.yearsExperience} years exp.
                </motion.p>
              </div>
              
              {/* Stats Row */}
              <motion.div 
                className="grid grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{providerRating.toFixed(1)}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Rating</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{provider.reviewCount}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Reviews</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{provider.patientCount ?? 0}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Patients</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{provider.yearsExperience}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Years</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300 font-medium">{providerLocation}</span>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Booking Card */}
            <motion.div 
              className="lg:justify-self-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md">
                <div className="text-center mb-8">
                  <div className="text-3xl font-black text-white mb-2">Personalized Pricing</div>
                  <div className="text-gray-300 font-medium">
                    {user ? "Contact for quote based on your needs" : "Sign in to get personalized quotes"}
                  </div>
                  {!user && (
                    <div className="mt-3 p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                      <div className="text-sm text-blue-200 font-medium">
                        💡 Create an account to message providers and get custom pricing
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => sendProviderMessage()}
                  disabled={isMessaging}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group mb-4"
                >
                  {isMessaging ? "Sending..." : user ? "Message Provider" : "Sign In to Message"}
                  <MessageCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                
                {user ? (
                  <Link href={`/booking/${provider.id}/${defaultServiceId}`}>
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm py-6 text-lg font-semibold rounded-2xl">
                      Schedule Consultation
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Sign In Required",
                        description: "Please sign in to schedule consultations with healthcare providers",
                        variant: "destructive",
                      });
                      setTimeout(() => {
                        window.location.href = "/api/login";
                      }, 1500);
                    }}
                    variant="outline" 
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm py-6 text-lg font-semibold rounded-2xl"
                  >
                    Sign In to Schedule
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}

                <Button
                  onClick={joinWaitlist}
                  disabled={isJoiningWaitlist || (!!user && user.userType !== "patient")}
                  variant="outline"
                  className="mt-4 w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm py-6 text-lg font-semibold rounded-2xl"
                >
                  {isJoiningWaitlist ? "Joining Waitlist..." : "Join Waitlist"}
                </Button>
                {user && user.userType !== "patient" && (
                  <p className="mt-2 text-center text-sm text-gray-300">
                    Waitlists are available to patient accounts only.
                  </p>
                )}
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      Response time
                    </div>
                    <span className="text-white font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      Availability
                    </div>
                    <span className="text-white font-medium">Mon-Fri, 8AM-6PM</span>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* About Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About {fullName}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden">
              <CardContent className="p-12">
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  {provider.bio ||
                    `${fullName} is a dedicated ${provider.specialization} with ${provider.yearsExperience} years of experience providing compassionate, high-quality care in patients' homes.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
        
        {/* Services Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Services Offered</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-[260px] w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                  <CardContent className="p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{service.name}</h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${service.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">{service.duration} minutes</div>
                    </div>
                    <Button 
                      onClick={() => sendProviderMessage(service.name)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Message Provider
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
          )}
          {!servicesLoading && services.length === 0 && (
            <div className="text-center text-gray-600 mt-6">
              This provider has not listed services yet.
            </div>
          )}
        </motion.section>
        
        {/* Certifications Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Certifications & Credentials</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "RN License (Alberta)",
              "ACLS Certified", 
              "Wound Care Specialist"
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Badge className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {cert}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Reviews Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Patient Reviews</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            {!reviewsLoading && (provider as any)?.rating && (
              <div className="flex items-center justify-center gap-6 mt-6 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span className="text-xl font-bold text-gray-900">
                    {Number((provider as any).rating).toFixed(1)}
                  </span>
                  <span className="text-gray-500">avg rating</span>
                </div>
                <div className="text-gray-300">|</div>
                <span className="text-gray-700 font-medium">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          
          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-[240px] w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="flex text-yellow-400">
                        {(() => {
                          const filled = Math.round(Math.min(5, Math.max(0, Number(review.rating) || 0)));
                          return [...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < filled ? "fill-current text-yellow-400" : "text-gray-300"}`}
                            />
                          ));
                        })()}
                      </div>
                      <span className="ml-3 text-sm text-gray-500 font-medium">{review.date}</span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">"{review.comment}"</p>
                    )}
                    <div className="font-semibold text-gray-900">— {review.patientName}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
          )}
          {!reviewsLoading && reviews.length === 0 && (
            <div className="text-center text-gray-600 mt-6">
              No reviews yet for this provider.
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
