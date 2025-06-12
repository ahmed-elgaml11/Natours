# Natours 🏞️

A full-featured Tour Booking API built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, **Stripe**, **Cloudinary**, and more.

---

## 🚀 Features

## 🔐 Authentication & Authorization

- JWT-based authentication (stateless)
- Sign up, log in, forgot/reset, update password
- Role-based access control: `user`, `guide`, `lead-guide`, `admin`
- Protected routes via middleware

### 🏕️ Tours
- CRUD operations (admin/lead-guide only)
- API FEATURES: Filtering, sorting, pagination, field selection
- Statistical endpoints:
  - `/top-5-tours`, `/tour-stats`, `/monthly-plan/:year`
- Geospatial queries:
  - `/tours-within/...`, `/distances/...`
- Upload tour images to Cloudinary using `multer` + `sharp`

### 💳 Bookings
- Stripe checkout integration via `/checkout-session/:tourId`
- Users can book tours
- Admin/lead-guide can manage bookings
- Booking records stored in MongoDB

### 📝 Reviews
- Users can add/edit/delete reviews for tours they've booked
- Admins can delete any review

### ✅ Server-Side Validation
- Schema validation with **Zod**


### 📤 File Uploads
- Tour and user image uploads processed with `multer` + `sharp`
- Stored in Cloudinary

### 📧 Email Support
- Nodemailer with Mailtrap for development
- Gmail for production emails

### 🧱 Error Handling
- Custom `AppError` and `catchAsync` wrappers
- Centralized `globalErrorHandler` middleware

### 🛡️ Security & Middleware
- Helmet, rate limiting, prevent parameter pollution
- Data sanitization: NoSQL injection & XSS

### 🧱 Design Patterns
- Handler Factory 
---

## 🧰 Tech Stack

| Layer               | Tools & Libraries                          |
|---------------------|--------------------------------------------|
| Server              | Node.js, Express, TypeScript               |
| DB                  | MongoDB, Mongoose                          |
| Auth & Authz        | JWT, bcrypt, role-based middleware         |
| Payments            | Stripe checkout, `checkoutSession`         |
| Image Upload        | Multer, Sharp, Cloudinary                  |
| Emails              | Nodemailer (dev), Gmail (prod)             |
| Security            | Helmet, rate-limit, xss-clean, sanitizers  |
| Docs                | Swagger UI + JSDoc                         |
| Server-side Validation | Zod                                     |

---

## 📁 Project Structure

```bash
src/
├── api/
│   ├── users/        # (services, models, schemas, controllers, routes) for auth and users
│   ├── tours/        # CRUD, stats, geospatial
│   ├── bookings/     # Stripe checkout + bookings
│   ├── reviews/      # Reviews logic
│   └── index.ts      # Root API index
├── utils/
│   ├── catchAsync/       # Async error handler
│   ├── queryFeatures/    # Filtering, sorting, etc.
│   ├── AppError/         # Error class
│   ├── swagger/          # Swagger setup
│   ├── cloudinary/       # File upload to cloudinary
│   ├── email/            # Mailer logic
│   ├── handlerFactory/   # Design pattern abstraction
│   └── jwt/              # Auth helpers
├── middlewares/          # Protect, restrict, cloudinary, validation
├── views/emails/         # Email templates (welcome, reset)
├── types/                # Custom types
├── data/                 # Seed data (JSON)
├── docs/                 # Swagger documentation per module
├── app.ts                # Main express app
├── index.ts              # Entry point
└── db.ts                 # DB connection logic

```

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ahmed-elgaml11/Natours.git
cd Natours
```

###  Install dependencies
```bash
npm install
```




### 3. Create a config.env file and add the following:

```bash
DATABASE=<MongoDB_URI>
JWT_SECRET=...
JWT_EXPIRESIN=...
COOKIE_EXPIRESIN=...

EMAIL_HOST=.....
EMAIL_PORT=....
EMAIL_USERNAME=...
EMAIL_PASSWORD=....
EMAIL_FROM=.....

GMAIL_USERNAME=.....
GMAIL_PASSWORD=.....

CLOUD_NAME=......
CLOUDINARY_API_KEY=.....
CLOUDINARY_API_SECRET=.........

STRIPE_SECRET_KEY=......
STRIPE_PUBLIC_KEY=.....
```






### 4. Run the server locally
```bash
npm run dev
```




### 5. Access endpoints and API documentation

API Root: http://localhost:3000/api/v1/

Swagger UI: http://localhost:3000/api-docs
