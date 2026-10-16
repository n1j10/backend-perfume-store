const { z } = require("zod");

// Ported from utils/schema.ts (reviewSchema). The author fields are gone:
// they now come from the logged-in Clerk user.
const reviewSchema = z.object({
  productId: z.string().min(1, "معرّف المنتج مطلوب"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "يجب ألا يقل التقييم عن 1")
    .max(5, "يجب ألا يزيد التقييم عن 5"),
  comment: z
    .string()
    .trim()
    .min(10, "يجب أن يتكون التعليق من 10 أحرف على الأقل")
    .max(100, "يجب ألا يتجاوز التعليق 100 حرف"),
});

module.exports = { reviewSchema };
