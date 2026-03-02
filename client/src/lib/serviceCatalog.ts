export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  price: string;
  insurance?: string;
}

export const coreServiceCategories: ServiceCategory[] = [
  {
    id: 1,
    name: "General Practice",
    description: "In-home check-ups, consultations, and family medicine",
    icon: "Stethoscope",
    color: "blue",
    price: "Message Provider",
    insurance: "Covered by AHS & most private plans",
  },
  {
    id: 2,
    name: "Nursing Services",
    description: "Wound care, medication management, post-op care",
    icon: "UserCheck",
    color: "green",
    price: "Message Provider",
    insurance: "Often covered by AHS home care",
  },
  {
    id: 3,
    name: "Physical Therapy",
    description: "In-home rehabilitation and recovery",
    icon: "Activity",
    color: "purple",
    price: "Message Provider",
    insurance: "Covered by most extended health plans",
  },
  {
    id: 4,
    name: "Occupational Therapy",
    description: "Daily living support and assessments",
    icon: "Home",
    color: "orange",
    price: "Message Provider",
    insurance: "Covered by most extended health plans",
  },
  {
    id: 5,
    name: "Palliative Care",
    description: "Compassionate end-of-life support",
    icon: "Heart",
    color: "pink",
    price: "Message Provider",
    insurance: "Covered by AHS palliative care program",
  },
  {
    id: 6,
    name: "Mobile Lab Tests",
    description: "Phlebotomy and sample collection at home",
    icon: "TestTube",
    color: "teal",
    price: "Message Provider",
    insurance: "Covered by AHS with requisition",
  },
  {
    id: 7,
    name: "Mental Health",
    description: "Counseling and therapy sessions at home",
    icon: "Brain",
    color: "indigo",
    price: "Message Provider",
    insurance: "Partially covered by most plans",
  },
  {
    id: 8,
    name: "Vaccinations",
    description: "Immunizations administered at home",
    icon: "Syringe",
    color: "red",
    price: "Message Provider",
    insurance: "Covered by AHS & most private plans",
  },
];

export const additionalServiceCategories: ServiceCategory[] = [
  {
    id: 9,
    name: "Dental Care",
    description: "Mobile checkups, cleanings, denture care",
    icon: "Smile",
    color: "blue",
    price: "Message Provider",
    insurance: "Covered by most dental plans",
  },
  {
    id: 10,
    name: "Hearing Services",
    description: "Hearing tests and hearing aid fitting",
    icon: "Ear",
    color: "green",
    price: "Message Provider",
    insurance: "Covered by most extended health plans",
  },
  {
    id: 11,
    name: "Vision Care",
    description: "Mobile eye exams and vision screening",
    icon: "Eye",
    color: "purple",
    price: "Message Provider",
    insurance: "Covered by most vision care plans",
  },
  {
    id: 12,
    name: "Podiatry",
    description: "Foot care and diabetic foot assessments",
    icon: "Footprints",
    color: "orange",
    price: "Message Provider",
    insurance: "Often covered for diabetic patients",
  },
  {
    id: 13,
    name: "Speech Therapy",
    description: "Communication and swallowing therapy",
    icon: "MessageCircle",
    color: "teal",
    price: "Message Provider",
    insurance: "Covered by most extended health plans",
  },
  {
    id: 14,
    name: "Nutrition",
    description: "Dietitian consultations and meal planning",
    icon: "Apple",
    color: "pink",
    price: "Message Provider",
    insurance: "Covered by most extended health plans",
  },
  {
    id: 15,
    name: "Pharmacy",
    description: "Medication reviews and coordination",
    icon: "Pill",
    color: "indigo",
    price: "Message Provider",
    insurance: "Often covered by medication plans",
  },
  {
    id: 16,
    name: "IV Therapy",
    description: "Intravenous treatments and hydration",
    icon: "Droplets",
    color: "red",
    price: "Message Provider",
    insurance: "Check with your insurance provider",
  },
];

export const serviceCategories = [...coreServiceCategories, ...additionalServiceCategories];
