# Book Store API (Express)

REST API ported from the Next.js server actions in
[`utils/actions`](https://github.com/n1j10/book-store/tree/main/utils/actions).

## Layers

```
routes  ->  middlewares (auth / validate / upload)  ->  controllers  ->  services  ->  models  ->  Prisma
```

- **routes** – URLs only.
- **controllers** – read `req`, call a service, send the response. No business logic.
- **services** – the logic ported from the actions (cart totals, orders, favorite toggle, QiCard payments).
- **models** – every Prisma query lives here, so no controller touches the database directly.

```
src/
├── app.js
├── server.js
├── config/        index.js (env vars), db.js (Prisma client)
├── routes/        index.js + one file per feature
├── controllers/
├── services/      + image.service.js (Neon Storage), qicard.service.js (payment gateway)
├── models/
├── middlewares/   auth, validate, upload, error
├── utils/         ApiError, apiResponse, asyncHandler
└── validations/   Zod schemas ported from utils/schema.ts
tests/
```

## Setup

```bash
npm install
cp .env.example .env     # then fill in the values
npx prisma migrate dev --name init
npm run dev
```

If you use the same database as the Next.js project (tables already exist), skip the migrate step.

## Auth

Users stay in Clerk, because the schema stores `clerkId`. The frontend sends the Clerk session token:

```
Authorization: Bearer <token from getToken()>
```

The admin is the user whose id equals `ADMIN_USER_ID`.

## Endpoints

| Method | Path | Auth | Ported from |
| --- | --- | --- | --- |
| GET | `/api/users/me` | user | `getAuthUser` |
| GET | `/api/categories` | – | `fetchAllCategories` |
| GET | `/api/categories/admin` | admin | `fetchAdminCategories` |
| GET | `/api/categories/:id` | – | `fetchSingleCategory` |
| POST | `/api/categories` | admin | `createCategoryAction` (multipart, field `image`) |
| PATCH | `/api/categories/:id` | admin | `updateCategoryAction` |
| PATCH | `/api/categories/:id/image` | admin | `updateCategoryImageAction` |
| DELETE | `/api/categories/:id` | admin | `deleteCategoryAction` |
| GET | `/api/products` | – | `fetchAllProducts` (`?search=&categoryId=`) |
| GET | `/api/products/featured` | – | `fetchFeaturedProducts` |
| GET | `/api/products/mine` | admin | `fetchAdminPosts` |
| GET | `/api/products/:id` | – | `fetchSingleProduct` |
| POST | `/api/products` | admin | `createProductAction` (multipart, field `image`) |
| PATCH | `/api/products/:id` | admin | `updateProductAction` |
| PATCH | `/api/products/:id/image` | admin | `updateProductImageAction` |
| DELETE | `/api/products/:id` | admin | `deleteProductAction` |
| GET | `/api/cart` | user | `fetchOrCreateCart` + `updateCart` |
| GET | `/api/cart/count` | optional | `fetchCartItems` |
| POST | `/api/cart/items` | user | `addToCartAction` |
| PATCH | `/api/cart/items/:itemId` | user | `updateCartItemAction` |
| DELETE | `/api/cart/items/:itemId` | user | `removeCartItemAction` |
| POST | `/api/orders` | user | `createOrderAction` (`productId` optional, without it buys the cart) |
| POST | `/api/orders/:id/pay` | user | `payOrderAction` |
| GET | `/api/orders` | user | `fetchUserOrders` |
| GET | `/api/orders/all` | admin | `fetchAdminOrders` |
| GET | `/api/payments/callback` | QiCard | `api/payment/callback` |
| POST | `/api/payments/webhook` | QiCard | `api/payment/webhook` |
| POST | `/api/reviews` | user | `creatReviewAction` |
| GET | `/api/reviews` | – | `fetchAllReviews` |
| GET | `/api/reviews/product/:productId` | – | `fetchProductReview` |
| GET | `/api/favorites` | user | `fetchUserFav` |
| GET | `/api/favorites/status/:productId` | optional | `fetchFavoritID` |
| POST | `/api/favorites/toggle/:productId` | user | `toggleFavAction` |

Every response has the same shape:

```json
{ "success": true, "message": "Success", "data": {} }
```

## Payment flow

1. `POST /api/orders` returns `{ order, paymentUrl }`. The frontend redirects the user to `paymentUrl`.
2. After paying, QiCard sends the user to `/api/payments/callback`.
3. The API asks QiCard for the real status, marks the order as paid, deletes the bought cart,
   then redirects to `CLIENT_URL/payment-result?status=success|failed`.

## What changed from the Next.js version

| Next.js | Express |
| --- | --- |
| `currentUser()` / `getAuthUser` / `getAdminUser` | `@clerk/express` + `authenticate` / `requireAdmin` |
| `utils/neon-storage.ts` | `image.service.js` (same Neon Storage bucket) |
| `lib/qicard.ts` + `api/payment/*` routes | `qicard.service.js` + `payment.service.js` + `/api/payments/*` |
| `redirect(paymentUrl)` | the API returns `paymentUrl` as JSON |
| `revalidatePath` / `redirect` | nothing – the API just returns JSON |
| `renderError` returning `{ message }` | thrown `ApiError` handled by `error.middleware.js` |
| `validateFuctionSchema` | `validate.middleware.js` (same Zod schemas) |

Fixes made while porting:

- `featured: z.coerce.boolean()` turned the form value `"false"` into `true`.
- Creating a product and changing its image only needed a logged-in user; now admin only.
- Buying the cart charged only the first item; now one order holds the full cart total.
- Review author name and image come from Clerk, not from the request body.
- The webhook only trusts the status returned by QiCard, not the one in the request body.
- A product's `categoryId` is the real category id, not the category title.

## Tests

```bash
npm test
```
