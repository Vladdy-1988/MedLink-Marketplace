import { Router } from "express";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId, isAdmin } from "../routeHelpers";
import { insertMessageSchema } from "@shared/schema";

const router = Router();
const checkAuth = isAuthenticated;

router.post("/messages", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const messageData = insertMessageSchema.parse({
      ...req.body,
      senderId: userId,
    });
    const message = await storage.createMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(400).json({ message: "Failed to send message" });
  }
});

router.get("/messages/:userId1/:userId2", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    const { userId1, userId2 } = req.params;
    const canAccess =
      requestUserId === userId1 ||
      requestUserId === userId2 ||
      (await isAdmin(requestUserId));
    if (!canAccess) {
      return res.status(403).json({ message: "Access denied" });
    }
    const messages = await storage.getMessagesBetweenUsers(userId1, userId2);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.get("/conversations/:userId", checkAuth, async (req, res) => {
  try {
    const requestUserId = getAuthUserId(req);
    const { canAccessUserScope } = await import("../routeHelpers");
    if (!(await canAccessUserScope(requestUserId, req.params.userId))) {
      return res.status(403).json({ message: "Access denied" });
    }
    const conversations = await storage.getConversationsForUser(
      req.params.userId,
    );
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

router.put("/conversations/:partnerId/read", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const { partnerId } = req.params;
    if (!partnerId) {
      return res.status(400).json({ message: "Conversation partner is required" });
    }
    await storage.markConversationAsRead(userId, partnerId);
    res.status(204).send();
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    res.status(500).json({ message: "Failed to mark conversation as read" });
  }
});

router.put("/messages/:id/read", checkAuth, async (req: any, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const requestUserId = getAuthUserId(req);
    const message = await storage.getMessage(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    const canAccess =
      requestUserId === message.senderId ||
      requestUserId === message.receiverId ||
      (await isAdmin(requestUserId));
    if (!canAccess) {
      return res.status(403).json({ error: "Access denied" });
    }
    await storage.markMessageAsRead(messageId);
    res.status(204).send();
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/messages/:userId1/:userId2/attachments",
  checkAuth,
  async (req: any, res) => {
    try {
      const requestUserId = getAuthUserId(req);
      const { userId1, userId2 } = req.params;
      const canAccess =
        requestUserId === userId1 ||
        requestUserId === userId2 ||
        (await isAdmin(requestUserId));
      if (!canAccess) {
        return res.status(403).json({ error: "Access denied" });
      }
      const messages = await storage.getMessagesWithAttachments(
        userId1,
        userId2,
      );
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages with attachments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/messages/:id/attachments", checkAuth, async (req: any, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const requestUserId = getAuthUserId(req);
    const message = await storage.getMessage(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    const canAccess =
      requestUserId === message.senderId ||
      requestUserId === message.receiverId ||
      (await isAdmin(requestUserId));
    if (!canAccess) {
      return res.status(403).json({ error: "Access denied" });
    }
    const attachments = await storage.getMessageAttachments(messageId);
    res.json(attachments);
  } catch (error) {
    console.error("Error fetching message attachments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
