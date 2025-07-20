import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProviderSchema, insertServiceSchema, insertBookingSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

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
      await storage.updateBookingStatus(Number(req.params.id), status);
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

  const httpServer = createServer(app);
  return httpServer;
}
