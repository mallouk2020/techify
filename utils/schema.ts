import { z } from "zod";
import { commonValidations } from "./validation";

// Registration schema with comprehensive validation
export const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: commonValidations.email,
  password: commonValidations.password,
});

// Login schema (for future use)
export const loginSchema = z.object({
  email: commonValidations.email,
  password: z.string().min(1, "Password is required"),
});

// Generic validation schema (keeping existing for backward compatibility)
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email()
});

export default schema;