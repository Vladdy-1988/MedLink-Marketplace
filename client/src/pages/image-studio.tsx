import Navigation from "@/components/Navigation";
import ImageGenerator from "@/components/ImageGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Wand2, Users, Building2, Heart, Sparkles } from "lucide-react";

export default function ImageStudio() {
  const features = [
    {
      icon: Users,
      title: "Provider Portraits",
      description: "Generate professional headshots for healthcare providers",
      examples: ["Doctors in white coats", "Nurses in scrubs", "Therapists in clinical settings"]
    },
    {
      icon: Heart,
      title: "Service Images",
      description: "Create visuals for medical services and procedures",
      examples: ["Home nursing care", "Physical therapy", "Lab testing"]
    },
    {
      icon: Building2,
      title: "Facility Photos",
      description: "Design medical facility and clinic interiors",
      examples: ["Modern waiting rooms", "Treatment rooms", "Medical offices"]
    },
    {
      icon: Palette,
      title: "Marketing Content",
      description: "Build promotional and educational healthcare content",
      examples: ["Wellness concepts", "Health education", "Patient testimonials"]
    }
  ];

  const useCases = [
    "Provider profile pictures",
    "Service demonstration images",
    "Website hero sections",
    "Marketing brochures",
    "Educational materials",
    "Social media content",
    "Blog post illustrations",
    "Newsletter graphics"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Wand2 className="h-12 w-12 mr-4" />
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
              AI Image Studio
            </h1>
            <Sparkles className="h-10 w-10 ml-4" />
          </div>
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate professional healthcare images with AI. Perfect for provider profiles, 
            service illustrations, and marketing content.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              Powered by DALL-E 3
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
              Healthcare Optimized
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Can Create</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI specializes in healthcare imagery, ensuring professional, accurate, and appropriate visuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                          {example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Use Cases */}
          <Card className="border-0 shadow-lg mb-16">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Perfect For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-700 font-medium">{useCase}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Generator Component */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageGenerator />
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Best Practices for Healthcare AI Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">✓ Do Include</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Professional medical attire</li>
                    <li>• Clean, sterile environments</li>
                    <li>• Appropriate equipment and tools</li>
                    <li>• Diverse and inclusive representations</li>
                    <li>• Warm, approachable expressions</li>
                    <li>• Natural lighting and settings</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700">✗ Avoid</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Overly clinical or cold imagery</li>
                    <li>• Inappropriate or revealing clothing</li>
                    <li>• Outdated or unprofessional equipment</li>
                    <li>• Cluttered or messy backgrounds</li>
                    <li>• Unrealistic or exaggerated scenarios</li>
                    <li>• Images that could cause anxiety</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> All generated images are for illustrative purposes only. 
                  Ensure compliance with healthcare marketing regulations and obtain proper permissions 
                  before using in official materials.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}