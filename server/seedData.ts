// Sample data seeding script for development and testing
import { storage } from "./storage";
import type { InsertProvider, InsertService } from "@shared/schema";

export async function seedSampleData() {
  console.log("🌱 Seeding sample data...");

  try {
    // Create sample patients
    const patients = [
      {
        id: "patient-1",
        email: "sarah.johnson@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        userType: "patient" as const,
        phoneNumber: "+1-403-555-0101",
        address: "1234 Main Street, Calgary, AB T2P 1A4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "patient-2", 
        email: "mike.chen@example.com",
        firstName: "Mike",
        lastName: "Chen",
        userType: "patient" as const,
        phoneNumber: "+1-403-555-0102",
        address: "5678 Oak Avenue, Calgary, AB T2N 2B7",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Create sample providers
    const providerUsers = [
      {
        id: "provider-1",
        email: "dr.smith@mymedlink.ca",
        firstName: "Dr. Emma",
        lastName: "Smith",
        userType: "provider" as const,
        phoneNumber: "+1-403-555-0201",
        address: "Medical Centre, 910 Bow Valley Drive, Calgary, AB T2P 3K2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "provider-2",
        email: "dr.patel@mymedlink.ca", 
        firstName: "Dr. Raj",
        lastName: "Patel",
        userType: "provider" as const,
        phoneNumber: "+1-403-555-0202",
        address: "Health Clinic, 1425 Centre Street N, Calgary, AB T2E 2R7",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Seed users
    for (const patient of patients) {
      await storage.upsertUser(patient);
      console.log(`✓ Created patient: ${patient.firstName} ${patient.lastName}`);
    }

    for (const providerUser of providerUsers) {
      await storage.upsertUser(providerUser);
      console.log(`✓ Created provider user: ${providerUser.firstName} ${providerUser.lastName}`);
    }

    // Create provider profiles
    const providers = [
      {
        userId: "provider-1",
        specialization: "Family Medicine",
        licenseNumber: "AB-FM-12345",
        yearsExperience: 8,
        bio: "Experienced family physician specializing in comprehensive home healthcare. Passionate about preventive medicine and patient-centered care.",
        serviceAreas: ["Calgary NW", "Calgary NE", "Calgary Downtown"],
        basePricing: "150",
        isApproved: true,
        isVerified: true,
        rating: "4.8",
        reviewCount: 24,
        availability: {
          monday: ["09:00", "17:00"],
          tuesday: ["09:00", "17:00"], 
          wednesday: ["09:00", "17:00"],
          thursday: ["09:00", "17:00"],
          friday: ["09:00", "15:00"]
        }
      },
      {
        userId: "provider-2",
        specialization: "Internal Medicine",
        licenseNumber: "AB-IM-67890",
        yearsExperience: 12,
        bio: "Board-certified internist with expertise in chronic disease management and rapid care services for urgent health concerns.",
        serviceAreas: ["Calgary SW", "Calgary SE", "Calgary Downtown"],
        basePricing: "175",
        isApproved: true,
        isVerified: true,
        rating: "4.9",
        reviewCount: 31,
        availability: {
          monday: ["08:00", "18:00"],
          tuesday: ["08:00", "18:00"],
          wednesday: ["08:00", "18:00"],
          thursday: ["08:00", "18:00"],
          friday: ["08:00", "16:00"],
          saturday: ["10:00", "14:00"]
        }
      }
    ];

    let providerId1: number = 0;
    let providerId2: number = 0;

    for (let index = 0; index < providers.length; index++) {
      const provider = providers[index];
      const createdProvider = await storage.createProvider(provider);
      if (index === 0) providerId1 = createdProvider.id;
      if (index === 1) providerId2 = createdProvider.id;
      console.log(`✓ Created provider profile: ${provider.specialization}`);
    }

    // Create sample services
    const services = [
      // Dr. Smith's services
      {
        providerId: providerId1,
        name: "Comprehensive Health Assessment",
        description: "Complete physical examination, health screening, and personalized wellness plan during your home visit.",
        category: "preventive",
        estimatedDuration: 60,
        basePrice: 200.00,
        isRapidService: false
      },
      {
        providerId: providerId1,
        name: "Rapid Health Consultation",
        description: "Same-day urgent consultation for non-emergency health concerns. Available for ASAP scheduling.",
        category: "rapid",
        estimatedDuration: 30,
        basePrice: 150.00,
        isRapidService: true
      },
      {
        providerId: providerId1,
        name: "Chronic Disease Management",
        description: "Ongoing care for diabetes, hypertension, and other chronic conditions with home monitoring setup.",
        category: "chronic-care",
        estimatedDuration: 45,
        basePrice: 175.00,
        isRapidService: false
      },
      // Dr. Patel's services
      {
        providerId: providerId2,
        name: "Senior Health Assessment",
        description: "Specialized comprehensive care for seniors including medication review and mobility assessment.",
        category: "geriatric",
        estimatedDuration: 75,
        basePrice: 225.00,
        isRapidService: false
      },
      {
        providerId: providerId2,
        name: "Rapid Internal Medicine Consultation", 
        description: "Urgent internal medicine consultation available same-day for complex health concerns.",
        category: "rapid",
        estimatedDuration: 45,
        basePrice: 200.00,
        isRapidService: true
      },
      {
        providerId: providerId2,
        name: "Post-Hospital Home Visit",
        description: "Follow-up care after hospital discharge including recovery monitoring and medication management.",
        category: "post-acute",
        estimatedDuration: 60,
        basePrice: 180.00,
        isRapidService: false
      }
    ];

    for (const service of services) {
      await storage.createService({
        providerId: service.providerId,
        name: service.name,
        description: service.description,
        category: service.category,
        duration: service.estimatedDuration,
        price: service.basePrice.toFixed(2),
      });
      console.log(`✓ Created service: ${service.name}`);
    }

    console.log("🎉 Sample data seeding completed successfully!");
    console.log("");
    console.log("Sample accounts created:");
    console.log("📧 Patients:");
    console.log("  - sarah.johnson@example.com (Sarah Johnson)");
    console.log("  - mike.chen@example.com (Mike Chen)");
    console.log("📧 Providers:");
    console.log("  - dr.smith@medlink.ca (Dr. Emma Smith - Family Medicine)");
    console.log("  - dr.patel@medlink.ca (Dr. Raj Patel - Internal Medicine)");
    console.log("");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedSampleData().then(() => process.exit(0));
}
