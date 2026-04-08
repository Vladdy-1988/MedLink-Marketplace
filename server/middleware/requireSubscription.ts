export function requireSubscription(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.userType !== "patient") {
    return next();
  }
  if (req.user.subscriptionStatus === "active") {
    return next();
  }
  return res.status(402).json({
    error: "subscription_required",
    message: "An active subscription is required.",
  });
}
