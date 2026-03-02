import { Router } from "express";
import { isAuthenticated } from "../auth0";
import { storage } from "../storage";
import { getAuthUserId, toDateOrNull, toNumberOrNull } from "../routeHelpers";
import { auditPhiEvent, handleValidationError } from "./shared";
import {
  insertUserAddressSchema,
  insertEmergencyContactSchema,
  insertPatientHealthProfileSchema,
  insertFamilyMemberSchema,
  insertInsuranceInfoSchema,
  insertPaymentMethodSchema,
} from "@shared/schema";

const router = Router();
const checkAuth = isAuthenticated;

const updateUserAddressSchema = insertUserAddressSchema
  .omit({ userId: true })
  .partial();
const updateEmergencyContactSchema = insertEmergencyContactSchema
  .omit({ userId: true })
  .partial();
const updateHealthProfileSchema = insertPatientHealthProfileSchema
  .omit({ userId: true })
  .partial();
const updateFamilyMemberSchema = insertFamilyMemberSchema
  .omit({ userId: true })
  .partial();
const updateInsuranceInfoSchema = insertInsuranceInfoSchema
  .omit({ userId: true })
  .partial();
const updatePaymentMethodSchema = insertPaymentMethodSchema
  .omit({ userId: true })
  .partial();

// ---- Addresses ----

