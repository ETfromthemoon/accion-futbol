import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
}).strict();

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>;
