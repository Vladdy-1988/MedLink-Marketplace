import { useRoute, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, Users, Award, Heart, MessageCircle, Link as LinkIcon, Calendar, Shield, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProviderProfile() {
  const [, params] = useRoute("/provider/:id");
  const providerId = params?.id ? parseInt(params.id) : 1;
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isMessaging, setIsMessaging] = useState(false);
  
  // Fetch provider data from API
  const { data: provider, isLoading } = useQuery({
    queryKey: ["/api/providers", providerId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/providers/${providerId}`);
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
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

  const services = [
    {
      id: 1,
      name: "Wound Care",
      description: "Professional wound assessment and dressing changes",
      duration: 60
    },
    {
      id: 2,
      name: "Medication Management",
      description: "Medication reviews and administration support",
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
          <motion.img 
            src={provider.profileImageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"} 
            alt={`${provider.firstName} ${provider.lastName}`}
            className="w-full h-full object-cover opacity-40"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
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
                  <div className="text-3xl font-bold text-white mb-1">{parseFloat(provider.rating) || 4.5}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Rating</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">{provider.reviewCount}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Reviews</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">500+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Patients</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">12</div>
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
                <span className="text-gray-300 font-medium">Calgary, AB</span>
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
                  onClick={async () => {
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
                      // Send an initial message using provider data we already have
                      const messageData = {
                        receiverId: provider.userId,
                        content: `Hi ${provider.firstName} ${provider.lastName}, I'm interested in your healthcare services and would like to get a personalized quote. Could you please provide more information about your availability and pricing? Thank you!`,
                      };

                      await apiRequest("POST", "/api/messages", messageData);
                      
                      toast({
                        title: "Message Sent",
                        description: `Your message has been sent to ${provider.firstName} ${provider.lastName}`,
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
                  }}
                  disabled={isMessaging}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group mb-4"
                >
                  {isMessaging ? "Sending..." : user ? "Message Provider" : "Sign In to Message"}
                  <MessageCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                
                {user ? (
                  <Link href={`/booking/${provider.id}/1`}>
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About {provider.name}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden">
              <CardContent className="p-12">
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  I am a dedicated {provider.specialty} with over 12 years of experience providing compassionate healthcare services. I specialize in wound care, medication management, and post-operative care, bringing professional medical services directly to patients' homes. My approach focuses on patient comfort, safety, and comprehensive care that promotes healing and wellness.
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
                        Message Provider
                      </div>
                      <div className="text-sm text-gray-500 font-medium">{service.duration} minutes</div>
                    </div>
                    <Button 
                      onClick={() => {
                        // TODO: Implement messaging functionality
                        alert(`Requesting quote for ${service.name} with ${provider.name}...`);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Message Provider
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
          </div>
          
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
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="ml-3 text-sm text-gray-500 font-medium">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">"{review.comment}"</p>
                    <div className="font-semibold text-gray-900">— {review.patientName}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
