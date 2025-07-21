import ImageGenerationWidget from "./ImageGenerationWidget";

interface ProviderImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
  className?: string;
}

export default function ProviderImageGenerator({ onImageGenerated, className }: ProviderImageGeneratorProps) {
  const suggestions = [
    "Professional nurse in scrubs with stethoscope",
    "Friendly doctor in white coat smiling",
    "Physical therapist helping patient",
    "Home healthcare worker with medical bag"
  ];

  return (
    <ImageGenerationWidget
      category="provider"
      title="Generate Provider Image"
      placeholder="Describe the healthcare provider image you want..."
      suggestions={suggestions}
      onImageGenerated={onImageGenerated}
      className={className}
    />
  );
}