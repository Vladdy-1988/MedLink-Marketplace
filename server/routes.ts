import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth0";
import { setupDemoAuth } from "./demoAuth";
import { insertProviderSchema, insertServiceSchema, insertBookingSchema, insertMessageSchema, insertReviewSchema, insertProviderCredentialSchema } from "@shared/schema";
import { emailService } from "./emailService";
import { z } from "zod";
import Stripe from "stripe";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { getSession } from "./auth0";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware first
  app.use(getSession());
  
  // Auth middleware - use Auth0 if configured, otherwise use demo auth
  const isAuth0Configured = process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET;
  
  try {
    await setupAuth(app);
    console.log("Auth0 authentication setup completed successfully");
  } catch (error) {
    console.error("Failed to setup Auth0 authentication:", error);
    throw error;
  }
  
  // Use isAuthenticated middleware from Auth0
  const checkAuth = isAuthenticated;

  // Auth routes
  app.get('/api/auth/user', checkAuth, async (req: any, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Provider routes
  app.post('/api/providers', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const providerData = insertProviderSchema.parse({ ...req.body, userId });
      const provider = await storage.createProvider(providerData);
      res.json(provider);
    } catch (error) {
      console.error("Error creating provider:", error);
      res.status(400).json({ message: "Failed to create provider" });
    }
  });

  app.get('/api/providers/search', async (req, res) => {
    try {
      const filters = {
        serviceType: req.query.serviceType as string,
        location: req.query.location as string,
        priceRange: req.query.priceMin && req.query.priceMax 
          ? [Number(req.query.priceMin), Number(req.query.priceMax)] as [number, number]
          : undefined,
        rating: req.query.rating ? Number(req.query.rating) : undefined,
      };
      
      const providers = await storage.searchProviders(filters);
      res.json(providers);
    } catch (error) {
      console.error("Error searching providers:", error);
      res.status(500).json({ message: "Failed to search providers" });
    }
  });

  app.get('/api/providers/:id', async (req, res) => {
    try {
      const provider = await storage.getProvider(Number(req.params.id));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching provider:", error);
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  app.get('/api/providers/user/:userId', checkAuth, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.params.userId);
      res.json(provider);
    } catch (error) {
      console.error("Error fetching provider by user:", error);
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Service routes
  app.post('/api/services', checkAuth, async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  app.get('/api/providers/:providerId/services', async (req, res) => {
    try {
      const services = await storage.getServicesByProvider(Number(req.params.providerId));
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Booking routes
  app.post('/api/bookings', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertBookingSchema.parse({ ...req.body, patientId: userId });
      const booking = await storage.createBooking(bookingData);
      
      // Send email notifications
      const patient = await storage.getUser(userId);
      const provider = await storage.getProvider(booking.providerId);
      const providerUser = provider ? await storage.getUser(provider.userId) : null;
      const service = await storage.getService(booking.serviceId);
      
      if (patient && providerUser && service) {
        // Send confirmation to patient
        await emailService.sendBookingConfirmation(
          patient.email!,
          `${patient.firstName} ${patient.lastName}`,
          `${providerUser.firstName} ${providerUser.lastName}`,
          service.name,
          new Date(booking.scheduledDate),
          booking.id
        );
        
        // Send notification to provider
        await emailService.sendProviderNotification(
          providerUser.email!,
          `${providerUser.firstName} ${providerUser.lastName}`,
          `${patient.firstName} ${patient.lastName}`,
          service.name,
          new Date(booking.scheduledDate),
          booking.id
        );
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(400).json({ message: "Failed to create booking" });
    }
  });

  app.get('/api/bookings/patient/:patientId', checkAuth, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByPatient(req.params.patientId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching patient bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings/provider/:providerId', checkAuth, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByProvider(Number(req.params.providerId));
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch('/api/bookings/:id/status', checkAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.getBooking(Number(req.params.id));
      await storage.updateBookingStatus(Number(req.params.id), status);
      
      // Send status update email
      if (booking) {
        const patient = await storage.getUser(booking.patientId);
        const provider = await storage.getProvider(booking.providerId);
        const providerUser = provider ? await storage.getUser(provider.userId) : null;
        const service = await storage.getService(booking.serviceId);
        
        if (patient && providerUser && service) {
          await emailService.sendBookingStatusUpdate(
            patient.email!,
            `${patient.firstName} ${patient.lastName}`,
            `${providerUser.firstName} ${providerUser.lastName}`,
            service.name,
            status,
            booking.id
          );
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Message routes
  app.post('/api/messages', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({ ...req.body, senderId: userId });
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/messages/:userId1/:userId2', checkAuth, async (req, res) => {
    try {
      const messages = await storage.getMessagesBetweenUsers(req.params.userId1, req.params.userId2);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/conversations/:userId', checkAuth, async (req, res) => {
    try {
      const conversations = await storage.getConversationsForUser(req.params.userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Review routes
  app.post('/api/reviews', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({ ...req.body, patientId: userId });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/providers/:providerId/reviews', async (req, res) => {
    try {
      const reviews = await storage.getReviewsForProvider(Number(req.params.providerId));
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", checkAuth, async (req: any, res) => {
    try {
      const { amount, bookingId } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "cad", // Canadian dollars for Calgary market
        metadata: {
          bookingId: bookingId?.toString() || '',
          userId: req.user.claims.sub,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/payment/confirm', checkAuth, async (req: any, res) => {
    try {
      const { paymentIntentId, bookingId } = req.body;
      
      // Update booking with payment intent ID and status
      await storage.updateBookingPayment(Number(bookingId), paymentIntentId, 'paid');
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Provider credentials routes
  app.get('/api/providers/credentials/:userId', checkAuth, async (req, res) => {
    try {
      // For now, return empty array - in production this would fetch from storage
      res.json([]);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  // Provider document upload route
  app.post('/api/providers/documents/upload', checkAuth, async (req: any, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getProviderDocumentUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });

  app.post('/api/providers/credentials', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      const provider = await storage.getProviderByUserId(req.user.claims.sub);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }

      const objectStorageService = new ObjectStorageService();
      const documentPath = objectStorageService.normalizeProviderDocumentPath(req.body.documentUrl);

      const credentialData = insertProviderCredentialSchema.parse({
        providerId: provider.id,
        credentialType: req.body.credentialType,
        documentUrl: documentPath,
        documentName: req.body.documentName,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
      });

      const credential = await storage.createProviderCredential(credentialData);
      res.json(credential);
    } catch (error) {
      console.error("Error creating credential:", error);
      res.status(500).json({ message: "Failed to create credential" });
    }
  });

  // Serve provider documents
  app.get('/objects/provider-documents/:documentId(*)', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const objectStorageService = new ObjectStorageService();
      const documentFile = await objectStorageService.getProviderDocumentFile(req.path);
      objectStorageService.downloadObject(documentFile, res);
    } catch (error) {
      console.error("Error accessing document:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: "Document not found" });
      }
      return res.status(500).json({ message: "Failed to access document" });
    }
  });

  // Individual booking route
  app.get('/api/bookings/:id', checkAuth, async (req, res) => {
    try {
      const booking = await storage.getBooking(Number(req.params.id));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Admin routes
  app.get('/api/admin/pending-providers', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const providers = await storage.getPendingProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching pending providers:", error);
      res.status(500).json({ message: "Failed to fetch pending providers" });
    }
  });

  app.patch('/api/admin/providers/:id/approval', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { isApproved } = req.body;
      await storage.updateProviderApproval(Number(req.params.id), isApproved);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating provider approval:", error);
      res.status(500).json({ message: "Failed to update provider approval" });
    }
  });

  app.get('/api/admin/stats', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

  // Admin routes for provider verification and document management
  app.get('/api/admin/pending-credentials', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const credentials = await storage.getAllPendingCredentials();
      res.json(credentials);
    } catch (error) {
      console.error("Error fetching pending credentials:", error);
      res.status(500).json({ message: "Failed to fetch pending credentials" });
    }
  });

  app.patch('/api/admin/credentials/:id/verification', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { status, reviewNotes } = req.body;
      await storage.updateCredentialVerification(Number(req.params.id), status, req.user.claims.sub, reviewNotes);
      
      // Log the verification action
      await storage.createAuditLog({
        adminId: req.user.claims.sub,
        action: `${status}_credential`,
        targetType: 'credential',
        targetId: req.params.id,
        reason: reviewNotes || '',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating credential verification:", error);
      res.status(500).json({ message: "Failed to update credential verification" });
    }
  });

  // Financial management routes
  app.get('/api/admin/transactions', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const filters = {
        status: req.query.status as string,
        type: req.query.type as string,
        providerId: req.query.providerId ? Number(req.query.providerId) : undefined,
      };
      
      const transactions = await storage.getTransactions(filters);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // User management routes
  app.get('/api/admin/users', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/users/:id/suspend', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { reason } = req.body;
      await storage.suspendUser(req.params.id, reason, req.user.claims.sub);
      res.json({ success: true });
    } catch (error) {
      console.error("Error suspending user:", error);
      res.status(500).json({ message: "Failed to suspend user" });
    }
  });

  app.patch('/api/admin/users/:id/reactivate', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.reactivateUser(req.params.id, req.user.claims.sub);
      res.json({ success: true });
    } catch (error) {
      console.error("Error reactivating user:", error);
      res.status(500).json({ message: "Failed to reactivate user" });
    }
  });

  // System settings routes
  app.get('/api/admin/settings', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const settings = await storage.getSystemSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching system settings:", error);
      res.status(500).json({ message: "Failed to fetch system settings" });
    }
  });

  app.patch('/api/admin/settings/:key', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { value } = req.body;
      await storage.updateSystemSetting(req.params.key, value, req.user.claims.sub);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating system setting:", error);
      res.status(500).json({ message: "Failed to update system setting" });
    }
  });

  // Audit logs routes
  app.get('/api/admin/audit-logs', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Communication oversight routes
  app.get('/api/admin/conversations', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post('/api/admin/conversations/:id/flag', checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { reason } = req.body;
      await storage.flagConversation(req.params.id, reason, req.user.claims.sub);
      res.json({ success: true });
    } catch (error) {
      console.error("Error flagging conversation:", error);
      res.status(500).json({ message: "Failed to flag conversation" });
    }
  });

  // Comprehensive admin routes for the admin portal
  app.get("/api/admin/providers", checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const providers = await storage.getAllProviders();
      res.json(providers);
    } catch (error) {
      console.error("Admin providers error:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  app.put("/api/admin/providers/:id/status", checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const providerId = parseInt(req.params.id);
      const { isApproved, isVerified = false } = req.body;
      
      await storage.updateProviderStatus(providerId, isApproved, isVerified);
      res.json({ success: true });
    } catch (error) {
      console.error("Admin provider update error:", error);
      res.status(500).json({ message: "Failed to update provider status" });
    }
  });

  app.get("/api/admin/bookings", checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Admin bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/reviews", checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Admin reviews error:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/admin/users", checkAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.userType !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Comprehensive User Profile Management API Routes
  
  // User address routes
  app.post('/api/user/addresses', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const address = await storage.createUserAddress({ ...req.body, userId });
      res.status(201).json(address);
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/addresses', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/addresses/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const address = await storage.updateUserAddress(id, req.body);
      res.json(address);
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/user/addresses/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUserAddress(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/addresses/:id/default', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addressId = parseInt(req.params.id);
      await storage.setDefaultAddress(userId, addressId);
      res.status(204).send();
    } catch (error) {
      console.error('Error setting default address:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Emergency contact routes
  app.post('/api/user/emergency-contacts', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contact = await storage.createEmergencyContact({ ...req.body, userId });
      res.status(201).json(contact);
    } catch (error) {
      console.error('Error creating emergency contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/emergency-contacts', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contacts = await storage.getEmergencyContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/emergency-contacts/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.updateEmergencyContact(id, req.body);
      res.json(contact);
    } catch (error) {
      console.error('Error updating emergency contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/user/emergency-contacts/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmergencyContact(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Health profile routes
  app.post('/api/user/health-profile', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.createHealthProfile({ ...req.body, userId });
      res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating health profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/health-profile', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getHealthProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error('Error fetching health profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/health-profile/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.updateHealthProfile(id, req.body);
      res.json(profile);
    } catch (error) {
      console.error('Error updating health profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Family member routes
  app.post('/api/user/family-members', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const member = await storage.createFamilyMember({ ...req.body, userId });
      res.status(201).json(member);
    } catch (error) {
      console.error('Error creating family member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/family-members', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const members = await storage.getFamilyMembers(userId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching family members:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/family-members/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateFamilyMember(id, req.body);
      res.json(member);
    } catch (error) {
      console.error('Error updating family member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/user/family-members/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFamilyMember(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting family member:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Insurance routes
  app.post('/api/user/insurance', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const insurance = await storage.createInsuranceInfo({ ...req.body, userId });
      res.status(201).json(insurance);
    } catch (error) {
      console.error('Error creating insurance info:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/insurance', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const insurance = await storage.getInsuranceInfo(userId);
      res.json(insurance);
    } catch (error) {
      console.error('Error fetching insurance info:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/insurance/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const insurance = await storage.updateInsuranceInfo(id, req.body);
      res.json(insurance);
    } catch (error) {
      console.error('Error updating insurance info:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/user/insurance/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInsuranceInfo(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting insurance info:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Payment method routes
  app.post('/api/user/payment-methods', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const method = await storage.createPaymentMethod({ ...req.body, userId });
      res.status(201).json(method);
    } catch (error) {
      console.error('Error creating payment method:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/payment-methods', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const methods = await storage.getPaymentMethods(userId);
      res.json(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/payment-methods/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const method = await storage.updatePaymentMethod(id, req.body);
      res.json(method);
    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/user/payment-methods/:id', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePaymentMethod(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/payment-methods/:id/default', checkAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const methodId = parseInt(req.params.id);
      await storage.setDefaultPaymentMethod(userId, methodId);
      res.status(204).send();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Enhanced booking routes
  app.get('/api/bookings/:id/details', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBookingWithDetails(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/bookings/:id/cancel', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      const userId = req.user.claims.sub;
      await storage.cancelBooking(id, userId, reason);
      res.status(204).send();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/bookings/:id/reschedule', checkAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { newDate, reason } = req.body;
      const userId = req.user.claims.sub;
      await storage.rescheduleBooking(id, new Date(newDate), userId, reason);
      res.status(204).send();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/bookings/:id/documents', checkAuth, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const documents = await storage.getBookingDocuments(bookingId);
      res.json(documents);
    } catch (error) {
      console.error('Error fetching booking documents:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/bookings/:id/status-history', checkAuth, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const history = await storage.getBookingStatusHistory(bookingId);
      res.json(history);
    } catch (error) {
      console.error('Error fetching booking status history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Enhanced messaging routes
  app.put('/api/messages/:id/read', checkAuth, async (req: any, res) => {
    try {
      const messageId = parseInt(req.params.id);
      await storage.markMessageAsRead(messageId);
      res.status(204).send();
    } catch (error) {
      console.error('Error marking message as read:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/messages/:userId1/:userId2/attachments', checkAuth, async (req: any, res) => {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await storage.getMessagesWithAttachments(userId1, userId2);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages with attachments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/messages/:id/attachments', checkAuth, async (req: any, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const attachments = await storage.getMessageAttachments(messageId);
      res.json(attachments);
    } catch (error) {
      console.error('Error fetching message attachments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Provider-specific routes
  app.post('/api/providers/:id/availability', checkAuth, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const availability = await storage.createProviderAvailability({ ...req.body, providerId });
      res.status(201).json(availability);
    } catch (error) {
      console.error('Error creating provider availability:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/providers/:id/availability', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const availability = await storage.getProviderAvailability(providerId);
      res.json(availability);
    } catch (error) {
      console.error('Error fetching provider availability:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/providers/:id/blackouts', checkAuth, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const blackout = await storage.createProviderBlackout({ ...req.body, providerId });
      res.status(201).json(blackout);
    } catch (error) {
      console.error('Error creating provider blackout:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/providers/:id/blackouts', async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const blackouts = await storage.getProviderBlackouts(providerId);
      res.json(blackouts);
    } catch (error) {
      console.error('Error fetching provider blackouts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/providers/:providerId/patients/:patientId/notes', checkAuth, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const patientId = req.params.patientId;
      const notes = await storage.createProviderPatientNotes({ 
        ...req.body, 
        providerId, 
        patientId,
        createdBy: req.user.claims.sub 
      });
      res.status(201).json(notes);
    } catch (error) {
      console.error('Error creating provider patient notes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/providers/:providerId/patients/:patientId/notes', checkAuth, async (req: any, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const patientId = req.params.patientId;
      const notes = await storage.getProviderPatientNotes(providerId, patientId);
      res.json(notes);
    } catch (error) {
      console.error('Error fetching provider patient notes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
