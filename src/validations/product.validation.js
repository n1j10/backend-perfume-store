const { z } = require("zod");

// Form data sends booleans as strings, and z.coerce.boolean() would turn "false" into true.
const toBoolean = (value) => value === true || value === "true" || value === "on";

// Ported from utils/schema.ts (productSchema).
const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, "يجب أن يتكون الاسم من 4 أحرف على الأقل")
    .max(30, "يجب ألا يتجاوز الاسم 30 حرفًا"),

  description: z.string().refine((description) => {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 10 && wordCount <= 500;
  }, "يجب أن يتراوح الوصف بين 10 و500 كلمة"),

  price: z.coerce.number().int().min(0, "يجب أن يكون السعر رقمًا موجبًا"),

  featured: z.preprocess(toBoolean, z.boolean()),

  categoryId: z.string().min(1, "يرجى اختيار القسم"),
});

const updateProductSchema = productSchema.partial();

const listProductsSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
});

module.exports = { productSchema, updateProductSchema, listProductsSchema };
