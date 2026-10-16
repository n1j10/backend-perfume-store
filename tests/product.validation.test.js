const test = require("node:test");
const assert = require("node:assert/strict");
const { productSchema } = require("../src/validations/product.validation");

const validDescription = Array.from({ length: 12 }, () => "word").join(" ");

const validProduct = {
  name: "Atomic Habits",
  description: validDescription,
  price: "18000",
  featured: "true",
  categoryId: "category-1",
};

test("accepts a valid product", () => {
  const result = productSchema.safeParse(validProduct);

  assert.equal(result.success, true);
  assert.equal(result.data.price, 18000);
  assert.equal(result.data.featured, true);
});

test('reads featured "false" from form data as false', () => {
  const result = productSchema.safeParse({ ...validProduct, featured: "false" });

  assert.equal(result.success, true);
  assert.equal(result.data.featured, false);
});

test("rejects a short name", () => {
  const result = productSchema.safeParse({ ...validProduct, name: "Abc" });

  assert.equal(result.success, false);
});

test("rejects a description with too few words", () => {
  const result = productSchema.safeParse({ ...validProduct, description: "too short" });

  assert.equal(result.success, false);
});

test("rejects a product without a category", () => {
  const result = productSchema.safeParse({ ...validProduct, categoryId: "" });

  assert.equal(result.success, false);
});
