import ImageGenerationWidget from "./ImageGenerationWidget";

interface ServiceImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
  className?: string;
}

export default function ServiceImageGenerator({ onImageGenerated, className }: ServiceImageGeneratorProps) {
  const suggestions = [
    "Home nursing care in comfortable living room",
    "Physical therapy session at home",
    "Mobile lab testing setup",
    "Telemedicine consultation on laptop"
  ];

  return (
    <ImageGenerationWidget
      category="service"
      title="Generate Service Image"
      placeholder="Describe the healthcare service image you want..."
      suggestions={suggestions}
      onImageGenerated={onImageGenerated}
      className={className}
    />
  );
}