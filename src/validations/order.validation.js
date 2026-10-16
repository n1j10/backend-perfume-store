const { z } = require("zod");

// No productId means "buy everything in the cart".
const createOrderSchema = z.object({
  productId: z.string().min(1, "معرّف المنتج غير صالح").optional(),
});

module.exports = { createOrderSchema };
