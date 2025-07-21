export const coreServiceCategories = [
  {
    id: 1,
    name: "General Practice",
    description: "In-home check-ups, consultations, and family medicine",
    icon: "Stethoscope",
    color: "blue",
    price: "Get a Quote",
    insurance: "Covered by AHS & most private plans"
  },
  {
    id: 2,
    name: "Nursing Services",
    description: "Wound care, medication management, post-op care",
    icon: "UserCheck",
    color: "green",
    price: "Get a Quote",
    insurance: "Often covered by AHS home care"
  },
  {
    id: 3,
    name: "Physical Therapy",
    description: "In-home rehabilitation and recovery",
    icon: "Activity",
    color: "purple",
    price: "Get a Quote",
    insurance: "Covered by most extended health plans"
  },
  {
    id: 4,
    name: "Occupational Therapy",
    description: "Daily living support and assessments",
    icon: "Home",
    color: "orange",
    price: "Get a Quote",
    insurance: "Covered by most extended health plans"
  },
  {
    id: 5,
    name: "Palliative Care",
    description: "Compassionate end-of-life support",
    icon: "Heart",
    color: "pink",
    price: "Get a Quote",
    insurance: "Covered by AHS palliative care program"
  },
  {
    id: 6,
    name: "Mobile Lab Tests",
    description: "Phlebotomy and sample collection at home",
    icon: "TestTube",
    color: "teal",
    price: "Get a Quote",
    insurance: "Covered by AHS with requisition"
  },
  {
    id: 7,
    name: "Mental Health",
    description: "Counseling and therapy sessions at home",
    icon: "Brain",
    color: "indigo",
    price: "Get a Quote",
    insurance: "Partially covered by most plans"
  },
  {
    id: 8,
    name: "Vaccinations",
    description: "Immunizations administered at home",
    icon: "Syringe",
    color: "red",
    price: "Get a Quote",
    insurance: "Covered by AHS & most private plans"
  }
];

export const additionalServiceCategories = [
  {
    id: 9,
    name: "Dental Care",
    description: "Mobile checkups, cleanings, denture care",
    icon: "Smile",
    color: "blue",
    price: "Get a Quote",
    insurance: "Covered by most dental plans"
  },
  {
    id: 10,
    name: "Hearing Services",
    description: "Hearing tests and hearing aid fitting",
    icon: "Ear",
    color: "green",
    price: "Get a Quote",
    insurance: "Covered by most extended health plans"
  },
  {
    id: 11,
    name: "Vision Care",
    description: "Mobile eye exams and vision screening",
    icon: "Eye",
    color: "purple",
    price: "Get a Quote",
    insurance: "Covered by most vision care plans"
  },
  {
    id: 12,
    name: "Podiatry",
    description: "Foot care and diabetic foot assessments",
    icon: "Footprints",
    color: "orange",
    price: "Get a Quote",
    insurance: "Often covered for diabetic patients"
  },
  {
    id: 13,
    name: "Speech Therapy",
    description: "Communication and swallowing therapy",
    icon: "MessageCircle",
    color: "teal",
    price: "Get a Quote",
    insurance: "Covered by most extended health plans"
  },
  {
    id: 14,
    name: "Nutrition",
    description: "Dietitian consultations and meal planning",
    icon: "Apple",
    color: "pink",
    price: "Get a Quote",
    insurance: "Covered by most extended health plans"
  },
  {
    id: 15,
    name: "Pharmacy",
    description: "Medication reviews and coordination",
    icon: "Pill",
    color: "indigo",
    price: "Get a Quote",
    insurance: "Often covered by medication plans"
  },
  {
    id: 16,
    name: "IV Therapy",
    description: "Intravenous treatments and hydration",
    icon: "Droplets",
    color: "red",
    price: "Get a Quote",
    insurance: "Check with your insurance provider"
  }
];

export const serviceCategories = [...coreServiceCategories, ...additionalServiceCategories];

export const featuredProviders = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Registered Nurse",
    experience: "12 years exp.",
    rating: 4.9,
    reviewCount: 127,
    location: "NW Calgary",
    price: "Get a Quote",
    description: "Specializing in wound care, medication management, and post-operative care. Certified in advanced cardiac life support.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    verified: true,
    tags: ["Wound Care", "Medication Mgmt"],
    category: "nursing"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    specialty: "Physiotherapist",
    experience: "8 years exp.",
    rating: 4.8,
    reviewCount: 95,
    location: "SW Calgary",
    price: "Get a Quote",
    description: "Specialized in sports rehabilitation, mobility training, and post-injury recovery. Certified in manual therapy techniques.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    verified: true,
    tags: ["Sports Rehab", "Mobility"],
    category: "physiotherapy"
  },
  {
    id: 3,
    name: "Lisa Chen",
    specialty: "Dental Hygienist",
    experience: "10 years exp.",
    rating: 4.9,
    reviewCount: 82,
    location: "SE Calgary",
    price: "Get a Quote",
    description: "Professional dental cleaning and oral health education. Specialized in geriatric dental care and denture maintenance.",
    image: "https://images.unsplash.com/photo-1594824570509-1b0b83d63c49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    verified: true,
    tags: ["Dental Cleaning", "Dentures"],
    category: "dental"
  }
];
