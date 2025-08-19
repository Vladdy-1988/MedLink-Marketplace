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
  phoneNumber: varchar("phone_number"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  notificationPreferences: jsonb("notification_preferences").default({
    email: true,
    sms: false,
    push: true,
    booking_reminders: true,
    marketing: false
  }),
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
  credentialType: varchar("credential_type").notNull(), // license, certification, insurance, education, background_check
  documentUrl: varchar("document_url"),
  documentName: varchar("document_name"),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  expiryDate: timestamp("expiry_date"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin audit logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // approve_provider, reject_document, update_user, etc.
  targetType: varchar("target_type").notNull(), // user, provider, booking, credential
  targetId: varchar("target_id").notNull(),
  previousData: jsonb("previous_data"),
  newData: jsonb("new_data"),
  reason: text("reason"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  providerId: integer("provider_id").references(() => providers.id),
  type: varchar("type").notNull(), // payment, refund, payout, commission
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).default("0"),
  providerPayout: decimal("provider_payout", { precision: 10, scale: 2 }),
  status: varchar("status").default("pending"), // pending, completed, failed
  stripeTransactionId: varchar("stripe_transaction_id"),
  processingFee: decimal("processing_fee", { precision: 10, scale: 2 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System settings
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  category: varchar("category").notNull(), // platform, payments, notifications, etc.
  description: text("description"),
  isEditable: boolean("is_editable").default(true),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User activity logs
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // login, logout, profile_update, booking_create, etc.
  resource: varchar("resource"), // booking_id, provider_id, etc.
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform analytics
export const platformAnalytics = pgTable("platform_analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  metric: varchar("metric").notNull(), // daily_signups, daily_bookings, revenue, etc.
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  category: varchar("category"), // users, bookings, financial, etc.
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User addresses
export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // home, work, billing, emergency
  streetAddress: varchar("street_address").notNull(),
  city: varchar("city").notNull(),
  province: varchar("province").notNull(),
  postalCode: varchar("postal_code").notNull(),
  country: varchar("country").notNull().default("Canada"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  relationship: varchar("relationship").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  email: varchar("email"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient health profiles
export const patientHealthProfiles = pgTable("patient_health_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  allergies: text("allergies"),
  medications: text("medications"),
  medicalHistory: text("medical_history"),
  chronicConditions: text("chronic_conditions"),
  surgicalHistory: text("surgical_history"),
  familyHistory: text("family_history"),
  bloodType: varchar("blood_type"),
  height: varchar("height"),
  weight: varchar("weight"),
  emergencyMedicalInfo: text("emergency_medical_info"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Family members (for patients to book for family)
export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id), // Parent/guardian account
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  relationship: varchar("relationship").notNull(), // spouse, child, parent, etc.
  gender: varchar("gender"),
  healthProfileId: integer("health_profile_id").references(() => patientHealthProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insurance information
export const insuranceInfo = pgTable("insurance_info", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  provider: varchar("provider").notNull(),
  policyNumber: varchar("policy_number").notNull(),
  groupNumber: varchar("group_number"),
  memberNumber: varchar("member_number"),
  planType: varchar("plan_type"),
  copayAmount: decimal("copay_amount", { precision: 10, scale: 2 }),
  deductibleAmount: decimal("deductible_amount", { precision: 10, scale: 2 }),
  effectiveDate: timestamp("effective_date"),
  expiryDate: timestamp("expiry_date"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment methods
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePaymentMethodId: varchar("stripe_payment_method_id").notNull(),
  type: varchar("type").notNull(), // card, bank_account
  last4: varchar("last_4"),
  brand: varchar("brand"), // visa, mastercard, etc.
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false),
  billingAddressId: integer("billing_address_id").references(() => userAddresses.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Provider availability slots
export const providerAvailability = pgTable("provider_availability", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time").notNull(), // HH:MM format
  endTime: varchar("end_time").notNull(), // HH:MM format
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Provider blackout dates
export const providerBlackouts = pgTable("provider_blackouts", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: varchar("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Provider patient notes (PIPEDA compliant medical notes)
export const providerPatientNotes = pgTable("provider_patient_notes", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => providers.id),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  notes: text("notes").notNull(),
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Booking documents/attachments
export const bookingDocuments = pgTable("booking_documents", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  documentType: varchar("document_type").notNull(), // medical_history, prescription, lab_results, insurance_card, etc.
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking status history
export const bookingStatusHistory = pgTable("booking_status_history", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  previousStatus: varchar("previous_status"),
  newStatus: varchar("new_status").notNull(),
  changedBy: varchar("changed_by").notNull().references(() => users.id),
  reason: text("reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message attachments
export const messageAttachments = pgTable("message_attachments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
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
  addresses: many(userAddresses),
  emergencyContacts: many(emergencyContacts),
  healthProfile: many(patientHealthProfiles),
  familyMembers: many(familyMembers),
  insuranceInfo: many(insuranceInfo),
  paymentMethods: many(paymentMethods),
  providerNotes: many(providerPatientNotes),
  auditLogs: many(auditLogs),
  userActivityLogs: many(userActivityLogs),
}));

export const providersRelations = relations(providers, ({ one, many }) => ({
  user: one(users, { fields: [providers.userId], references: [users.id] }),
  services: many(services),
  bookings: many(bookings),
  credentials: many(providerCredentials),
  reviews: many(reviews),
  transactions: many(transactions),
  availability: many(providerAvailability),
  blackouts: many(providerBlackouts),
  patientNotes: many(providerPatientNotes),
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
  documents: many(bookingDocuments),
  statusHistory: many(bookingStatusHistory),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sentMessages" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receivedMessages" }),
  booking: one(bookings, { fields: [messages.bookingId], references: [bookings.id] }),
  attachments: many(messageAttachments),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
  patient: one(users, { fields: [reviews.patientId], references: [users.id] }),
  provider: one(providers, { fields: [reviews.providerId], references: [providers.id] }),
}));

export const providerCredentialsRelations = relations(providerCredentials, ({ one }) => ({
  provider: one(providers, { fields: [providerCredentials.providerId], references: [providers.id] }),
  reviewer: one(users, { fields: [providerCredentials.reviewedBy], references: [users.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(users, { fields: [auditLogs.adminId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  booking: one(bookings, { fields: [transactions.bookingId], references: [bookings.id] }),
  provider: one(providers, { fields: [transactions.providerId], references: [providers.id] }),
}));

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updatedByUser: one(users, { fields: [systemSettings.updatedBy], references: [users.id] }),
}));

export const userActivityLogsRelations = relations(userActivityLogs, ({ one }) => ({
  user: one(users, { fields: [userActivityLogs.userId], references: [users.id] }),
}));

// New table relations
export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, { fields: [userAddresses.userId], references: [users.id] }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, { fields: [emergencyContacts.userId], references: [users.id] }),
}));

export const patientHealthProfilesRelations = relations(patientHealthProfiles, ({ one, many }) => ({
  user: one(users, { fields: [patientHealthProfiles.userId], references: [users.id] }),
  familyMembers: many(familyMembers),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  user: one(users, { fields: [familyMembers.userId], references: [users.id] }),
  healthProfile: one(patientHealthProfiles, { fields: [familyMembers.healthProfileId], references: [patientHealthProfiles.id] }),
}));

export const insuranceInfoRelations = relations(insuranceInfo, ({ one }) => ({
  user: one(users, { fields: [insuranceInfo.userId], references: [users.id] }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, { fields: [paymentMethods.userId], references: [users.id] }),
  billingAddress: one(userAddresses, { fields: [paymentMethods.billingAddressId], references: [userAddresses.id] }),
}));

export const providerAvailabilityRelations = relations(providerAvailability, ({ one }) => ({
  provider: one(providers, { fields: [providerAvailability.providerId], references: [providers.id] }),
}));

export const providerBlackoutsRelations = relations(providerBlackouts, ({ one }) => ({
  provider: one(providers, { fields: [providerBlackouts.providerId], references: [providers.id] }),
}));

export const providerPatientNotesRelations = relations(providerPatientNotes, ({ one }) => ({
  provider: one(providers, { fields: [providerPatientNotes.providerId], references: [providers.id] }),
  patient: one(users, { fields: [providerPatientNotes.patientId], references: [users.id] }),
  booking: one(bookings, { fields: [providerPatientNotes.bookingId], references: [bookings.id] }),
}));

export const bookingDocumentsRelations = relations(bookingDocuments, ({ one }) => ({
  booking: one(bookings, { fields: [bookingDocuments.bookingId], references: [bookings.id] }),
  uploader: one(users, { fields: [bookingDocuments.uploadedBy], references: [users.id] }),
}));

export const bookingStatusHistoryRelations = relations(bookingStatusHistory, ({ one }) => ({
  booking: one(bookings, { fields: [bookingStatusHistory.bookingId], references: [bookings.id] }),
  changedBy: one(users, { fields: [bookingStatusHistory.changedBy], references: [users.id] }),
}));

export const messageAttachmentsRelations = relations(messageAttachments, ({ one }) => ({
  message: one(messages, { fields: [messageAttachments.messageId], references: [messages.id] }),
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

export const insertProviderCredentialSchema = createInsertSchema(providerCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({
  id: true,
  createdAt: true,
});

// New table schemas
export const insertUserAddressSchema = createInsertSchema(userAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientHealthProfileSchema = createInsertSchema(patientHealthProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInsuranceInfoSchema = createInsertSchema(insuranceInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderAvailabilitySchema = createInsertSchema(providerAvailability).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderBlackoutSchema = createInsertSchema(providerBlackouts).omit({
  id: true,
  createdAt: true,
});

export const insertProviderPatientNotesSchema = createInsertSchema(providerPatientNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingDocumentSchema = createInsertSchema(bookingDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertBookingStatusHistorySchema = createInsertSchema(bookingStatusHistory).omit({
  id: true,
  createdAt: true,
});

export const insertMessageAttachmentSchema = createInsertSchema(messageAttachments).omit({
  id: true,
  createdAt: true,
});

// TypeScript types for all tables
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
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
export type InsertProviderCredential = z.infer<typeof insertProviderCredentialSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type PlatformAnalytics = typeof platformAnalytics.$inferSelect;

// New table types
export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = z.infer<typeof insertUserAddressSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type PatientHealthProfile = typeof patientHealthProfiles.$inferSelect;
export type InsertPatientHealthProfile = z.infer<typeof insertPatientHealthProfileSchema>;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type InsuranceInfo = typeof insuranceInfo.$inferSelect;
export type InsertInsuranceInfo = z.infer<typeof insertInsuranceInfoSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type ProviderAvailability = typeof providerAvailability.$inferSelect;
export type InsertProviderAvailability = z.infer<typeof insertProviderAvailabilitySchema>;
export type ProviderBlackout = typeof providerBlackouts.$inferSelect;
export type InsertProviderBlackout = z.infer<typeof insertProviderBlackoutSchema>;
export type ProviderPatientNotes = typeof providerPatientNotes.$inferSelect;
export type InsertProviderPatientNotes = z.infer<typeof insertProviderPatientNotesSchema>;
export type BookingDocument = typeof bookingDocuments.$inferSelect;
export type InsertBookingDocument = z.infer<typeof insertBookingDocumentSchema>;
export type BookingStatusHistory = typeof bookingStatusHistory.$inferSelect;
export type InsertBookingStatusHistory = z.infer<typeof insertBookingStatusHistorySchema>;
export type MessageAttachment = typeof messageAttachments.$inferSelect;
export type InsertMessageAttachment = z.infer<typeof insertMessageAttachmentSchema>;
