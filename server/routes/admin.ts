import { Router } from "express";
import { z } from "zod";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId } from "../routeHelpers";
import { requireAdmin } from "../middleware/guards";

// ---- Validation schemas for admin request bodies ----

const approvalSchema = z.object({
  isApproved: z.boolean(),
});

const providerStatusSchema = z.object({
  isApproved: z.boolean(),
  isVerified: z.boolean().default(false),
});

const credentialVerificationSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  reviewNotes: z.string().max(2000).optional(),
});

const suspendSchema = z.object({
  reason: z.string().min(1).max(500),
});

const settingValueSchema = z.object({
  value: z.string(),
});

const flagSchema = z.object({
  reason: z.string().min(1).max(500),
});

function badRequest(res: any, details: z.ZodIssue[]) {
  res.status(400).json({ error: "Invalid request payload", details });
}

const router = Router();
const checkAuth = isAuthenticated;

// All routes here require authentication AND admin role.
// requireAdmin is applied at the route level so the guard is explicit and testable.

router.get(
  "/admin/pending-providers",
  checkAuth,
  requireAdmin,
  async (_req, res) => {
    try {
      const providers = await storage.getPendingProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching pending providers:", error);
      res.status(500).json({ message: "Failed to fetch pending providers" });
    }
  },
);

router.patch(
  "/admin/providers/:id/approval",
  checkAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const parsed = approvalSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues);
      await storage.updateProviderApproval(Number(req.params.id), parsed.data.isApproved);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating provider approval:", error);
      res.status(500).json({ message: "Failed to update provider approval" });
    }
  },
);

router.get("/admin/stats", checkAuth, requireAdmin, async (_req, res) => {
  try {
    const stats = await storage.getPlatformStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({ message: "Failed to fetch platform stats" });
  }
});

router.get(
  "/admin/pending-credentials",
  checkAuth,
  requireAdmin,
  async (_req, res) => {
    try {
      const credentials = await storage.getAllPendingCredentials();
      res.json(credentials);
    } catch (error) {
      console.error("Error fetching pending credentials:", error);
      res.status(500).json({ message: "Failed to fetch pending credentials" });
    }
  },
);

router.patch(
  "/admin/credentials/:id/verification",
  checkAuth,
  requireAdmin,
  async (req: any, res) => {
    try {
      const parsed = credentialVerificationSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues);
      const { status, reviewNotes } = parsed.data;
      const adminId = getAuthUserId(req);
      await storage.updateCredentialVerification(
        Number(req.params.id),
        status,
        adminId,
        reviewNotes,
      );
      await storage.createAuditLog({
        adminId,
        action: `${status}_credential`,
        targetType: "credential",
        targetId: req.params.id,
        reason: reviewNotes || "",
        ipAddress: req.ip || "",
        userAgent: req.get("User-Agent") || "",
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating credential verification:", error);
      res
        .status(500)
        .json({ message: "Failed to update credential verification" });
    }
  },
);

router.get(
  "/admin/transactions",
  checkAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string,
        type: req.query.type as string,
        providerId: req.query.providerId
          ? Number(req.query.providerId)
          : undefined,
      };
      const transactions = await storage.getTransactions(filters);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  },
);

router.get("/admin/users", checkAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.patch(
  "/admin/users/:id/suspend",
  checkAuth,
  requireAdmin,
  async (req: any, res) => {
    try {
      const parsed = suspendSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues);
      await storage.suspendUser(
        req.params.id,
        parsed.data.reason,
        getAuthUserId(req),
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error suspending user:", error);
      res.status(500).json({ message: "Failed to suspend user" });
    }
  },
);

router.patch(
  "/admin/users/:id/reactivate",
  checkAuth,
  requireAdmin,
  async (req: any, res) => {
    try {
      await storage.reactivateUser(req.params.id, getAuthUserId(req));
      res.json({ success: true });
    } catch (error) {
      console.error("Error reactivating user:", error);
      res.status(500).json({ message: "Failed to reactivate user" });
    }
  },
);

router.get("/admin/settings", checkAuth, requireAdmin, async (_req, res) => {
  try {
    const settings = await storage.getSystemSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching system settings:", error);
    res.status(500).json({ message: "Failed to fetch system settings" });
  }
});

router.patch(
  "/admin/settings/:key",
  checkAuth,
  requireAdmin,
  async (req: any, res) => {
    try {
      const parsed = settingValueSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues);
      await storage.updateSystemSetting(
        req.params.key,
        parsed.data.value,
        getAuthUserId(req),
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating system setting:", error);
      res.status(500).json({ message: "Failed to update system setting" });
    }
  },
);

router.get(
  "/admin/audit-logs",
  checkAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 100;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  },
);

router.get(
  "/admin/conversations",
  checkAuth,
  requireAdmin,
  async (_req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  },
);

router.post(
  "/admin/conversations/:id/flag",
  checkAuth,
  requireAdmin,
  async (req: any, res) => {
    try {
      const parsed = flagSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues);
      await storage.flagConversation(
        req.params.id,
        parsed.data.reason,
        getAuthUserId(req),
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error flagging conversation:", error);
      res.status(500).json({ message: "Failed to flag conversation" });
    }
  },
);

router.get(
  "/admin/providers",
  checkAuth,
  requireAdmin,
  async (_req, res) => {
    try {
      const providers = await storage.getAllProviders();
      res.json(providers);
    } catch (error) {
      console.error("Admin providers error:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  },
);

router.put(
  "/admin/providers/:id/status",
  checkAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const parsed = providerStatusSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues);
      const providerId = parseInt(req.params.id);
      await storage.updateProviderStatus(providerId, parsed.data.isApproved, parsed.data.isVerified);
      res.json({ success: true });
    } catch (error) {
      console.error("Admin provider update error:", error);
      res.status(500).json({ message: "Failed to update provider status" });
    }
  },
);

router.get("/admin/bookings", checkAuth, requireAdmin, async (_req, res) => {
  try {
    const bookings = await storage.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Admin bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.get("/admin/reviews", checkAuth, requireAdmin, async (_req, res) => {
  try {
    const reviews = await storage.getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Admin reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

router.get("/admin/reports", checkAuth, requireAdmin, async (req, res) => {
  try {
    const filters: { status?: string; providerId?: number } = {};
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.providerId) filters.providerId = Number(req.query.providerId);
    const reports = await storage.getUserReports(filters);
    res.json(reports);
  } catch (error) {
    console.error("Admin reports error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

export default router;
