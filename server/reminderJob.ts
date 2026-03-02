/**
 * Appointment reminder cron job.
 *
 * Runs every 15 minutes. For each confirmed/pending booking in two windows:
 *   24h window: scheduledDate is between now+23h and now+25h, reminder24hSentAt IS NULL
 *    1h window: scheduledDate is between now+45m and now+75m,  reminder1hSentAt IS NULL
 *
 * For each matching booking, if the patient has a phone number and has SMS
 * reminders enabled (notificationPreferences.sms === true), an SMS is sent
 * and the sentAt column is stamped to prevent re-sending.
 */

import cron from "node-cron";
import { storage } from "./storage";
import { sendBookingReminder } from "./smsService";

async function processWindow(window: "24h" | "1h"): Promise<void> {
  const hoursUntil = window === "24h" ? 24 : 1;

  let bookings: Awaited<ReturnType<typeof storage.getUpcomingBookingsNeedingReminder>>;
  try {
    bookings = await storage.getUpcomingBookingsNeedingReminder(window);
  } catch (err) {
    console.error(`[reminderJob] Failed to fetch bookings for ${window} window:`, err);
    return;
  }

  for (const booking of bookings) {
    try {
      const patient = await storage.getUser(booking.patientId);
      if (!patient) continue;

      const prefs = (patient.notificationPreferences as Record<string, unknown> | null) ?? {};
      const smsEnabled = prefs["sms"] === true;

      if (!patient.phoneNumber || !smsEnabled) continue;

      const provider = await storage.getProvider(booking.providerId);
      if (!provider) continue;

      const providerUser = await storage.getUser(provider.userId);
      const providerName = providerUser
        ? `${providerUser.firstName ?? ""} ${providerUser.lastName ?? ""}`.trim()
        : "your provider";

      await sendBookingReminder(
        patient.phoneNumber,
        providerName,
        new Date(booking.scheduledDate),
        hoursUntil as 24 | 1,
      );

      await storage.markReminderSent(booking.id, window);
    } catch (err) {
      console.error(`[reminderJob] Failed to send ${window} reminder for booking ${booking.id}:`, err);
    }
  }
}

export function startReminderJob(): void {
  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    try {
      await Promise.all([processWindow("24h"), processWindow("1h")]);
    } catch (err) {
      console.error("[reminderJob] Unexpected error in reminder job:", err);
    }
  });

  console.log("[reminderJob] Appointment reminder job scheduled (every 15 min)");
}
