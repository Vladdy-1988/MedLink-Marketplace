import {
  users,
  providers,
  services,
  bookings,
  messages,
  reviews,
  providerCredentials,
  auditLogs,
  transactions,
  systemSettings,
  userActivityLogs,
  platformAnalytics,
  userAddresses,
  emergencyContacts,
  patientHealthProfiles,
  familyMembers,
  insuranceInfo,
  paymentMethods,
  providerAvailability,
  providerBlackouts,
  providerPatientNotes,
  bookingDocuments,
  bookingStatusHistory,
  messageAttachments,
  consentRecords,
  userReports,
  waitlistEntries,
  type User,
  type UpsertUser,
  type Provider,
  type InsertProvider,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type ProviderCredential,
  type InsertProviderCredential,
  type AuditLog,
  type InsertAuditLog,
  type Transaction,
  type InsertTransaction,
  type SystemSetting,
  type UserActivityLog,
  type InsertUserActivityLog,
  type PlatformAnalytics,
  type UserAddress,
  type InsertUserAddress,
  type EmergencyContact,
  type InsertEmergencyContact,
  type PatientHealthProfile,
  type InsertPatientHealthProfile,
  type FamilyMember,
  type InsertFamilyMember,
  type InsuranceInfo,
  type InsertInsuranceInfo,
  type PaymentMethod,
  type InsertPaymentMethod,
  type ProviderAvailability,
  type InsertProviderAvailability,
  type ProviderBlackout,
  type InsertProviderBlackout,
  type ProviderPatientNotes,
  type InsertProviderPatientNotes,
  type BookingDocument,
  type InsertBookingDocument,
  type BookingStatusHistory,
  type InsertBookingStatusHistory,
  type MessageAttachment,
  type InsertMessageAttachment,
  type ConsentRecord,
  type InsertConsentRecord,
  type UserReport,
  type InsertUserReport,
  type WaitlistEntry,
  type InsertWaitlistEntry,
} from "@shared/schema";
import { db } from "./db";
import {
  asc,
  eq,
  desc,
  and,
  or,
  sql,
  gte,
  lte,
  ilike,
  inArray,
  exists,
} from "drizzle-orm";

function getDatabaseError(error: any): any {
  return error?.cause ?? error;
}

function isUniqueEmailViolation(error: any): boolean {
  const dbError = getDatabaseError(error);
  const message = String(dbError?.message || error?.message || "");
  const detail = String(dbError?.detail || "");
  const constraint = String(dbError?.constraint || "");

  return (
    dbError?.code === "23505" &&
    (constraint.includes("email") ||
      detail.includes("email") ||
      message.includes("users_email"))
  );
}

async function attachServicesToProviders<T extends { id: number }>(
  results: T[],
): Promise<Array<T & { services: Service[] }>> {
  const providerIds = results.map((provider) => provider.id);
  const allServices =
    providerIds.length > 0
      ? await db
          .select()
          .from(services)
          .where(inArray(services.providerId, providerIds))
      : [];

  return results.map((provider) => ({
    ...provider,
    services: allServices.filter((service) => service.providerId === provider.id),
  }));
}

function dedupeProvidersByUserId<T extends { userId: string }>(results: T[]): T[] {
  const seen = new Set<string>();

  return results.filter((provider) => {
    if (seen.has(provider.userId)) {
      return false;
    }

    seen.add(provider.userId);
    return true;
  });
}

function sortMarketplaceProviders<
  T extends {
    rating: string | number | null;
    reviewCount: number | null;
    createdAt: Date | string | null;
  },
>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    const ratingDelta = Number(b.rating ?? 0) - Number(a.rating ?? 0);
    if (ratingDelta !== 0) {
      return ratingDelta;
    }

    const reviewDelta = Number(b.reviewCount ?? 0) - Number(a.reviewCount ?? 0);
    if (reviewDelta !== 0) {
      return reviewDelta;
    }

    return (
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
    );
  });
}

function getMarketplaceProviderConditions() {
  return [
    eq(providers.isApproved, true),
    eq(providers.isVerified, true),
    sql`LOWER(TRIM(${providers.specialization})) NOT IN ('cardiology', 'cardiac surgery', 'surgery')`,
  ];
}

const liveProviderRating = sql<string>`
  COALESCE(
    ROUND(
      (
        SELECT AVG(${reviews.rating})::numeric
        FROM ${reviews}
        WHERE ${reviews.providerId} = ${providers.id}
      ),
      1
    )::text,
    '0'
  )
`;

const liveProviderReviewCount = sql<number>`
  COALESCE(
    (
      SELECT COUNT(*)::int
      FROM ${reviews}
      WHERE ${reviews.providerId} = ${providers.id}
    ),
    0
  )
`;

