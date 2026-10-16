const { z } = require("zod");

const addItemSchema = z.object({
  productId: z.string().min(1, "معرّف المنتج مطلوب"),
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
});

const updateItemSchema = z.object({
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
});

module.exports = { addItemSchema, updateItemSchema };
