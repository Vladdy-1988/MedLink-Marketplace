import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  userId?: number;
  category: 'provider' | 'service' | 'facility' | 'marketing';
}

export class ImageGenerationService {
  /**
   * Generate healthcare-related images using DALL-E
   */
  async generateHealthcareImage(prompt: string, category: string, userId?: number): Promise<GeneratedImage> {
    if (!openai) {
      // Return mock data when API key is not available
      return this.getMockImage(prompt, category as any, userId);
    }

    try {
      // Enhance prompt for healthcare context
      const enhancedPrompt = this.enhanceHealthcarePrompt(prompt, category);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        prompt: enhancedPrompt,
        createdAt: new Date(),
        userId,
        category: category as any
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate provider profile images
   */
  async generateProviderImage(specialty: string, gender?: string, age?: string): Promise<GeneratedImage> {
    const genderText = gender ? `, ${gender}` : '';
    const ageText = age ? `, ${age}` : '';
    
    const prompt = `Professional healthcare provider specializing in ${specialty}${genderText}${ageText}, wearing appropriate medical attire, friendly and approachable expression, clean medical office background, high quality portrait photography style`;
    
    return this.generateHealthcareImage(prompt, 'provider');
  }

  /**
   * Generate service-related images
   */
  async generateServiceImage(serviceName: string, setting: string = 'home'): Promise<GeneratedImage> {
    const prompt = `${serviceName} being provided in a ${setting} setting, professional healthcare equipment, clean and sterile environment, natural lighting, modern healthcare photography style`;
    
    return this.generateHealthcareImage(prompt, 'service');
  }

  /**
   * Generate facility images
   */
  async generateFacilityImage(facilityType: string, style: string = 'modern'): Promise<GeneratedImage> {
    const prompt = `${style} ${facilityType}, clean and professional healthcare environment, natural lighting, welcoming atmosphere, high-end medical facility photography`;
    
    return this.generateHealthcareImage(prompt, 'facility');
  }

  /**
   * Generate marketing images
   */
  async generateMarketingImage(concept: string, style: string = 'professional'): Promise<GeneratedImage> {
    const prompt = `Healthcare marketing image for ${concept}, ${style} style, clean design, medical theme, professional photography, bright and welcoming atmosphere`;
    
    return this.generateHealthcareImage(prompt, 'marketing');
  }

  /**
   * Enhance prompts for healthcare context
   */
  private enhanceHealthcarePrompt(prompt: string, category: string): string {
    const baseModifiers = "professional, clean, medical, high quality, well-lit";
    const categoryModifiers = {
      provider: "healthcare professional, medical attire, friendly expression",
      service: "healthcare service, professional equipment, clean environment", 
      facility: "medical facility, modern healthcare, welcoming atmosphere",
      marketing: "healthcare marketing, professional design, medical theme"
    };

    const modifier = categoryModifiers[category as keyof typeof categoryModifiers] || baseModifiers;
    
    return `${prompt}, ${modifier}, ${baseModifiers}`;
  }

  /**
   * Mock image data for development
   */
  private getMockImage(prompt: string, category: GeneratedImage['category'], userId?: number): GeneratedImage {
    const mockImages = {
      provider: [
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
      ],
      service: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
      ],
      facility: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019613914-85e2e3b9df0b?w=400&h=400&fit=crop"
      ],
      marketing: [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1583912086284-216bb9b12727?w=400&h=400&fit=crop"
      ]
    };

    const categoryImages = mockImages[category] || mockImages.provider;
    const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];

    return {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: randomImage,
      prompt,
      createdAt: new Date(),
      userId,
      category
    };
  }
}

// Export singleton instance
export const imageGenerationService = new ImageGenerationService();