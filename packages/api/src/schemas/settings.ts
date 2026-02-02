import { z } from "zod";

const timeRegex = /^\d{2}:\d{2}$/;

function isValidTime(value: string): boolean {
  if (!timeRegex.test(value)) {
    return false;
  }
  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function isValidTimeZone(timeZone: string): boolean {
  const hasSupportedValues = typeof Intl.supportedValuesOf === "function";
  if (hasSupportedValues) {
    return Intl.supportedValuesOf("timeZone").includes(timeZone);
  }
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

const timeSchema = z.string().refine(isValidTime, {
  message: "Time must be in HH:MM format"
});

export const userSettingsUpdateSchema = z
  .object({
    day_start_reminder_time: timeSchema.optional().nullable(),
    day_close_reminder_time: timeSchema.optional().nullable(),
    push_enabled: z.boolean().optional(),
    email_for_escalations_enabled: z.boolean().optional(),
    timezone: z.string().refine(isValidTimeZone, { message: "Invalid timezone" }).optional()
  })
  .strict();
