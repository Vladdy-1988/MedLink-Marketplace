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
  type InsertSystemSetting,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // User address operations
  createUserAddress(address: InsertUserAddress): Promise<UserAddress>;
  getUserAddresses(userId: string): Promise<UserAddress[]>;
  updateUserAddress(id: number, updates: Partial<UserAddress>): Promise<UserAddress>;
  deleteUserAddress(id: number): Promise<void>;
  setDefaultAddress(userId: string, addressId: number): Promise<void>;

  // Emergency contact operations
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
  updateEmergencyContact(id: number, updates: Partial<EmergencyContact>): Promise<EmergencyContact>;
  deleteEmergencyContact(id: number): Promise<void>;

  // Patient health profile operations
  createHealthProfile(profile: InsertPatientHealthProfile): Promise<PatientHealthProfile>;
  getHealthProfile(userId: string): Promise<PatientHealthProfile | undefined>;
  updateHealthProfile(id: number, updates: Partial<PatientHealthProfile>): Promise<PatientHealthProfile>;

  // Family member operations
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  getFamilyMembers(userId: string): Promise<FamilyMember[]>;
  updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember>;
  deleteFamilyMember(id: number): Promise<void>;

  // Insurance operations
  createInsuranceInfo(insurance: InsertInsuranceInfo): Promise<InsuranceInfo>;
  getInsuranceInfo(userId: string): Promise<InsuranceInfo[]>;
  updateInsuranceInfo(id: number, updates: Partial<InsuranceInfo>): Promise<InsuranceInfo>;
  deleteInsuranceInfo(id: number): Promise<void>;

  // Payment method operations
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  updatePaymentMethod(id: number, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<void>;
  setDefaultPaymentMethod(userId: string, methodId: number): Promise<void>;

  // Provider operations
  createProvider(provider: InsertProvider): Promise<Provider>;
  getProvider(id: number): Promise<Provider | undefined>;
  getProviderByUserId(userId: string): Promise<Provider | undefined>;
  updateProviderApproval(id: number, isApproved: boolean): Promise<void>;
  searchProviders(filters: {
    serviceType?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
  }): Promise<Provider[]>;

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
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByPatient(patientId: string): Promise<Booking[]>;
  getBookingsByProvider(providerId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<void>;
  updateBookingPayment(id: number, paymentIntentId: string, paymentStatus: string): Promise<void>;
  getBookingWithDetails(id: number): Promise<any>;
  cancelBooking(id: number, cancelledBy: string, reason?: string): Promise<void>;
  rescheduleBooking(id: number, newDate: Date, rescheduleBy: string, reason?: string): Promise<void>;

  // Booking document operations
  createBookingDocument(document: InsertBookingDocument): Promise<BookingDocument>;
  getBookingDocuments(bookingId: number): Promise<BookingDocument[]>;
  deleteBookingDocument(id: number): Promise<void>;

  // Booking status history operations
  createBookingStatusHistory(history: InsertBookingStatusHistory): Promise<BookingStatusHistory>;
  getBookingStatusHistory(bookingId: number): Promise<BookingStatusHistory[]>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getConversationsForUser(userId: string): Promise<any[]>;
  markMessageAsRead(messageId: number): Promise<void>;
  getMessagesWithAttachments(userId1: string, userId2: string): Promise<any[]>;

  // Message attachment operations
  createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment>;
  getMessageAttachments(messageId: number): Promise<MessageAttachment[]>;
  deleteMessageAttachment(id: number): Promise<void>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForProvider(providerId: number): Promise<Review[]>;

  // Provider credential operations
  createProviderCredential(credential: InsertProviderCredential): Promise<ProviderCredential>;
  getProviderCredentials(providerId: number): Promise<ProviderCredential[]>;
  updateCredentialVerification(id: number, status: string, reviewedBy: string, reviewNotes?: string): Promise<void>;
  getAllPendingCredentials(): Promise<any[]>;

  // Admin operations
  getPendingProviders(): Promise<Provider[]>;
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
  }>;
  
  // Communication oversight
  getAllConversations(): Promise<any[]>;
  flagConversation(conversationId: string, reason: string, flaggedBy: string): Promise<void>;
  
  // Advanced user management
  suspendUser(userId: string, reason: string, suspendedBy: string): Promise<void>;
  reactivateUser(userId: string, reactivatedBy: string): Promise<void>;
  deleteUser(userId: string, deletedBy: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
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

  async updateUserAddress(id: number, updates: Partial<UserAddress>): Promise<UserAddress> {
    const [address] = await db
      .update(userAddresses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userAddresses.id, id))
      .returning();
    return address;
  }

  async deleteUserAddress(id: number): Promise<void> {
    await db.delete(userAddresses).where(eq(userAddresses.id, id));
  }

  async setDefaultAddress(userId: string, addressId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Unset all default addresses for user
      await tx
        .update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, userId));
      
      // Set new default
      await tx
        .update(userAddresses)
        .set({ isDefault: true })
        .where(eq(userAddresses.id, addressId));
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

  async updateEmergencyContact(id: number, updates: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const [contact] = await db
      .update(emergencyContacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emergencyContacts.id, id))
      .returning();
    return contact;
  }

  async deleteEmergencyContact(id: number): Promise<void> {
    await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
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

  async updateHealthProfile(id: number, updates: Partial<PatientHealthProfile>): Promise<PatientHealthProfile> {
    const [profile] = await db
      .update(patientHealthProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(patientHealthProfiles.id, id))
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

  async updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember> {
    const [member] = await db
      .update(familyMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(familyMembers.id, id))
      .returning();
    return member;
  }

  async deleteFamilyMember(id: number): Promise<void> {
    await db.delete(familyMembers).where(eq(familyMembers.id, id));
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

  async updateInsuranceInfo(id: number, updates: Partial<InsuranceInfo>): Promise<InsuranceInfo> {
    const [insurance] = await db
      .update(insuranceInfo)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(insuranceInfo.id, id))
      .returning();
    return insurance;
  }

  async deleteInsuranceInfo(id: number): Promise<void> {
    await db.delete(insuranceInfo).where(eq(insuranceInfo.id, id));
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

  async updatePaymentMethod(id: number, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const [method] = await db
      .update(paymentMethods)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentMethods.id, id))
      .returning();
    return method;
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
  }

  async setDefaultPaymentMethod(userId: string, methodId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Unset all default payment methods for user
      await tx
        .update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.userId, userId));
      
      // Set new default
      await tx
        .update(paymentMethods)
        .set({ isDefault: true })
        .where(eq(paymentMethods.id, methodId));
    });
  }

  // Provider operations
  async createProvider(provider: InsertProvider): Promise<Provider> {
    const [newProvider] = await db
      .insert(providers)
      .values(provider)
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
      .where(eq(providers.userId, userId));
    return provider;
  }

  async updateProviderApproval(id: number, isApproved: boolean): Promise<void> {
    await db
      .update(providers)
      .set({ isApproved, updatedAt: new Date() })
      .where(eq(providers.id, id));
  }

  async searchProviders(filters: {
    serviceType?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
  }): Promise<Provider[]> {
    const conditions = [
      eq(providers.isApproved, true),
      eq(providers.isVerified, true)
    ];

    if (filters.rating) {
      conditions.push(gte(providers.rating, filters.rating.toString()));
    }

    if (filters.priceRange) {
      conditions.push(
        gte(providers.basePricing, filters.priceRange[0].toString()),
        lte(providers.basePricing, filters.priceRange[1].toString())
      );
    }

    return await db
      .select()
      .from(providers)
      .where(and(...conditions))
      .orderBy(desc(providers.rating));
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
    return db
      .select()
      .from(providerAvailability)
      .where(eq(providerAvailability.providerId, providerId))
      .orderBy(providerAvailability.dayOfWeek, providerAvailability.startTime);
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
  async createBooking(booking: InsertBooking): Promise<Booking> {
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
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        patientName: sql`CONCAT(${users.firstName}, ' ', ${users.lastName})`.as('patientName'),
        patientEmail: users.email,
        providerName: providers.fullName,
        serviceName: services.name,
        serviceType: services.type,
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

  async getReviewsForProvider(providerId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.providerId, providerId))
      .orderBy(desc(reviews.createdAt));
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
  async getPendingProviders(): Promise<Provider[]> {
    return await db
      .select()
      .from(providers)
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
    await db
      .update(providers)
      .set({ isApproved, isVerified, updatedAt: new Date() })
      .where(eq(providers.id, id));
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

    let whereConditions = [];
    if (filters?.status) {
      whereConditions.push(eq(transactions.status, filters.status));
    }
    if (filters?.type) {
      whereConditions.push(eq(transactions.type, filters.type));
    }
    if (filters?.providerId) {
      whereConditions.push(eq(transactions.providerId, filters.providerId));
    }

    let query = baseQuery;
    if (whereConditions.length > 0) {
      query = baseQuery.where(and(...whereConditions));
    }

    return await query.orderBy(desc(transactions.createdAt));
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
}

export const storage = new DatabaseStorage();
