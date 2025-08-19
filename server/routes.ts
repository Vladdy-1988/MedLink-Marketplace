import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProviderSchema, insertServiceSchema, insertBookingSchema, insertMessageSchema, insertReviewSchema, insertProviderCredentialSchema } from "@shared/schema";
import { emailService } from "./emailService";
import { z } from "zod";
import Stripe from "stripe";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Provider routes
  app.post('/api/providers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/providers/user/:userId', isAuthenticated, async (req, res) => {
    try {
      const provider = await storage.getProviderByUserId(req.params.userId);
      res.json(provider);
    } catch (error) {
      console.error("Error fetching provider by user:", error);
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Service routes
  app.post('/api/services', isAuthenticated, async (req, res) => {
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
  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/bookings/patient/:patientId', isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByPatient(req.params.patientId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching patient bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/bookings/provider/:providerId', isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByProvider(Number(req.params.providerId));
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching provider bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.patch('/api/bookings/:id/status', isAuthenticated, async (req, res) => {
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
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/messages/:userId1/:userId2', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessagesBetweenUsers(req.params.userId1, req.params.userId2);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/conversations/:userId', isAuthenticated, async (req, res) => {
    try {
      const conversations = await storage.getConversationsForUser(req.params.userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
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
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
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

  app.post('/api/payment/confirm', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/providers/credentials/:userId', isAuthenticated, async (req, res) => {
    try {
      // For now, return empty array - in production this would fetch from storage
      res.json([]);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  // Provider document upload route
  app.post('/api/providers/documents/upload', isAuthenticated, async (req: any, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getProviderDocumentUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });

  app.post('/api/providers/credentials', isAuthenticated, async (req: any, res) => {
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
  app.get('/objects/provider-documents/:documentId(*)', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/bookings/:id', isAuthenticated, async (req, res) => {
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
  app.get('/api/admin/pending-providers', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/admin/providers/:id/approval', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/admin/pending-credentials', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/admin/credentials/:id/verification', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/admin/transactions', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/admin/users/:id/suspend', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/admin/users/:id/reactivate', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/admin/settings', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/admin/settings/:key', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/admin/audit-logs', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/admin/conversations', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/admin/conversations/:id/flag', isAuthenticated, async (req: any, res) => {
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
  app.get("/api/admin/providers", isAuthenticated, async (req: any, res) => {
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

  app.put("/api/admin/providers/:id/status", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/admin/bookings", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/admin/reviews", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
