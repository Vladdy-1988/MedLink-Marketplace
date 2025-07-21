import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Wand2, Image as ImageIcon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  category: string;
}

interface ImageGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void;
  category?: string;
  className?: string;
}

export default function ImageGenerator({ onImageGenerated, category = "marketing", className = "" }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const { toast } = useToast();

  const categories = [
    { value: "provider", label: "Healthcare Provider", description: "Professional portraits of medical staff" },
    { value: "service", label: "Medical Service", description: "Healthcare services and procedures" },
    { value: "facility", label: "Medical Facility", description: "Clinics, hospitals, medical offices" },
    { value: "marketing", label: "Marketing", description: "Promotional and marketing content" }
  ];

  const promptSuggestions = {
    provider: [
      "Friendly nurse in scrubs with stethoscope",
      "Professional doctor in white coat smiling",
      "Physical therapist helping patient",
      "Home healthcare worker with medical bag"
    ],
    service: [
      "Home nursing care in comfortable living room",
      "Physical therapy session at home",
      "Mobile lab testing setup",
      "Telemedicine consultation on laptop"
    ],
    facility: [
      "Modern medical clinic waiting room",
      "Clean hospital corridor with natural light",
      "Home healthcare office setup",
      "Medical equipment storage room"
    ],
    marketing: [
      "Happy family receiving home healthcare",
      "Professional medical team collaboration",
      "Healthcare technology and innovation",
      "Wellness and preventive care concept"
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-image", {
        prompt: prompt.trim(),
        category: selectedCategory
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const newImage: GeneratedImage = result;
        setGeneratedImages(prev => [newImage, ...prev]);
        onImageGenerated?.(newImage);
        
        toast({
          title: "Image Generated",
          description: "Your healthcare image has been created successfully!",
        });
        
        setPrompt("");
      } else {
        throw new Error(result.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleDownload = async (imageUrl: string, imageId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medlink-${imageId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded",
        description: "Image saved to your downloads folder.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2 className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI Image Generator</h2>
          <Sparkles className="h-6 w-6 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate professional healthcare images using AI. Perfect for provider profiles, service illustrations, and marketing content.
        </p>
      </div>

      {/* Generation Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Generate New Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select image category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-sm text-gray-500">{cat.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the healthcare image you want to generate..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-sm text-gray-500 text-right">
              {prompt.length}/500 characters
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Suggestions</label>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions[selectedCategory as keyof typeof promptSuggestions]?.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <div key={image.id} className="space-y-3">
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(image.url, image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {image.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}