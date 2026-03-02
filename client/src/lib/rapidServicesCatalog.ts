export interface RapidServiceTeaser {
  title: string;
  description: string;
  pricing: string;
  features: string[];
}

export const rapidServiceTeasers: RapidServiceTeaser[] = [
  {
    title: "Rapid Nursing Care",
    description: "ASAP nursing care for non-life-threatening medical situations",
    pricing: "Contact provider for quote",
    features: ["Priority response", "Rapid assessment", "Care coordination", "Extended hours available"],
  },
  {
    title: "Rapid Lab Services",
    description: "ASAP blood work and diagnostic testing with expedited results",
    pricing: "Contact provider for quote",
    features: ["Same-day results", "Priority scheduling", "Rapid sample collection", "Expedited processing"],
  },
  {
    title: "Rapid Mental Health Support",
    description: "ASAP mental health support and priority counseling",
    pricing: "Contact provider for quote",
    features: ["Priority scheduling", "Same-day appointments", "Rapid assessment", "Support coordination"],
  },
];

export interface RapidServiceDetail {
  title: string;
  description: string;
  icon: "Stethoscope" | "Syringe" | "Brain" | "Activity";
  features: string[];
  pricing: string;
  responseTime: string;
  availability: string;
}

export const rapidServiceDetails: RapidServiceDetail[] = [
  {
    title: "Rapid Nursing Care",
    description: "ASAP nursing care for non-life-threatening medical situations requiring immediate professional attention.",
    icon: "Stethoscope",
    features: [
      "Wound assessment and rapid care",
      "Vital signs monitoring and evaluation",
      "Medication administration and guidance",
      "Health crisis management",
      "Pain assessment and management",
      "Rapid health education",
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 2-4 hours",
    availability: "Daily 7AM-11PM",
  },
  {
    title: "Rapid Lab Services",
    description: "ASAP blood work and diagnostic testing with expedited processing and same-day results.",
    icon: "Syringe",
    features: [
      "Rapid blood draws",
      "Priority diagnostic testing",
      "Expedited sample processing",
      "Same-day results delivery",
      "Critical value alerts",
      "Coordination with healthcare providers",
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 1-3 hours",
    availability: "Daily 7AM-11PM",
  },
  {
    title: "Rapid Mental Health Support",
    description: "Crisis intervention and ASAP mental health support for immediate psychological needs.",
    icon: "Brain",
    features: [
      "Crisis intervention counseling",
      "Rapid mental health assessment",
      "Safety planning and support",
      "Immediate coping strategies",
      "Resource coordination",
      "Follow-up care planning",
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 2-6 hours",
    availability: "Daily 7AM-11PM",
  },
  {
    title: "Rapid Physiotherapy",
    description: "ASAP mobility and pain management for acute injuries and movement situations.",
    icon: "Activity",
    features: [
      "Acute injury assessment",
      "Rapid pain management",
      "Mobility restoration techniques",
      "Immediate exercise therapy",
      "Safety evaluation",
      "Equipment assessment",
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 3-6 hours",
    availability: "Daily 7AM-11PM",
  },
];
