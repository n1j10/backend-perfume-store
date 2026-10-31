<div align="center">

# 🌸 Perfume Store API

### E-commerce REST API with Clerk auth and QiCard card payments

![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white) ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white) ![S3](https://img.shields.io/badge/S3-storage-569A31?style=for-the-badge&logo=amazons3&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**[📦 Source](https://github.com/n1j10/backend-perfume-store)**

</div>

---

## ✨ Overview

A REST API for a perfume store with **Clerk** authentication and **QiCard** online payments. Images are stored on **Neon Object Storage** (S3-compatible).

The code follows a **layered architecture** (routes → middlewares → controllers → services → models → Prisma), which keeps business logic testable and keeps controllers out of the database. It runs as a normal server locally and as a **Vercel serverless function** in production (`api/index.js`).

```mermaid
flowchart LR
  C[Client] --> MW[helmet · CORS · rate limit]
  MW --> R[routes]
  R --> V[validate · Zod]
  V --> A[auth]
  A --> CT[controllers]
  CT --> S[services]
  S --> M[models]
  M --> DB[(PostgreSQL)]
  S --> PG[QiCard]
  S --> ST[Neon Storage (S3)]
```

## 🔐 Security

Security was designed in from the start:

| Area | Implementation |
| --- | --- |
| Authentication | Clerk session tokens verified by `@clerk/express`. The admin is identified by `ADMIN_USER_ID`, and CORS is restricted to the client origin |
| Rate limiting | Global limit of 300 requests per minute per IP |
| Uploads | Explicit image MIME allow-list (JPEG, PNG, WebP, GIF, AVIF; **SVG is rejected**), 1 MB limit, server-generated file names and extensions |
| Validation | Zod validates body, query and params; cart quantities must be 1–100 |
| Hardening | `helmet` headers, body size limits, `trust proxy` for correct client IPs, `X-Powered-By` disabled |
| Error handling | One central error handler; internal errors are never shown to clients in production |
| Payments | Status **and amount** are confirmed with QiCard server-to-server; neither the browser nor the webhook body is trusted. Optional RSA signature, and settlement is Serializable and idempotent |

> Secrets are stored only in environment variables. `.env*` is git-ignored, and `.env.example` contains placeholders only.

---

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

## 👤 Author

**n1j10**, full-stack engineer (Next.js · TypeScript · Node.js · PostgreSQL)

[![GitHub](https://img.shields.io/badge/GitHub-n1j10-181717?style=for-the-badge&logo=github)](https://github.com/n1j10)

> If you find this project useful, a ⭐ on the repo is appreciated.
