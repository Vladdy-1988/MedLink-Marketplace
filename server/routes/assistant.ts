import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { isAuthenticated as checkAuth } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";

const router = Router();
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

function normalizeAssistantText(value: unknown): string {
  return String(value || "").toLowerCase();
}

function mapSuggestedProvider(provider: any) {
  return {
    id: provider.id,
    name: `${provider.firstName || ""} ${provider.lastName || ""}`.trim(),
    specialization: provider.specialization,
    rating: provider.rating,
    reviewCount: provider.reviewCount,
    basePricing: provider.basePricing,
    serviceAreas: provider.serviceAreas,
  };
}

function pickDeterministicProviders(message: string, providers: any[]): any[] {
  const query = normalizeAssistantText(message);
  const scored = providers.map((provider, index) => {
    const serviceText = Array.isArray(provider.services)
      ? provider.services
          .map((service: any) => `${service?.name || ""} ${service?.category || ""}`)
          .join(" ")
      : "";
    const haystack = normalizeAssistantText(
      `${provider.firstName} ${provider.lastName} ${provider.specialization} ${serviceText}`,
    );
    const score = query
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2)
      .reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
    return { provider, score, index };
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  return scored.slice(0, 3).map((item) => item.provider);
}

function deterministicAssistantResponse(message: string, providers: any[]) {
  const suggestedProviders = pickDeterministicProviders(message, providers);
  const hasProviders = suggestedProviders.length > 0;
  return {
    message: hasProviders
      ? "I found a few verified in-home providers that may fit. Review their profiles, then message the provider or book when you are ready."
      : "Tell me what kind of in-home care you need, your timing, and your Calgary area, and I can narrow the options.",
    suggestedProviders: suggestedProviders.map(mapSuggestedProvider),
  };
}

router.post("/assistant/message", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = await storage.getUser(userId);
    if (user?.userType !== "patient") {
      return res.status(403).json({ error: "Assistant is for patients only" });
    }

    const { message, history = [], patientContext = {} } = req.body as {
      message?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      patientContext?: {
        location?: string;
        insuranceProviders?: string[];
      };
    };

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const providers = await storage.searchProviders({});
    const topProviders = providers.slice(0, 30);

    if (!anthropic) {
      return res.json(deterministicAssistantResponse(message, topProviders));
    }

    const providerContext = topProviders
      .map(
        (p: any) =>
          `ID:${p.id} | ${p.firstName} ${p.lastName} | ${p.specialization} | ` +
          `Areas: ${
            Array.isArray(p.serviceAreas)
              ? p.serviceAreas.join(", ")
              : p.serviceAreas || "Calgary"
          } | ` +
          `Rating: ${p.rating || "New"} | Base: $${p.basePricing || "TBD"}`,
      )
      .join("\n");

    try {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: `You are the MedLink assistant helping a patient in Calgary find the right in-home healthcare provider.

Your job:
- Understand what the patient needs (discipline, urgency, location)
- Ask ONE clarifying question at a time if needed
- When you have enough info, suggest 1–3 providers from the list below
- Always append provider suggestions in this format at the end: [PROVIDER:id]
- Never book anything — always let the patient decide
- Keep responses under 100 words
- Be warm, clear, and professional

Available providers:
${providerContext}

Patient context:
Location: ${patientContext.location || "Calgary"}
Insurance: ${
  Array.isArray(patientContext.insuranceProviders)
    ? patientContext.insuranceProviders.join(", ")
    : "Unknown"
}`,
        messages: [
          ...history,
          { role: "user", content: message },
        ],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      const text = textBlock?.type === "text" ? textBlock.text : "";
      const providerMatches = Array.from(text.matchAll(/\[PROVIDER:(\d+)\]/g));
      const suggestedProviderIds = Array.from(
        new Set(providerMatches.map((match) => parseInt(match[1], 10))),
      );
      const providerById = new Map(
        topProviders.map((provider: any) => [provider.id, provider]),
      );
      const suggestedProviders = suggestedProviderIds
        .map((id) => providerById.get(id))
        .filter(Boolean);

      const cleanText = text.replace(/\[PROVIDER:\d+\]/g, "").trim();

      res.json({
        message: cleanText,
        suggestedProviders: suggestedProviders.map(mapSuggestedProvider),
      });
    } catch (error) {
      console.error("Assistant model error, using deterministic fallback:", error);
      res.json(deterministicAssistantResponse(message, topProviders));
    }
  } catch (error) {
    console.error("Assistant error:", error);
    res.status(500).json({ error: "Assistant unavailable" });
  }
});

export default router;
