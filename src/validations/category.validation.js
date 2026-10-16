const { z } = require("zod");

// Ported from utils/schema.ts (categorySchema).
const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "يجب أن يتكون اسم القسم من حرفين على الأقل")
    .max(50, "يجب ألا يتجاوز اسم القسم 50 حرفًا"),

  description: z
    .string()
    .trim()
    .max(300, "يجب ألا يتجاوز الوصف 300 حرف")
    .optional(),
});

const updateCategorySchema = categorySchema.partial();

module.exports = { categorySchema, updateCategorySchema };
