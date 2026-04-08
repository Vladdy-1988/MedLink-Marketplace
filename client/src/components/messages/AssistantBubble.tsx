import { Button } from "@/components/ui/button";

interface SuggestedProvider {
  id: number;
  name: string;
  specialization: string;
  rating: any;
  reviewCount: number;
  basePricing: any;
  serviceAreas: any;
}

interface AssistantBubbleProps {
  message: string;
  suggestedProviders?: SuggestedProvider[];
  onSelectProvider: (providerId: number) => void;
  isLoading?: boolean;
}

export function AssistantBubble({
  message,
  suggestedProviders,
  onSelectProvider,
  isLoading,
}: AssistantBubbleProps) {
  return (
    <div className="flex gap-3 my-4">
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
        M
      </div>

      <div className="flex-1 space-y-3">
        <div className="bg-purple-50 border border-purple-100 rounded-xl rounded-tl-none p-3 text-sm text-gray-800 max-w-md">
          {isLoading ? (
            <div className="flex gap-1 items-center h-4">
              <span
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          ) : (
            message
          )}
        </div>

        {!isLoading && suggestedProviders && suggestedProviders.length > 0 && (
          <div className="space-y-2">
            {suggestedProviders.map((provider) => (
              <div
                key={provider.id}
                className="border rounded-lg p-3 bg-white max-w-sm hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{provider.name}</span>
                  {Number(provider.rating) > 0 && (
                    <span className="text-xs text-amber-600">
                      ★ {Number(provider.rating).toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  {provider.specialization}
                </p>
                {provider.basePricing && (
                  <p className="text-xs text-gray-500 mb-2">
                    From ${provider.basePricing}/visit
                  </p>
                )}
                <Button
                  size="sm"
                  className="w-full text-xs bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                  onClick={() => onSelectProvider(provider.id)}
                >
                  Request this provider
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
