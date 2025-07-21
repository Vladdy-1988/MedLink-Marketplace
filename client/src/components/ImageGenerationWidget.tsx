import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImageGenerationWidgetProps {
  category: string;
  title: string;
  placeholder: string;
  suggestions: string[];
  onImageGenerated?: (imageUrl: string) => void;
  className?: string;
}

export default function ImageGenerationWidget({
  category,
  title,
  placeholder,
  suggestions,
  onImageGenerated,
  className = ""
}: ImageGenerationWidgetProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for the image.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/generate-image", {
        prompt: prompt.trim(),
        category
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setGeneratedImage(result.url);
        onImageGenerated?.(result.url);
        
        toast({
          title: "Image Generated",
          description: "Your image has been created successfully!",
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

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medlink-${category}-${Date.now()}.png`;
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
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-600" />
          {title}
          <Sparkles className="h-4 w-4 text-purple-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generated Image Display */}
        {generatedImage && (
          <div className="space-y-3">
            <div className="relative group">
              <img
                src={generatedImage}
                alt="Generated healthcare image"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <Button
                size="sm"
                onClick={handleDownload}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}

        {/* Prompt Input */}
        <div className="space-y-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="resize-none"
            maxLength={200}
          />
          <div className="text-sm text-gray-500 text-right">
            {prompt.length}/200 characters
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Quick suggestions:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs"
                onClick={() => setPrompt(suggestion)}
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}