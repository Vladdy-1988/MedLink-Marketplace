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
  updateBookingPayment(id: number, paymentIntentId: string, paymentStatus: string): Promise<void>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getConversationsForUser(userId: string): Promise<any[]>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForProvider(providerId: number): Promise<Review[]>;

  // Admin operations
  getPendingProviders(): Promise<Provider[]>;
  getAllProviders(): Promise<any[]>;
  getAllBookings(): Promise<any[]>;
  getAllReviews(): Promise<any[]>;
  getAllUsers(): Promise<User[]>;
  updateProviderStatus(id: number, isApproved: boolean, isVerified?: boolean): Promise<void>;
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
  }>;
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
    };
  }
}

export const storage = new DatabaseStorage();
