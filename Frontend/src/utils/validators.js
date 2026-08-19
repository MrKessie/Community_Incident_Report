import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const reportIncidentSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category_id: z.string().min(1, 'Please select a category'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  incident_date: z.string().min(1, 'Incident date and time is required'),
  address: z.string().optional(),
  is_anonymous: z.boolean().optional(),
});

export const assignIncidentSchema = z.object({
  team_id: z.string().min(1, 'Please select a response unit'),
  notes: z.string().optional(),
});

export const rejectIncidentSchema = z.object({
  reason: z.string().min(20, 'Rejection reason must be at least 20 characters'),
});

export const addUpdateSchema = z.object({
  message: z.string().min(10, 'Update message must be at least 10 characters'),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  was_resolved: z.boolean(),
  comment: z.string().optional(),
});
