import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
  serial
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("patient"), // patient, provider, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare providers
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  specialization: varchar("specialization").notNull(),
  licenseNumber: varchar("license_number").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  bio: text("bio"),
  serviceAreas: jsonb("service_areas"), // Array of areas they serve
  basePricing: decimal("base_pricing", { precision: 10, scale: 2 }),
  isVerified: boolean("is_verified").default(false),
  isApproved: boolean("is_approved").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  availability: jsonb("availability"), // Schedule object
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare services offered by providers
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  category: varchar("category").notNull(), // nursing, physio, dental, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Patient bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  patientAddress: text("patient_address").notNull(),
  patientNotes: text("patient_notes"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, refunded
  paymentIntentId: varchar("payment_intent_id"), // Stripe payment intent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Provider credentials and documents
export const providerCredentials = pgTable("provider_credentials", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  credentialType: varchar("credential_type").notNull(), // license, certification, insurance
  documentUrl: varchar("document_url"),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages between patients and providers
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  providersAsUser: many(providers),
  bookingsAsPatient: many(bookings),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  reviews: many(reviews),
}));

export const providersRelations = relations(providers, ({ one, many }) => ({
  user: one(users, { fields: [providers.userId], references: [users.id] }),
  services: many(services),
  bookings: many(bookings),
  credentials: many(providerCredentials),
  reviews: many(reviews),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(providers, { fields: [services.providerId], references: [providers.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  patient: one(users, { fields: [bookings.patientId], references: [users.id] }),
  provider: one(providers, { fields: [bookings.providerId], references: [providers.id] }),
  service: one(services, { fields: [bookings.serviceId], references: [services.id] }),
  messages: many(messages),
  review: one(reviews),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sentMessages" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receivedMessages" }),
  booking: one(bookings, { fields: [messages.bookingId], references: [bookings.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
  patient: one(users, { fields: [reviews.patientId], references: [users.id] }),
  provider: one(providers, { fields: [reviews.providerId], references: [providers.id] }),
}));

// Zod schemas for validation
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ProviderCredential = typeof providerCredentials.$inferSelect;