router.post("/user/addresses", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const payload = insertUserAddressSchema.parse({ ...req.body, userId });
    const address = await storage.createUserAddress(payload);
    await auditPhiEvent(req, "create_user_address", "user_address", String(address.id));
    res.status(201).json(address);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/addresses", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const addresses = await storage.getUserAddresses(userId);
    await auditPhiEvent(req, "read_user_addresses", "user", userId);
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/addresses/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const updates = updateUserAddressSchema.parse(req.body);
    const address = await storage.updateUserAddress(id, userId, updates);
    if (!address) return res.status(404).json({ error: "Address not found" });
    await auditPhiEvent(req, "update_user_address", "user_address", String(address.id));
    res.json(address);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/addresses/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteUserAddress(id, userId);
    if (!deleted) return res.status(404).json({ error: "Address not found" });
    await auditPhiEvent(req, "delete_user_address", "user_address", String(id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/addresses/:id/default", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const addressId = parseInt(req.params.id);
    const updated = await storage.setDefaultAddress(userId, addressId);
    if (!updated) return res.status(404).json({ error: "Address not found" });
    await auditPhiEvent(req, "set_default_user_address", "user_address", String(addressId));
    res.status(204).send();
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Emergency contacts ----

router.post("/user/emergency-contacts", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const payload = insertEmergencyContactSchema.parse({ ...req.body, userId });
    const contact = await storage.createEmergencyContact(payload);
    await auditPhiEvent(req, "create_emergency_contact", "emergency_contact", String(contact.id));
    res.status(201).json(contact);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating emergency contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/emergency-contacts", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const contacts = await storage.getEmergencyContacts(userId);
    await auditPhiEvent(req, "read_emergency_contacts", "user", userId);
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/emergency-contacts/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const updates = updateEmergencyContactSchema.parse(req.body);
    const contact = await storage.updateEmergencyContact(id, userId, updates);
    if (!contact) return res.status(404).json({ error: "Emergency contact not found" });
    await auditPhiEvent(req, "update_emergency_contact", "emergency_contact", String(contact.id));
    res.json(contact);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating emergency contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/emergency-contacts/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteEmergencyContact(id, userId);
    if (!deleted) return res.status(404).json({ error: "Emergency contact not found" });
    await auditPhiEvent(req, "delete_emergency_contact", "emergency_contact", String(id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Health profile ----

router.post("/user/health-profile", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const payload = insertPatientHealthProfileSchema.parse({ ...req.body, userId });
    const profile = await storage.createHealthProfile(payload);
    await auditPhiEvent(req, "create_health_profile", "health_profile", String(profile.id));
    res.status(201).json(profile);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating health profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/health-profile", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const profile = await storage.getHealthProfile(userId);
    await auditPhiEvent(req, "read_health_profile", "user", userId);
    res.json(profile ?? null);
  } catch (error) {
    console.error("Error fetching health profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/health-profile/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const updates = updateHealthProfileSchema.parse(req.body);
    const profile = await storage.updateHealthProfile(id, userId, updates);
    if (!profile) return res.status(404).json({ error: "Health profile not found" });
    await auditPhiEvent(req, "update_health_profile", "health_profile", String(profile.id));
    res.json(profile);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating health profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Family members ----

router.post("/user/family-members", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const payload = insertFamilyMemberSchema.parse({
      ...req.body,
      userId,
      dateOfBirth: toDateOrNull(req.body.dateOfBirth),
      healthProfileId: req.body.healthProfileId ?? null,
    });
    const member = await storage.createFamilyMember(payload);
    await auditPhiEvent(req, "create_family_member", "family_member", String(member.id));
    res.status(201).json(member);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating family member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/family-members", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const members = await storage.getFamilyMembers(userId);
    await auditPhiEvent(req, "read_family_members", "user", userId);
    res.json(members);
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/family-members/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const updates = updateFamilyMemberSchema.parse({
      ...req.body,
      dateOfBirth: toDateOrNull(req.body.dateOfBirth),
      healthProfileId: req.body.healthProfileId ?? null,
    });
    const member = await storage.updateFamilyMember(id, userId, updates);
    if (!member) return res.status(404).json({ error: "Family member not found" });
    await auditPhiEvent(req, "update_family_member", "family_member", String(member.id));
    res.json(member);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating family member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/family-members/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteFamilyMember(id, userId);
    if (!deleted) return res.status(404).json({ error: "Family member not found" });
    await auditPhiEvent(req, "delete_family_member", "family_member", String(id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting family member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Insurance ----

router.post("/user/insurance", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const payload = insertInsuranceInfoSchema.parse({
      ...req.body,
      userId,
      effectiveDate: toDateOrNull(req.body.effectiveDate),
      expiryDate: toDateOrNull(req.body.expiryDate),
    });
    const insurance = await storage.createInsuranceInfo(payload);
    await auditPhiEvent(req, "create_insurance_record", "insurance_info", String(insurance.id));
    res.status(201).json(insurance);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating insurance info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/insurance", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const insurance = await storage.getInsuranceInfo(userId);
    await auditPhiEvent(req, "read_insurance_records", "user", userId);
    res.json(insurance);
  } catch (error) {
    console.error("Error fetching insurance info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/insurance/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const updates = updateInsuranceInfoSchema.parse({
      ...req.body,
      effectiveDate: toDateOrNull(req.body.effectiveDate),
      expiryDate: toDateOrNull(req.body.expiryDate),
    });
    const insurance = await storage.updateInsuranceInfo(id, userId, updates);
    if (!insurance) return res.status(404).json({ error: "Insurance record not found" });
    await auditPhiEvent(req, "update_insurance_record", "insurance_info", String(insurance.id));
    res.json(insurance);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating insurance info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/insurance/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteInsuranceInfo(id, userId);
    if (!deleted) return res.status(404).json({ error: "Insurance record not found" });
    await auditPhiEvent(req, "delete_insurance_record", "insurance_info", String(id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting insurance info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Payment methods ----

router.post("/user/payment-methods", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const payload = insertPaymentMethodSchema.parse({
      ...req.body,
      userId,
      expiryMonth: toNumberOrNull(req.body.expiryMonth),
      expiryYear: toNumberOrNull(req.body.expiryYear),
      billingAddressId: toNumberOrNull(req.body.billingAddressId),
    });
    const method = await storage.createPaymentMethod(payload);
    res.status(201).json(method);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error creating payment method:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/payment-methods", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const methods = await storage.getPaymentMethods(userId);
    res.json(methods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/payment-methods/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const updates = updatePaymentMethodSchema.parse({
      ...req.body,
      expiryMonth: toNumberOrNull(req.body.expiryMonth),
      expiryYear: toNumberOrNull(req.body.expiryYear),
      billingAddressId: toNumberOrNull(req.body.billingAddressId),
    });
    const method = await storage.updatePaymentMethod(id, userId, updates);
    if (!method) return res.status(404).json({ error: "Payment method not found" });
    res.json(method);
  } catch (error) {
    if (handleValidationError(error, res)) return;
    console.error("Error updating payment method:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/payment-methods/:id", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const id = parseInt(req.params.id);
    const deleted = await storage.deletePaymentMethod(id, userId);
    if (!deleted) return res.status(404).json({ error: "Payment method not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/user/payment-methods/:id/default", checkAuth, async (req: any, res) => {
  try {
    const userId = getAuthUserId(req);
    const methodId = parseInt(req.params.id);
    const updated = await storage.setDefaultPaymentMethod(userId, methodId);
    if (!updated) return res.status(404).json({ error: "Payment method not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error setting default payment method:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
