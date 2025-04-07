const { z } = require("zod");

const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
  cnic: z
    .string()
    .regex(
      /^\d{5}-\d{7}-\d{1}$/,
      "Invalid CNIC format (e.g., 12345-1234567-1)"
    ),
  phoneNo: z
    .string()
    .regex(/^03\d{9}$/, "Invalid phone number (e.g., 03001234567)"),
  isAprovedByBank: z.boolean().optional(), // Optional field, defaults to false
  isAprovedByVendor: z.boolean().optional(), // Optional field, defaults to false
  bikeVarient: z
    .string()
    .min(1, "Bike variant is required")
    .max(30, "Bike variant name is too long"),
  bikeColor: z
    .string()
    .min(1, "Bike color is required")
    .max(20, "Bike color name is too long"),
  bikeModel: z.number().int().nonnegative().optional(), // Optional field, only positive integers allowed
});

module.exports = { userValidationSchema };
