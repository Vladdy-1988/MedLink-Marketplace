import {
  users,
  providers,
  services,
  bookings,
  messages,
  reviews,
  providerCredentials,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByPatient(patientId: string): Promise<Booking[]>;
  getBookingsByProvider(providerId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<void>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getConversationsForUser(userId: string): Promise<any[]>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForProvider(providerId: number): Promise<Review[]>;

  // Admin operations
  getPendingProviders(): Promise<Provider[]>;
  getPlatformStats(): Promise<any>;
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
    // Get unique conversation partners
    const conversations = await db
      .select({
        partnerId: sql`CASE WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId} ELSE ${messages.senderId} END`,
        lastMessage: messages.content,
        lastMessageTime: messages.createdAt,
      })
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    return conversations;
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

  async getPlatformStats(): Promise<any> {
    const [providerStats] = await db
      .select({
        total: sql`COUNT(*)`,
        approved: sql`COUNT(*) FILTER (WHERE ${providers.isApproved} = true)`,
      })
      .from(providers);

    const [patientStats] = await db
      .select({
        total: sql`COUNT(*) FILTER (WHERE ${users.userType} = 'patient')`,
      })
      .from(users);

    const [bookingStats] = await db
      .select({
        total: sql`COUNT(*)`,
        completed: sql`COUNT(*) FILTER (WHERE ${bookings.status} = 'completed')`,
        revenue: sql`SUM(${bookings.totalAmount}) FILTER (WHERE ${bookings.status} = 'completed')`,
      })
      .from(bookings);

    return {
      providers: providerStats,
      patients: patientStats,
      bookings: bookingStats,
    };
  }
}

export const storage = new DatabaseStorage();