const liveProviderPatientCount = sql<number>`
  COALESCE(
    (
      SELECT COUNT(DISTINCT ${bookings.patientId})::int
      FROM ${bookings}
      WHERE
        ${bookings.providerId} = ${providers.id}
        AND ${bookings.status} <> 'cancelled'
    ),
    0
  )
`;

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | null>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserSubscription(
    userId: string,
    data: {
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      subscriptionStatus?: string | null;
      subscriptionCurrentPeriodEnd?: Date | null;
    },
  ): Promise<User>;

  // User address operations
  createUserAddress(address: InsertUserAddress): Promise<UserAddress>;
  getUserAddresses(userId: string): Promise<UserAddress[]>;
  updateUserAddress(id: number, userId: string, updates: Partial<UserAddress>): Promise<UserAddress | undefined>;
  deleteUserAddress(id: number, userId: string): Promise<boolean>;
  setDefaultAddress(userId: string, addressId: number): Promise<boolean>;

  // Emergency contact operations
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
  updateEmergencyContact(id: number, userId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: number, userId: string): Promise<boolean>;

  // Patient health profile operations
  createHealthProfile(profile: InsertPatientHealthProfile): Promise<PatientHealthProfile>;
  getHealthProfile(userId: string): Promise<PatientHealthProfile | undefined>;
  updateHealthProfile(id: number, userId: string, updates: Partial<PatientHealthProfile>): Promise<PatientHealthProfile | undefined>;

  // Family member operations
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  getFamilyMembers(userId: string): Promise<FamilyMember[]>;
  updateFamilyMember(id: number, userId: string, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: number, userId: string): Promise<boolean>;

  // Insurance operations
  createInsuranceInfo(insurance: InsertInsuranceInfo): Promise<InsuranceInfo>;
  getInsuranceInfo(userId: string): Promise<InsuranceInfo[]>;
  updateInsuranceInfo(id: number, userId: string, updates: Partial<InsuranceInfo>): Promise<InsuranceInfo | undefined>;
  deleteInsuranceInfo(id: number, userId: string): Promise<boolean>;

  // Payment method operations
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  updatePaymentMethod(id: number, userId: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: number, userId: string): Promise<boolean>;
  setDefaultPaymentMethod(userId: string, methodId: number): Promise<boolean>;

  // Provider operations
  createProvider(provider: InsertProvider): Promise<Provider>;
  getProvider(id: number): Promise<Provider | undefined>;
  getProviderByUserId(userId: string): Promise<Provider | undefined>;
  updateProvider(id: number, updates: Partial<typeof providers.$inferInsert>): Promise<any>;
  updateProviderConnect(
    providerId: number,
    data: { stripeAccountId?: string | null; connectOnboardingComplete?: boolean },
  ): Promise<void>;
  getMarketplaceProviders(): Promise<any[]>;
  getMarketplaceProviderById(id: number): Promise<any | undefined>;
  updateProviderApproval(id: number, isApproved: boolean): Promise<void>;
  searchProviders(filters: {
    q?: string;
    serviceType?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
    sortBy?: string;
  }): Promise<any[]>;
  getProviderEarnings(providerId: number): Promise<{
    totalEarned: number;
    pendingTransfers: number;
    bookings: Array<{
      id: number;
      date: Date;
      patientId: string;
      totalAmount: string;
      platformFee: string | null;
      providerPayout: string | null;
      status: string;
    }>;
  }>;
  getNextAvailableSlot(providerId: number): Promise<Date | null>;

  // Service operations
  createService(service: InsertService): Promise<Service>;
  getServicesByProvider(providerId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  updateService(id: number, updates: Partial<Service>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Provider availability operations
  createProviderAvailability(availability: InsertProviderAvailability): Promise<ProviderAvailability>;
  getProviderAvailability(providerId: number): Promise<ProviderAvailability[]>;
  updateProviderAvailability(id: number, updates: Partial<ProviderAvailability>): Promise<ProviderAvailability>;
  deleteProviderAvailability(id: number): Promise<void>;

  // Provider blackout operations
  createProviderBlackout(blackout: InsertProviderBlackout): Promise<ProviderBlackout>;
  getProviderBlackouts(providerId: number): Promise<ProviderBlackout[]>;
  deleteProviderBlackout(id: number): Promise<void>;

  // Provider patient notes operations
  createProviderPatientNotes(notes: InsertProviderPatientNotes): Promise<ProviderPatientNotes>;
  getProviderPatientNotes(providerId: number, patientId: string): Promise<ProviderPatientNotes[]>;
  updateProviderPatientNotes(id: number, updates: Partial<ProviderPatientNotes>): Promise<ProviderPatientNotes>;
  deleteProviderPatientNotes(id: number): Promise<void>;

  // Booking operations
  createBooking(
    booking: InsertBooking & Pick<Booking, "status" | "paymentStatus" | "totalAmount">,
  ): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByPatient(patientId: string): Promise<Booking[]>;
  getBookingsByProvider(providerId: number): Promise<Booking[]>;
  getBookingsByProviderAndDate(providerId: number, date: Date): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<void>;
  updateBookingPayment(id: number, paymentIntentId: string, paymentStatus: string): Promise<void>;
  getBookingWithDetails(id: number): Promise<any>;
  cancelBooking(id: number, cancelledBy: string, reason?: string): Promise<void>;
  rescheduleBooking(id: number, newDate: Date, rescheduleBy: string, reason?: string): Promise<void>;
  getUpcomingBookingsNeedingReminder(window: "24h" | "1h"): Promise<Booking[]>;
  markReminderSent(id: number, window: "24h" | "1h"): Promise<void>;

  // Booking document operations
  createBookingDocument(document: InsertBookingDocument): Promise<BookingDocument>;
  getBookingDocuments(bookingId: number): Promise<BookingDocument[]>;
  deleteBookingDocument(id: number): Promise<void>;

  // Booking status history operations
  createBookingStatusHistory(history: InsertBookingStatusHistory): Promise<BookingStatusHistory>;
  getBookingStatusHistory(bookingId: number): Promise<BookingStatusHistory[]>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getConversationsForUser(userId: string): Promise<any[]>;
  markMessageAsRead(messageId: number): Promise<void>;
  markConversationAsRead(userId: string, partnerId: string): Promise<void>;
  getMessagesWithAttachments(userId1: string, userId2: string): Promise<any[]>;

  // Message attachment operations
  createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment>;
  getMessageAttachments(messageId: number): Promise<MessageAttachment[]>;
  deleteMessageAttachment(id: number): Promise<void>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForProvider(providerId: number): Promise<any[]>;
  getReviewByBookingId(bookingId: number): Promise<Review | undefined>;
  getAllReviews(): Promise<any[]>;

  // User report operations
  createUserReport(report: InsertUserReport): Promise<UserReport>;
  getUserReports(filters?: { status?: string; providerId?: number }): Promise<any[]>;

  // Waitlist operations
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistByPatient(patientId: string): Promise<WaitlistEntry[]>;
  getWaitlistByProvider(providerId: number): Promise<WaitlistEntry[]>;
  notifyWaitlistEntries(providerId: number, cancelledDate: Date): Promise<WaitlistEntry[]>;
  deleteWaitlistEntry(id: number, patientId: string): Promise<boolean>;

  // Provider credential operations
  createProviderCredential(credential: InsertProviderCredential): Promise<ProviderCredential>;
  getProviderCredentials(providerId: number): Promise<ProviderCredential[]>;
  getCredentialsByProvider(userId: string): Promise<ProviderCredential[]>;
  updateCredentialVerification(id: number, status: string, reviewedBy: string, reviewNotes?: string): Promise<void>;
  getAllPendingCredentials(): Promise<any[]>;

  // Admin operations
  getPendingProviders(): Promise<any[]>;
  getAllProviders(): Promise<any[]>;
  getAllBookings(): Promise<any[]>;
  getAllReviews(): Promise<any[]>;
  getAllUsers(): Promise<User[]>;
  updateProviderStatus(id: number, isApproved: boolean, isVerified?: boolean): Promise<void>;
  
  // Audit log operations
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<any[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(filters?: { status?: string; type?: string; providerId?: number }): Promise<any[]>;
  getAdminCommissions(): Promise<any[]>;
  updateTransactionStatus(id: number, status: string): Promise<void>;
  
  // System settings operations
  getSystemSettings(): Promise<SystemSetting[]>;
  updateSystemSetting(key: string, value: string, updatedBy: string): Promise<void>;
  
  // User activity operations
  logUserActivity(activity: InsertUserActivityLog): Promise<UserActivityLog>;
  getUserActivity(userId: string, limit?: number): Promise<UserActivityLog[]>;
  
  // Analytics operations
  recordAnalytics(analytics: Omit<PlatformAnalytics, 'id' | 'createdAt'>): Promise<void>;
  getAnalytics(metric: string, dateRange?: { start: Date; end: Date }): Promise<PlatformAnalytics[]>;
  
  // Enhanced admin stats
  getPlatformStats(): Promise<{
    totalBookings: number;
    totalProviders: number;
    totalPatients: number;
    dailyBookings: number;
    weeklyBookings: number;
    monthlyBookings: number;
    activeProviders: number;
    pendingProviders: number;
    totalUsers: number;
    totalRevenue: number;
    avgRating: number;
    bookingsByStatus: any[];
    bookingsOverTime: any[];
    topRatedServices: any[];
    pendingCredentials: number;
    totalTransactions: number;
    platformCommission: number;
    providers: {
      total: number;
      approved: number;
      pending: number;
    };
    patients: {
      total: number;
    };
    bookings: {
      total: number;
      daily: number;
      weekly: number;
      monthly: number;
      revenue: number;
    };
  }>;
  
  // Communication oversight
  getAllConversations(): Promise<any[]>;
  flagConversation(conversationId: string, reason: string, flaggedBy: string): Promise<void>;
  
  // Advanced user management
  suspendUser(userId: string, reason: string, suspendedBy: string): Promise<void>;
  reactivateUser(userId: string, reactivatedBy: string): Promise<void>;
  deleteUser(userId: string, deletedBy: string): Promise<void>;

  // Consent record operations (HIPAA/HIA compliance)
  createConsentRecord(record: InsertConsentRecord): Promise<ConsentRecord>;
  getConsentRecords(userId: string): Promise<ConsentRecord[]>;
  hasRequiredConsents(userId: string): Promise<boolean>;
  markOnboardingComplete(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .limit(1);
    return user ?? null;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First try the normal ID-based upsert
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (err: any) {
      // Unique constraint on email — a user with this email exists under
      // a different Auth0 ID. Return the existing record rather than crashing.
      const userEmail =
        typeof userData.email === "string" ? userData.email.trim() : "";
      if (isUniqueEmailViolation(err) && userEmail) {
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, userEmail))
          .limit(1);
        if (existing) return existing;
      }
      throw err;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscription(
    userId: string,
    data: {
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      subscriptionStatus?: string | null;
      subscriptionCurrentPeriodEnd?: Date | null;
    },
  ): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  // User address operations
  async createUserAddress(address: InsertUserAddress): Promise<UserAddress> {
    const [newAddress] = await db
      .insert(userAddresses)
      .values(address)
      .returning();
    return newAddress;
  }

  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    return db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, userId))
      .orderBy(desc(userAddresses.isDefault));
  }

  async updateUserAddress(id: number, userId: string, updates: Partial<UserAddress>): Promise<UserAddress | undefined> {
    const [address] = await db
      .update(userAddresses)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
      .returning();
    return address;
  }

  async deleteUserAddress(id: number, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(userAddresses)
      .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
      .returning({ id: userAddresses.id });
    return Boolean(deleted);
  }

  async setDefaultAddress(userId: string, addressId: number): Promise<boolean> {
    return db.transaction(async (tx) => {
      const [exists] = await tx
        .select({ id: userAddresses.id })
        .from(userAddresses)
        .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)));

      if (!exists) {
        return false;
      }

      // Unset all default addresses for user
      await tx
        .update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, userId));

      const [updated] = await tx
        .update(userAddresses)
        .set({ isDefault: true, updatedAt: new Date() })
        .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)))
        .returning({ id: userAddresses.id });

      return Boolean(updated);
    });
  }

  // Emergency contact operations
  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [newContact] = await db
      .insert(emergencyContacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId))
      .orderBy(desc(emergencyContacts.isPrimary));
  }

  async updateEmergencyContact(id: number, userId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact | undefined> {
    const [contact] = await db
      .update(emergencyContacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(emergencyContacts.id, id), eq(emergencyContacts.userId, userId)))
      .returning();
    return contact;
  }

  async deleteEmergencyContact(id: number, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(emergencyContacts)
      .where(and(eq(emergencyContacts.id, id), eq(emergencyContacts.userId, userId)))
      .returning({ id: emergencyContacts.id });
    return Boolean(deleted);
  }

  // Patient health profile operations
  async createHealthProfile(profile: InsertPatientHealthProfile): Promise<PatientHealthProfile> {
    const [newProfile] = await db
      .insert(patientHealthProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async getHealthProfile(userId: string): Promise<PatientHealthProfile | undefined> {
    const [profile] = await db
      .select()
      .from(patientHealthProfiles)
      .where(eq(patientHealthProfiles.userId, userId));
    return profile;
  }

  async updateHealthProfile(id: number, userId: string, updates: Partial<PatientHealthProfile>): Promise<PatientHealthProfile | undefined> {
    const [profile] = await db
      .update(patientHealthProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(patientHealthProfiles.id, id), eq(patientHealthProfiles.userId, userId)))
      .returning();
    return profile;
  }

  // Family member operations
  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const [newMember] = await db
      .insert(familyMembers)
      .values(member)
      .returning();
    return newMember;
  }

  async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    return db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.userId, userId))
      .orderBy(familyMembers.firstName);
  }

  async updateFamilyMember(id: number, userId: string, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const [member] = await db
      .update(familyMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, userId)))
      .returning();
    return member;
  }

  async deleteFamilyMember(id: number, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(familyMembers)
      .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, userId)))
      .returning({ id: familyMembers.id });
    return Boolean(deleted);
  }

  // Insurance operations
  async createInsuranceInfo(insurance: InsertInsuranceInfo): Promise<InsuranceInfo> {
    const [newInsurance] = await db
      .insert(insuranceInfo)
      .values(insurance)
      .returning();
    return newInsurance;
  }

  async getInsuranceInfo(userId: string): Promise<InsuranceInfo[]> {
    return db
      .select()
      .from(insuranceInfo)
      .where(eq(insuranceInfo.userId, userId))
      .orderBy(desc(insuranceInfo.isPrimary));
  }

  async updateInsuranceInfo(id: number, userId: string, updates: Partial<InsuranceInfo>): Promise<InsuranceInfo | undefined> {
    const [insurance] = await db
      .update(insuranceInfo)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(insuranceInfo.id, id), eq(insuranceInfo.userId, userId)))
      .returning();
    return insurance;
  }

  async deleteInsuranceInfo(id: number, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(insuranceInfo)
      .where(and(eq(insuranceInfo.id, id), eq(insuranceInfo.userId, userId)))
      .returning({ id: insuranceInfo.id });
    return Boolean(deleted);
  }

  // Payment method operations
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const [newMethod] = await db
      .insert(paymentMethods)
      .values(method)
      .returning();
    return newMethod;
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(desc(paymentMethods.isDefault));
  }

  async updatePaymentMethod(id: number, userId: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod | undefined> {
    const [method] = await db
      .update(paymentMethods)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
      .returning();
    return method;
  }

  async deletePaymentMethod(id: number, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(paymentMethods)
      .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
      .returning({ id: paymentMethods.id });
    return Boolean(deleted);
  }

  async setDefaultPaymentMethod(userId: string, methodId: number): Promise<boolean> {
    return db.transaction(async (tx) => {
      const [exists] = await tx
        .select({ id: paymentMethods.id })
        .from(paymentMethods)
        .where(and(eq(paymentMethods.id, methodId), eq(paymentMethods.userId, userId)));

      if (!exists) {
        return false;
      }

      // Unset all default payment methods for user
      await tx
        .update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.userId, userId));

      const [updated] = await tx
        .update(paymentMethods)
        .set({ isDefault: true, updatedAt: new Date() })
        .where(and(eq(paymentMethods.id, methodId), eq(paymentMethods.userId, userId)))
        .returning({ id: paymentMethods.id });

      return Boolean(updated);
    });
  }

  // Provider operations
  async createProvider(provider: InsertProvider): Promise<Provider> {
    const insuranceAccepted = Array.isArray(provider.insuranceAccepted)
      ? (provider.insuranceAccepted as string[])
      : [];
    const [newProvider] = await db
      .insert(providers)
      .values({ ...provider, insuranceAccepted })
      .returning();
    return newProvider;
  }

  async getProvider(id: number): Promise<Provider | undefined> {
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.id, id));
    return provider;
  }

  async getProviderByUserId(userId: string): Promise<Provider | undefined> {
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.userId, userId))
      .orderBy(desc(providers.updatedAt), desc(providers.createdAt), desc(providers.id))
      .limit(1);
    return provider;
  }

  async updateProvider(id: number, updates: Partial<typeof providers.$inferInsert>): Promise<any> {
    const [updated] = await db
      .update(providers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(providers.id, id))
      .returning();
    return updated;
  }

  async updateProviderConnect(
    providerId: number,
    data: { stripeAccountId?: string | null; connectOnboardingComplete?: boolean },
  ): Promise<void> {
    await db
      .update(providers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(providers.id, providerId));
  }

  async getMarketplaceProviders(): Promise<any[]> {
    const results = await db
      .select({
        id: providers.id,
        userId: providers.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        specialization: providers.specialization,
        yearsExperience: providers.yearsExperience,
        bio: providers.bio,
        serviceAreas: providers.serviceAreas,
        basePricing: providers.basePricing,
        isVerified: providers.isVerified,
        isApproved: providers.isApproved,
        rating: liveProviderRating,
        reviewCount: liveProviderReviewCount,
        patientCount: liveProviderPatientCount,
        availability: providers.availability,
        createdAt: providers.createdAt,
      })
      .from(providers)
      .innerJoin(users, eq(providers.userId, users.id))
      .where(and(...getMarketplaceProviderConditions()))
      .orderBy(desc(providers.updatedAt), desc(providers.createdAt), desc(providers.id));

    const uniqueProviders = sortMarketplaceProviders(
      dedupeProvidersByUserId(results),
    );

    return attachServicesToProviders(uniqueProviders);
  }

  async getMarketplaceProviderById(id: number): Promise<any | undefined> {
    const [provider] = await db
      .select({
        id: providers.id,
        userId: providers.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        specialization: providers.specialization,
        yearsExperience: providers.yearsExperience,
        bio: providers.bio,
        serviceAreas: providers.serviceAreas,
        basePricing: providers.basePricing,
        isVerified: providers.isVerified,
        isApproved: providers.isApproved,
        rating: liveProviderRating,
        reviewCount: liveProviderReviewCount,
        patientCount: liveProviderPatientCount,
        availability: providers.availability,
        createdAt: providers.createdAt,
      })
      .from(providers)
      .innerJoin(users, eq(providers.userId, users.id))
      .where(
        and(
          eq(providers.id, id),
          ...getMarketplaceProviderConditions(),
        ),
      );

    if (!provider) {
      return undefined;
    }

    const providerServices = await db
      .select()
      .from(services)
      .where(eq(services.providerId, id));

    return {
      ...provider,
      services: providerServices,
    };
  }

  async updateProviderApproval(id: number, isApproved: boolean): Promise<void> {
    await db.transaction(async (tx) => {
      const [provider] = await tx
        .update(providers)
        .set({ isApproved, updatedAt: new Date() })
        .where(eq(providers.id, id))
        .returning({ userId: providers.userId });

      if (!provider) {
        return;
      }

      await tx
        .update(users)
        .set({
          userType: isApproved ? "provider" : "patient",
          updatedAt: new Date(),
        })
        .where(eq(users.id, provider.userId));
    });
  }

  async searchProviders(filters: {
    q?: string;
    serviceType?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
    sortBy?: string;
  }): Promise<any[]> {
    const conditions = getMarketplaceProviderConditions();

    if (filters.serviceType) {
      const rawServiceType = filters.serviceType.trim();
      const normalizedServiceType = rawServiceType.replace(/[-_]+/g, " ");
      const serviceTypeCondition = or(
        ilike(providers.specialization, `%${rawServiceType}%`),
        ilike(providers.specialization, `%${normalizedServiceType}%`),
        exists(
          db
            .select({ one: sql`1` })
            .from(services)
            .where(
              and(
                eq(services.providerId, providers.id),
                or(
                  ilike(services.name, `%${rawServiceType}%`),
                  ilike(services.name, `%${normalizedServiceType}%`),
                  ilike(services.category, `%${rawServiceType}%`),
                  ilike(services.category, `%${normalizedServiceType}%`),
                ),
              ),
            ),
        ),
      );
      if (serviceTypeCondition) {
        conditions.push(serviceTypeCondition);
      }
    }

    if (filters.q) {
      const qCondition = or(
        ilike(users.firstName, `%${filters.q}%`),
        ilike(users.lastName, `%${filters.q}%`),
        ilike(providers.bio, `%${filters.q}%`),
        ilike(providers.specialization, `%${filters.q}%`),
      );
      if (qCondition) {
        conditions.push(qCondition);
      }
    }

    if (filters.location) {
      // serviceAreas is a jsonb array — cast to text for a simple substring search
      conditions.push(
        sql`${providers.serviceAreas}::text ILIKE ${"%" + filters.location + "%"}`,
      );
    }

    if (filters.rating) {
      conditions.push(
        sql`
          COALESCE(
            (
              SELECT AVG(${reviews.rating})::numeric
              FROM ${reviews}
              WHERE ${reviews.providerId} = ${providers.id}
            ),
            0
          ) >= ${filters.rating}
        `,
      );
    }

    if (filters.priceRange) {
      conditions.push(
        gte(providers.basePricing, filters.priceRange[0].toString()),
        lte(providers.basePricing, filters.priceRange[1].toString()),
      );
    }

    const orderClause =
      filters.sortBy === "rating"
        ? [desc(liveProviderRating), desc(providers.updatedAt)]
        : filters.sortBy === "price_asc"
          ? [asc(providers.basePricing), desc(providers.updatedAt)]
          : filters.sortBy === "price_desc"
            ? [desc(providers.basePricing), desc(providers.updatedAt)]
            : [desc(providers.updatedAt), desc(providers.createdAt), desc(providers.id)];

    const results = await db
      .select({
        id: providers.id,
        userId: providers.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        specialization: providers.specialization,
        licenseNumber: providers.licenseNumber,
        yearsExperience: providers.yearsExperience,
        bio: providers.bio,
        serviceAreas: providers.serviceAreas,
        basePricing: providers.basePricing,
        isVerified: providers.isVerified,
        isApproved: providers.isApproved,
        rating: liveProviderRating,
        reviewCount: liveProviderReviewCount,
        patientCount: liveProviderPatientCount,
        availability: providers.availability,
        createdAt: providers.createdAt,
        updatedAt: providers.updatedAt,
      })
      .from(providers)
      .innerJoin(users, eq(providers.userId, users.id))
      .where(and(...conditions))
      .orderBy(...orderClause);

    const providersWithServices = await attachServicesToProviders(
      dedupeProvidersByUserId(results),
    );

    // Append nextAvailableDate to each result (parallel lookups)
    return Promise.all(
      providersWithServices.map(async (p) => ({
        ...p,
        nextAvailableDate: await this.getNextAvailableSlot(p.id),
      })),
    );
  }

  async getProviderEarnings(providerId: number) {
    const rows = await db
      .select({
        id: transactions.id,
        date: bookings.scheduledDate,
        patientId: bookings.patientId,
        totalAmount: transactions.amount,
        platformFee: transactions.platformFee,
        providerPayout: transactions.providerPayout,
        status: sql<string>`COALESCE(${transactions.status}, 'pending')`,
      })
      .from(transactions)
      .innerJoin(bookings, eq(transactions.bookingId, bookings.id))
      .where(
        and(
          eq(transactions.providerId, providerId),
          eq(transactions.type, "commission"),
        ),
      )
      .orderBy(desc(bookings.scheduledDate));

    const totalEarned = rows.reduce(
      (sum, row) => sum + parseFloat(String(row.providerPayout ?? "0")),
      0,
    );
    const pendingTransfers = rows
      .filter((row) => row.status === "pending")
      .reduce(
        (sum, row) => sum + parseFloat(String(row.providerPayout ?? "0")),
        0,
      );

    return { totalEarned, pendingTransfers, bookings: rows };
  }

  async getNextAvailableSlot(providerId: number): Promise<Date | null> {
    const now = new Date();
    const horizon = new Date(now);
    horizon.setDate(horizon.getDate() + 30);

    // Get availability schedule (days provider is available)
    const availability = await db
      .select()
      .from(providerAvailability)
      .where(and(eq(providerAvailability.providerId, providerId), eq(providerAvailability.isAvailable, true)));

    if (availability.length === 0) return null;

    const availableDays = new Set(availability.map((a) => a.dayOfWeek));

    // Get blackout periods in next 30 days
    const blackouts = await db
      .select()
      .from(providerBlackouts)
      .where(
        and(
          eq(providerBlackouts.providerId, providerId),
          lte(providerBlackouts.startDate, horizon),
          gte(providerBlackouts.endDate, now),
        ),
      );

    // Get confirmed bookings in next 30 days
    const confirmedBookings = await db
      .select({ scheduledDate: bookings.scheduledDate })
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, providerId),
          gte(bookings.scheduledDate, now),
          lte(bookings.scheduledDate, horizon),
          sql`${bookings.status} IN ('pending', 'confirmed')`,
        ),
      );

    const bookedDates = new Set(
      confirmedBookings.map((b) => new Date(b.scheduledDate).toDateString()),
    );

    // Walk day-by-day and find first available slot
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + 1);
    candidate.setHours(9, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const dayOfWeek = candidate.getDay();

      if (availableDays.has(dayOfWeek)) {
        const inBlackout = blackouts.some(
          (b) => candidate >= new Date(b.startDate) && candidate <= new Date(b.endDate),
        );

        if (!inBlackout && !bookedDates.has(candidate.toDateString())) {
          return new Date(candidate);
        }
      }

      candidate.setDate(candidate.getDate() + 1);
    }

    return null;
  }

  // Service operations
  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  async getServicesByProvider(providerId: number): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.providerId, providerId));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  async updateService(id: number, updates: Partial<Service>): Promise<Service> {
    const [service] = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Provider availability operations
  async createProviderAvailability(availability: InsertProviderAvailability): Promise<ProviderAvailability> {
    const [newAvailability] = await db
      .insert(providerAvailability)
      .values(availability)
      .returning();
    return newAvailability;
  }

  async getProviderAvailability(providerId: number): Promise<ProviderAvailability[]> {
    const tableRows = await db
      .select()
      .from(providerAvailability)
      .where(eq(providerAvailability.providerId, providerId))
      .orderBy(providerAvailability.dayOfWeek, providerAvailability.startTime);

    if (tableRows.length > 0) {
      return tableRows;
    }

    const provider = await db
      .select({ availability: providers.availability })
      .from(providers)
      .where(eq(providers.id, providerId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!provider?.availability || typeof provider.availability !== "object" || Array.isArray(provider.availability)) {
      return [1, 2, 3, 4, 5].map((day) => ({
        id: 0,
        providerId,
        dayOfWeek: day,
        startTime: "08:00",
        endTime: "18:00",
        isAvailable: true,
        createdAt: new Date(),
      } as ProviderAvailability));
    }

    const dayNameToIndex: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const now = new Date();
    const syntheticRows: ProviderAvailability[] = [];

    for (const [dayName, times] of Object.entries(provider.availability as Record<string, string[]>)) {
      const dayOfWeek = dayNameToIndex[dayName.toLowerCase()];
      if (dayOfWeek === undefined || !Array.isArray(times) || times.length < 2) {
        continue;
      }

      syntheticRows.push({
        id: -(dayOfWeek + 1),
        providerId,
        dayOfWeek,
        startTime: times[0],
        endTime: times[times.length - 1],
        isAvailable: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    return syntheticRows.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }

      return a.startTime.localeCompare(b.startTime);
    });
  }

  async updateProviderAvailability(id: number, updates: Partial<ProviderAvailability>): Promise<ProviderAvailability> {
    const [availability] = await db
      .update(providerAvailability)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(providerAvailability.id, id))
      .returning();
    return availability;
  }

  async deleteProviderAvailability(id: number): Promise<void> {
    await db.delete(providerAvailability).where(eq(providerAvailability.id, id));
  }

  // Provider blackout operations
  async createProviderBlackout(blackout: InsertProviderBlackout): Promise<ProviderBlackout> {
    const [newBlackout] = await db
      .insert(providerBlackouts)
      .values(blackout)
      .returning();
    return newBlackout;
  }

  async getProviderBlackouts(providerId: number): Promise<ProviderBlackout[]> {
    return db
      .select()
      .from(providerBlackouts)
      .where(eq(providerBlackouts.providerId, providerId))
      .orderBy(desc(providerBlackouts.startDate));
  }

  async deleteProviderBlackout(id: number): Promise<void> {
    await db.delete(providerBlackouts).where(eq(providerBlackouts.id, id));
  }

  // Provider patient notes operations
  async createProviderPatientNotes(notes: InsertProviderPatientNotes): Promise<ProviderPatientNotes> {
    const [newNotes] = await db
      .insert(providerPatientNotes)
      .values(notes)
      .returning();
    return newNotes;
  }

  async getProviderPatientNotes(providerId: number, patientId: string): Promise<ProviderPatientNotes[]> {
    return db
      .select()
      .from(providerPatientNotes)
      .where(and(
        eq(providerPatientNotes.providerId, providerId),
        eq(providerPatientNotes.patientId, patientId)
      ))
      .orderBy(desc(providerPatientNotes.createdAt));
  }

  async updateProviderPatientNotes(id: number, updates: Partial<ProviderPatientNotes>): Promise<ProviderPatientNotes> {
    const [notes] = await db
      .update(providerPatientNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(providerPatientNotes.id, id))
      .returning();
    return notes;
  }

  async deleteProviderPatientNotes(id: number): Promise<void> {
    await db.delete(providerPatientNotes).where(eq(providerPatientNotes.id, id));
  }

  // Booking operations
  async createBooking(
    booking: InsertBooking & Pick<Booking, "status" | "paymentStatus" | "totalAmount">,
  ): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByPatient(patientId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.patientId, patientId))
      .orderBy(desc(bookings.scheduledDate));
  }

  async getBookingsByProvider(providerId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.providerId, providerId))
      .orderBy(desc(bookings.scheduledDate));
  }

  async getBookingsByProviderAndDate(
    providerId: number,
    date: Date,
  ): Promise<Booking[]> {
    const windowStart = new Date(date.getTime() - 59 * 60 * 1000);
    const windowEnd = new Date(date.getTime() + 59 * 60 * 1000);

    return await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, providerId),
          gte(bookings.scheduledDate, windowStart),
          lte(bookings.scheduledDate, windowEnd),
          sql`${bookings.status} <> 'cancelled'`,
        ),
      )
      .orderBy(desc(bookings.scheduledDate));
  }

  async updateBookingStatus(id: number, status: string): Promise<void> {
    await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id));
  }

  async updateBookingPayment(id: number, paymentIntentId: string, paymentStatus: string): Promise<void> {
    await db
      .update(bookings)
      .set({ 
        paymentIntentId, 
        paymentStatus,
        updatedAt: new Date() 
      })
      .where(eq(bookings.id, id));
  }

  async getBookingWithDetails(id: number): Promise<any> {
    const [booking] = await db
      .select({
        id: bookings.id,
        patientId: bookings.patientId,
        providerId: bookings.providerId,
        serviceId: bookings.serviceId,
        scheduledDate: bookings.scheduledDate,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        paymentStatus: bookings.paymentStatus,
        paymentIntentId: bookings.paymentIntentId,
        notes: bookings.patientNotes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        patientName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('patientName'),
        patientEmail: users.email,
        providerName: sql<string>`(
          SELECT ${users.firstName} || ' ' || ${users.lastName}
          FROM ${users}
          WHERE ${users.id} = ${providers.userId}
        )`.as('providerName'),
        serviceName: services.name,
        serviceType: services.category,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.patientId, users.id))
      .leftJoin(providers, eq(bookings.providerId, providers.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, id));
    return booking;
  }

  async cancelBooking(id: number, cancelledBy: string, reason?: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Update booking status
      await tx
        .update(bookings)
        .set({ status: 'cancelled', updatedAt: new Date() })
        .where(eq(bookings.id, id));

      // Add status history
      await tx
        .insert(bookingStatusHistory)
        .values({
          bookingId: id,
          previousStatus: 'confirmed',
          newStatus: 'cancelled',
          changedBy: cancelledBy,
          reason: reason,
          notes: 'Booking cancelled'
        });
    });
  }

  async rescheduleBooking(id: number, newDate: Date, rescheduleBy: string, reason?: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Update booking date
      await tx
        .update(bookings)
        .set({ scheduledDate: newDate, updatedAt: new Date() })
        .where(eq(bookings.id, id));

      // Add status history
      await tx
        .insert(bookingStatusHistory)
        .values({
          bookingId: id,
          previousStatus: 'confirmed',
          newStatus: 'rescheduled',
          changedBy: rescheduleBy,
          reason: reason,
          notes: `Rescheduled to ${newDate.toISOString()}`
        });
    });
  }

  async getUpcomingBookingsNeedingReminder(window: "24h" | "1h"): Promise<Booking[]> {
    const now = new Date();

    let windowStart: Date;
    let windowEnd: Date;

    if (window === "24h") {
      windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
      windowEnd   = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    } else {
      windowStart = new Date(now.getTime() + 45 * 60 * 1000);
      windowEnd   = new Date(now.getTime() + 75 * 60 * 1000);
    }

    const sentAtCol = window === "24h" ? bookings.reminder24hSentAt : bookings.reminder1hSentAt;

    return db
      .select()
      .from(bookings)
      .where(
        and(
          sql`${bookings.status} IN ('pending', 'confirmed')`,
          gte(bookings.scheduledDate, windowStart),
          lte(bookings.scheduledDate, windowEnd),
          sql`${sentAtCol} IS NULL`,
        ),
      );
  }

  async markReminderSent(id: number, window: "24h" | "1h"): Promise<void> {
    const update =
      window === "24h"
        ? { reminder24hSentAt: new Date() }
        : { reminder1hSentAt: new Date() };

    await db.update(bookings).set(update).where(eq(bookings.id, id));
  }

  // Booking document operations
  async createBookingDocument(document: InsertBookingDocument): Promise<BookingDocument> {
    const [newDocument] = await db
      .insert(bookingDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async getBookingDocuments(bookingId: number): Promise<BookingDocument[]> {
    return db
      .select()
      .from(bookingDocuments)
      .where(eq(bookingDocuments.bookingId, bookingId))
      .orderBy(desc(bookingDocuments.createdAt));
  }

  async deleteBookingDocument(id: number): Promise<void> {
    await db.delete(bookingDocuments).where(eq(bookingDocuments.id, id));
  }

  // Booking status history operations
  async createBookingStatusHistory(history: InsertBookingStatusHistory): Promise<BookingStatusHistory> {
    const [newHistory] = await db
      .insert(bookingStatusHistory)
      .values(history)
      .returning();
    return newHistory;
  }

  async getBookingStatusHistory(bookingId: number): Promise<BookingStatusHistory[]> {
    return db
      .select()
      .from(bookingStatusHistory)
      .where(eq(bookingStatusHistory.bookingId, bookingId))
      .orderBy(desc(bookingStatusHistory.createdAt));
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async getConversationsForUser(userId: string): Promise<any[]> {
    // Get unique conversation partners with user details
    const conversations = await db
      .select({
        partnerId: sql`CASE WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId} ELSE ${messages.senderId} END`.as('partnerId'),
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        isRead: messages.isRead,
        lastMessage: messages.content,
        lastMessageTime: messages.createdAt,
      })
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    // Get unique conversations and enrich with user data
    const uniqueConversations = conversations.reduce((acc, conv) => {
      const partnerId = conv.partnerId as string;
      if (!acc[partnerId]) {
        acc[partnerId] = {
          partnerId,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          unreadCount: 0
        };
      }
      if (conv.receiverId === userId && conv.senderId === partnerId && conv.isRead === false) {
        acc[partnerId].unreadCount += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    // Get partner details for each conversation
    const enrichedConversations = [];
    for (const [partnerId, convData] of Object.entries(uniqueConversations)) {
      const partnerUser = await this.getUser(partnerId);
      if (partnerUser) {
        enrichedConversations.push({
          ...convData,
          partnerName: `${partnerUser.firstName} ${partnerUser.lastName}`,
          partnerRole: partnerUser.userType === 'provider' ? 'Healthcare Provider' : 'Patient',
        });
      }
    }

    return enrichedConversations;
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  async markConversationAsRead(userId: string, partnerId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.senderId, partnerId), eq(messages.receiverId, userId)));
  }

  async getMessagesWithAttachments(userId1: string, userId2: string): Promise<any[]> {
    return await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        bookingId: messages.bookingId,
        attachments: sql`JSON_AGG(
          CASE 
            WHEN ${messageAttachments.id} IS NOT NULL 
            THEN JSON_BUILD_OBJECT(
              'id', ${messageAttachments.id},
              'fileName', ${messageAttachments.fileName},
              'fileUrl', ${messageAttachments.fileUrl},
              'fileSize', ${messageAttachments.fileSize},
              'mimeType', ${messageAttachments.mimeType}
            )
            ELSE NULL
          END
        ) FILTER (WHERE ${messageAttachments.id} IS NOT NULL)`.as('attachments')
      })
      .from(messages)
      .leftJoin(messageAttachments, eq(messages.id, messageAttachments.messageId))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .groupBy(messages.id)
      .orderBy(messages.createdAt);
  }

  // Message attachment operations
  async createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment> {
    const [newAttachment] = await db
      .insert(messageAttachments)
      .values(attachment)
      .returning();
    return newAttachment;
  }

  async getMessageAttachments(messageId: number): Promise<MessageAttachment[]> {
    return db
      .select()
      .from(messageAttachments)
      .where(eq(messageAttachments.messageId, messageId))
      .orderBy(messageAttachments.createdAt);
  }

  async deleteMessageAttachment(id: number): Promise<void> {
    await db.delete(messageAttachments).where(eq(messageAttachments.id, id));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();

    // Update provider rating
    await this.updateProviderRating(review.providerId);

    return newReview;
  }

  async getReviewsForProvider(providerId: number): Promise<any[]> {
    return db
      .select({
        id: reviews.id,
        bookingId: reviews.bookingId,
        patientId: reviews.patientId,
        patientName: sql<string>`TRIM(COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`.as(
          "patientName",
        ),
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.patientId, users.id))
      .where(eq(reviews.providerId, providerId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewByBookingId(bookingId: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookingId, bookingId));
    return review;
  }

  async createUserReport(report: InsertUserReport): Promise<UserReport> {
    const [newReport] = await db
      .insert(userReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getUserReports(filters?: { status?: string; providerId?: number }): Promise<any[]> {
    const conditions = [];
    if (filters?.status) conditions.push(eq(userReports.status, filters.status));
    if (filters?.providerId) conditions.push(eq(userReports.providerId, filters.providerId));

    return db
      .select({
        id: userReports.id,
        patientId: userReports.patientId,
        providerId: userReports.providerId,
        bookingId: userReports.bookingId,
        reason: userReports.reason,
        details: userReports.details,
        status: userReports.status,
        reviewedBy: userReports.reviewedBy,
        createdAt: userReports.createdAt,
        patientName: sql<string>`TRIM(COALESCE(${users.firstName}, '') || ' ' || COALESCE(${users.lastName}, ''))`.as("patientName"),
      })
      .from(userReports)
      .leftJoin(users, eq(userReports.patientId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(userReports.createdAt));
  }

  // Waitlist operations
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const [newEntry] = await db
      .insert(waitlistEntries)
      .values({ ...entry, expiresAt })
      .returning();
    return newEntry;
  }

  async getWaitlistByPatient(patientId: string): Promise<WaitlistEntry[]> {
    return db
      .select()
      .from(waitlistEntries)
      .where(eq(waitlistEntries.patientId, patientId))
      .orderBy(desc(waitlistEntries.createdAt));
  }

  async getWaitlistByProvider(providerId: number): Promise<WaitlistEntry[]> {
    return db
      .select()
      .from(waitlistEntries)
      .where(and(
        eq(waitlistEntries.providerId, providerId),
        eq(waitlistEntries.status, "waiting"),
      ))
      .orderBy(waitlistEntries.createdAt);
  }

  async notifyWaitlistEntries(providerId: number, _cancelledDate: Date): Promise<WaitlistEntry[]> {
    const now = new Date();
    const entries = await db
      .select()
      .from(waitlistEntries)
      .where(and(
        eq(waitlistEntries.providerId, providerId),
        eq(waitlistEntries.status, "waiting"),
        gte(waitlistEntries.expiresAt, now),
      ))
      .orderBy(waitlistEntries.createdAt)
      .limit(10);

    if (entries.length === 0) return [];

    const ids = entries.map((e) => e.id);
    await db
      .update(waitlistEntries)
      .set({ status: "notified", notifiedAt: now })
      .where(sql`${waitlistEntries.id} = ANY(${sql.raw(`ARRAY[${ids.join(",")}]::integer[]`)})` );

    return entries;
  }

  async deleteWaitlistEntry(id: number, patientId: string): Promise<boolean> {
    const result = await db
      .delete(waitlistEntries)
      .where(and(eq(waitlistEntries.id, id), eq(waitlistEntries.patientId, patientId)))
      .returning();
    return result.length > 0;
  }

  private async updateProviderRating(providerId: number): Promise<void> {
    const [result] = await db
      .select({
        avgRating: sql`AVG(${reviews.rating})`,
        count: sql`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.providerId, providerId));

    if (result) {
      await db
        .update(providers)
        .set({
          rating: result.avgRating?.toString() || "0",
          reviewCount: Number(result.count) || 0,
        })
        .where(eq(providers.id, providerId));
    }
  }

  // Admin operations
  async getPendingProviders(): Promise<any[]> {
    return await db
      .select({
        id: providers.id,
        userId: providers.userId,
        specialization: providers.specialization,
        licenseNumber: providers.licenseNumber,
        yearsExperience: providers.yearsExperience,
        bio: providers.bio,
        serviceAreas: providers.serviceAreas,
        isApproved: providers.isApproved,
        isVerified: providers.isVerified,
        createdAt: providers.createdAt,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(providers)
      .innerJoin(users, eq(providers.userId, users.id))
      .where(eq(providers.isApproved, false))
      .orderBy(desc(providers.createdAt));
  }

  async getAllProviders(): Promise<any[]> {
    return await db
      .select({
        id: providers.id,
        userId: providers.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        specialization: providers.specialization,
        licenseNumber: providers.licenseNumber,
        yearsExperience: providers.yearsExperience,
        isVerified: providers.isVerified,
        isApproved: providers.isApproved,
        rating: providers.rating,
        reviewCount: providers.reviewCount,
        serviceAreas: providers.serviceAreas,
        createdAt: providers.createdAt,
      })
      .from(providers)
      .innerJoin(users, eq(providers.userId, users.id))
      .orderBy(desc(providers.createdAt));
  }

  async getAllBookings(): Promise<any[]> {
    return await db
      .select({
        id: bookings.id,
        patientName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        patientEmail: users.email,
        providerName: sql`p_users.first_name || ' ' || p_users.last_name`,
        serviceName: services.name,
        serviceCategory: services.category,
        scheduledDate: bookings.scheduledDate,
        duration: bookings.duration,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        paymentStatus: bookings.paymentStatus,
        patientAddress: bookings.patientAddress,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.patientId, users.id))
      .innerJoin(providers, eq(bookings.providerId, providers.id))
      .innerJoin(sql`users as p_users`, sql`providers.user_id = p_users.id`)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .orderBy(desc(bookings.createdAt));
  }

  async getAllReviews(): Promise<any[]> {
    return await db
      .select({
        id: reviews.id,
        patientName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        providerName: sql`p_users.first_name || ' ' || p_users.last_name`,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        bookingId: reviews.bookingId,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.patientId, users.id))
      .innerJoin(providers, eq(reviews.providerId, providers.id))
      .innerJoin(sql`users as p_users`, sql`providers.user_id = p_users.id`)
      .orderBy(desc(reviews.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateProviderStatus(id: number, isApproved: boolean, isVerified: boolean = false): Promise<void> {
    await db.transaction(async (tx) => {
      const [provider] = await tx
        .update(providers)
        .set({ isApproved, isVerified, updatedAt: new Date() })
        .where(eq(providers.id, id))
        .returning({ userId: providers.userId });

      if (!provider) {
        return;
      }

      await tx
        .update(users)
        .set({
          userType: isApproved ? "provider" : "patient",
          updatedAt: new Date(),
        })
        .where(eq(users.id, provider.userId));
    });
  }

  async getPlatformStats(): Promise<any> {
    // Get basic counts
    const [providerStats] = await db
      .select({
        total: sql`COUNT(*)`,
        approved: sql`COUNT(*) FILTER (WHERE ${providers.isApproved} = true)`,
        pending: sql`COUNT(*) FILTER (WHERE ${providers.isApproved} = false)`,
      })
      .from(providers);

    const [userStats] = await db
      .select({
        total: sql`COUNT(*)`,
        patients: sql`COUNT(*) FILTER (WHERE ${users.userType} = 'patient')`,
      })
      .from(users);

    const [bookingStats] = await db
      .select({
        total: sql`COUNT(*)`,
        daily: sql`COUNT(*) FILTER (WHERE DATE(${bookings.createdAt}) = CURRENT_DATE)`,
        weekly: sql`COUNT(*) FILTER (WHERE ${bookings.createdAt} >= CURRENT_DATE - INTERVAL '7 days')`,
        monthly: sql`COUNT(*) FILTER (WHERE ${bookings.createdAt} >= CURRENT_DATE - INTERVAL '30 days')`,
        revenue: sql`SUM(${bookings.totalAmount}) FILTER (WHERE ${bookings.paymentStatus} = 'paid')`,
      })
      .from(bookings);

    // Get booking status breakdown
    const bookingsByStatus = await db
      .select({
        status: bookings.status,
        count: sql`COUNT(*)`,
      })
      .from(bookings)
      .groupBy(bookings.status);

    // Get bookings over time (last 30 days)
    const bookingsOverTime = await db
      .select({
        date: sql`DATE(${bookings.createdAt})`,
        count: sql`COUNT(*)`,
      })
      .from(bookings)
      .where(gte(bookings.createdAt, sql`CURRENT_DATE - INTERVAL '30 days'`))
      .groupBy(sql`DATE(${bookings.createdAt})`)
      .orderBy(sql`DATE(${bookings.createdAt})`);

    // Get top rated services
    const topRatedServices = await db
      .select({
        serviceName: services.name,
        category: services.category,
        avgRating: sql`AVG(${reviews.rating})`,
        reviewCount: sql`COUNT(${reviews.id})`,
      })
      .from(services)
      .leftJoin(bookings, eq(services.id, bookings.serviceId))
      .leftJoin(reviews, eq(bookings.id, reviews.bookingId))
      .groupBy(services.id, services.name, services.category)
      .having(sql`COUNT(${reviews.id}) > 0`)
      .orderBy(sql`AVG(${reviews.rating}) DESC`)
      .limit(10);

    // Calculate average rating across platform
    const [ratingStats] = await db
      .select({
        avgRating: sql`AVG(${reviews.rating})`,
      })
      .from(reviews);

    return {
      totalBookings: Number(bookingStats?.total || 0),
      totalProviders: Number(providerStats?.approved || 0),
      totalPatients: Number(userStats?.patients || 0),
      dailyBookings: Number(bookingStats?.daily || 0),
      weeklyBookings: Number(bookingStats?.weekly || 0),
      monthlyBookings: Number(bookingStats?.monthly || 0),
      activeProviders: Number(providerStats?.approved || 0),
      pendingProviders: Number(providerStats?.pending || 0),
      totalUsers: Number(userStats?.total || 0),
      totalRevenue: Number(bookingStats?.revenue || 0),
      avgRating: Number(ratingStats?.avgRating || 0),
      bookingsByStatus: bookingsByStatus || [],
      bookingsOverTime: bookingsOverTime || [],
      topRatedServices: topRatedServices || [],
      pendingCredentials: 0,
      totalTransactions: 0,
      platformCommission: 0,
      providers: {
        total: Number(providerStats?.total || 0),
        approved: Number(providerStats?.approved || 0),
        pending: Number(providerStats?.pending || 0),
      },
      patients: {
        total: Number(userStats?.patients || 0),
      },
      bookings: {
        total: Number(bookingStats?.total || 0),
        daily: Number(bookingStats?.daily || 0),
        weekly: Number(bookingStats?.weekly || 0),
        monthly: Number(bookingStats?.monthly || 0),
        revenue: Number(bookingStats?.revenue || 0),
      },
    };
  }

  // Provider credential operations
  async createProviderCredential(credential: InsertProviderCredential): Promise<ProviderCredential> {
    const [newCredential] = await db
      .insert(providerCredentials)
      .values(credential)
      .returning();
    return newCredential;
  }

  async getProviderCredentials(providerId: number): Promise<ProviderCredential[]> {
    return await db
      .select()
      .from(providerCredentials)
      .where(eq(providerCredentials.providerId, providerId))
      .orderBy(desc(providerCredentials.createdAt));
  }

  async getCredentialsByProvider(userId: string): Promise<ProviderCredential[]> {
    return await db
      .select({ providerCredentials })
      .from(providerCredentials)
      .innerJoin(providers, eq(providerCredentials.providerId, providers.id))
      .where(eq(providers.userId, userId))
      .orderBy(desc(providerCredentials.createdAt))
      .then((rows) => rows.map((row) => row.providerCredentials));
  }

  async updateCredentialVerification(id: number, status: string, reviewedBy: string, reviewNotes?: string): Promise<void> {
    await db
      .update(providerCredentials)
      .set({
        verificationStatus: status,
        reviewedBy,
        reviewNotes,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(providerCredentials.id, id));
  }

  async getAllPendingCredentials(): Promise<any[]> {
    return await db
      .select({
        id: providerCredentials.id,
        providerId: providerCredentials.providerId,
        providerName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        credentialType: providerCredentials.credentialType,
        documentUrl: providerCredentials.documentUrl,
        documentName: providerCredentials.documentName,
        verificationStatus: providerCredentials.verificationStatus,
        expiryDate: providerCredentials.expiryDate,
        submittedAt: providerCredentials.submittedAt,
      })
      .from(providerCredentials)
      .innerJoin(providers, eq(providerCredentials.providerId, providers.id))
      .innerJoin(users, eq(providers.userId, users.id))
      .where(eq(providerCredentials.verificationStatus, 'pending'))
      .orderBy(desc(providerCredentials.submittedAt));
  }

  // Audit log operations
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db
      .insert(auditLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getAuditLogs(limit: number = 100): Promise<any[]> {
    return await db
      .select({
        id: auditLogs.id,
        adminName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        action: auditLogs.action,
        targetType: auditLogs.targetType,
        targetId: auditLogs.targetId,
        reason: auditLogs.reason,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .innerJoin(users, eq(auditLogs.adminId, users.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getTransactions(filters?: { status?: string; type?: string; providerId?: number }): Promise<any[]> {
    const baseQuery = db
      .select({
        id: transactions.id,
        bookingId: transactions.bookingId,
        providerId: transactions.providerId,
        providerName: sql`${users.firstName} || ' ' || ${users.lastName}`,
        type: transactions.type,
        amount: transactions.amount,
        platformFee: transactions.platformFee,
        providerPayout: transactions.providerPayout,
        status: transactions.status,
        stripeTransactionId: transactions.stripeTransactionId,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .leftJoin(providers, eq(transactions.providerId, providers.id))
      .leftJoin(users, eq(providers.userId, users.id));

    const whereConditions: any[] = [];
    if (filters?.status) {
      whereConditions.push(eq(transactions.status, filters.status));
    }
    if (filters?.type) {
      whereConditions.push(eq(transactions.type, filters.type));
    }
    if (filters?.providerId) {
      whereConditions.push(eq(transactions.providerId, filters.providerId));
    }

    if (whereConditions.length > 0) {
      return await baseQuery
        .where(and(...whereConditions))
        .orderBy(desc(transactions.createdAt));
    }

    return await baseQuery.orderBy(desc(transactions.createdAt));
  }

  async getAdminCommissions(): Promise<any[]> {
    return db
      .select({
        txId: transactions.id,
        date: transactions.createdAt,
        providerName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
        amount: transactions.amount,
        platformFee: transactions.platformFee,
        providerPayout: transactions.providerPayout,
        transferId: transactions.stripeTransactionId,
        status: transactions.status,
      })
      .from(transactions)
      .innerJoin(providers, eq(transactions.providerId, providers.id))
      .innerJoin(users, eq(providers.userId, users.id))
      .where(eq(transactions.type, "commission"))
      .orderBy(desc(transactions.createdAt));
  }

  async updateTransactionStatus(id: number, status: string): Promise<void> {
    await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id));
  }

  // System settings operations
  async getSystemSettings(): Promise<SystemSetting[]> {
    return await db
      .select()
      .from(systemSettings)
      .orderBy(systemSettings.category, systemSettings.key);
  }

  async updateSystemSetting(key: string, value: string, updatedBy: string): Promise<void> {
    await db
      .insert(systemSettings)
      .values({ key, value, updatedBy, category: 'platform' })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value, updatedBy, updatedAt: new Date() },
      });
  }

  // User activity operations
  async logUserActivity(activity: InsertUserActivityLog): Promise<UserActivityLog> {
    const [newActivity] = await db
      .insert(userActivityLogs)
      .values(activity)
      .returning();
    return newActivity;
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<UserActivityLog[]> {
    return await db
      .select()
      .from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId))
      .orderBy(desc(userActivityLogs.createdAt))
      .limit(limit);
  }

  // Analytics operations
  async recordAnalytics(analytics: Omit<PlatformAnalytics, 'id' | 'createdAt'>): Promise<void> {
    await db
      .insert(platformAnalytics)
      .values(analytics);
  }

  async getAnalytics(metric: string, dateRange?: { start: Date; end: Date }): Promise<PlatformAnalytics[]> {
    const baseQuery = db
      .select()
      .from(platformAnalytics);

    let whereConditions = [eq(platformAnalytics.metric, metric)];
    
    if (dateRange) {
      whereConditions.push(
        gte(platformAnalytics.date, dateRange.start),
        lte(platformAnalytics.date, dateRange.end)
      );
    }

    const query = baseQuery.where(and(...whereConditions));
    return await query.orderBy(platformAnalytics.date);
  }

  // Communication oversight
  async getAllConversations(): Promise<any[]> {
    return await db
      .select({
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        senderName: sql`s_users.first_name || ' ' || s_users.last_name`,
        receiverName: sql`r_users.first_name || ' ' || r_users.last_name`,
        lastMessage: messages.content,
        lastMessageAt: messages.createdAt,
        messageCount: sql`COUNT(${messages.id})`,
      })
      .from(messages)
      .innerJoin(sql`users as s_users`, sql`messages.sender_id = s_users.id`)
      .innerJoin(sql`users as r_users`, sql`messages.receiver_id = r_users.id`)
      .groupBy(
        messages.senderId,
        messages.receiverId,
        sql`s_users.first_name`,
        sql`s_users.last_name`,
        sql`r_users.first_name`,
        sql`r_users.last_name`,
        messages.content,
        messages.createdAt
      )
      .orderBy(desc(messages.createdAt));
  }

  async flagConversation(conversationId: string, reason: string, flaggedBy: string): Promise<void> {
    // This would typically create a flag record in a separate table
    // For now, we'll log it as an audit entry
    await this.createAuditLog({
      adminId: flaggedBy,
      action: 'flag_conversation',
      targetType: 'conversation',
      targetId: conversationId,
      reason,
      ipAddress: '',
      userAgent: '',
    });
  }

  // Advanced user management
  async suspendUser(userId: string, reason: string, suspendedBy: string): Promise<void> {
    await db
      .update(users)
      .set({ userType: 'suspended' })
      .where(eq(users.id, userId));

    await this.createAuditLog({
      adminId: suspendedBy,
      action: 'suspend_user',
      targetType: 'user',
      targetId: userId,
      reason,
      ipAddress: '',
      userAgent: '',
    });
  }

  async reactivateUser(userId: string, reactivatedBy: string): Promise<void> {
    await db
      .update(users)
      .set({ userType: 'patient' })
      .where(eq(users.id, userId));

    await this.createAuditLog({
      adminId: reactivatedBy,
      action: 'reactivate_user',
      targetType: 'user',
      targetId: userId,
      ipAddress: '',
      userAgent: '',
    });
  }

  async deleteUser(userId: string, deletedBy: string): Promise<void> {
    // In a production system, this might be a soft delete
    await this.createAuditLog({
      adminId: deletedBy,
      action: 'delete_user',
      targetType: 'user',
      targetId: userId,
      ipAddress: '',
      userAgent: '',
    });

    // For now, just mark as deleted rather than actual deletion
    await db
      .update(users)
      .set({ userType: 'deleted' })
      .where(eq(users.id, userId));
  }

  // Consent record operations (HIPAA/HIA compliance)
  async createConsentRecord(record: InsertConsentRecord): Promise<ConsentRecord> {
    const [newRecord] = await db
      .insert(consentRecords)
      .values(record)
      .returning();
    return newRecord;
  }

  async getConsentRecords(userId: string): Promise<ConsentRecord[]> {
    return db
      .select()
      .from(consentRecords)
      .where(eq(consentRecords.userId, userId))
      .orderBy(desc(consentRecords.createdAt));
  }

  async hasRequiredConsents(userId: string): Promise<boolean> {
    const records = await db
      .select()
      .from(consentRecords)
      .where(
        and(
          eq(consentRecords.userId, userId),
          eq(consentRecords.isGranted, true)
        )
      );
    const types = new Set(records.map(r => r.consentType));
    return types.has('hipaa_npp') && types.has('terms');
  }

  async markOnboardingComplete(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ onboardingCompleted: true, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
