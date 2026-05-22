import { z } from 'zod';

export const clientFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string(),
  email: z.union([z.string().email('Invalid email address'), z.literal('')]),
  phone: z.string(),
  address: z.string(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
