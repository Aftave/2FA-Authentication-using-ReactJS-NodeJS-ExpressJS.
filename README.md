# 2FA Authentication (ReactJS + NodeJS + ExpressJS + MongoDB)

A full‑stack example that layers **Two‑Factor Authentication (2FA)** on top of a username/password login. The repository is organized as a **monorepo** with a React front end and a Node/Express back end connected to MongoDB.

---

## Table of contents

- [Project structure](#project-structure)
- [What’s inside (high level)](#whats-inside-high-level)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
  - [Backend ](#backend-env)[`.env`](#backend-env)
  - [Client ](#client-env)[`.env`](#client-env)
- [How the auth + 2FA flow works](#how-the-auth--2fa-flow-works)
- [API overview (typical endpoints)](#api-overview-typical-endpoints)
- [Running the app](#running-the-app)
- [Troubleshooting](#troubleshooting)

---

## Project structure

```
2FA-Authentication-using-ReactJS-NodeJS-ExpressJS
├── Backend/        # Node.js + Express API (MongoDB)
└── Client/         # React application (login / 2FA UI)
```

> The codebase is primarily JavaScript with a small amount of HTML/CSS.

---

## What’s inside (high level)

**Backend (Express + MongoDB)**

- User registration & login with password hashing.
- 2FA step (OTP/TOTP verification) layered after password login.
- Session and/or JWT based auth (based on provided secrets in `.env`).
- MongoDB for users and OTP/2FA state.

**Client (React)**

- Screens for register, login, and 2FA input.
- Calls the backend for signup/login and for 2FA verification.

---

## Local setup

### 1) Clone and install

```bash
# clone
git clone https://github.com/Aftave/2FA-Authentication-using-ReactJS-NodeJS-ExpressJS.
cd 2FA-Authentication-using-ReactJS-NodeJS-ExpressJS.

# backend deps
cd Backend
npm install

# client deps
cd ../Client
npm install
```

### 2) Create environment files

Create `Backend/.env` and (optionally) `Client/.env` based on the samples below.

### 3) Run in development

In **two terminals** (one for API, one for UI):

```bash
# terminal 1 → backend
cd Backend
npm run dev     # or: npm start

# terminal 2 → client
cd Client
npm run dev     # Vite-style
# or: npm start # CRA-style
```

By default, the backend uses port **7001**. The client dev server usually runs on **5173** (Vite) or **3000** (CRA). Adjust the client base URL accordingly.

---

## Environment variables

### Backend `.env`

Create `Backend/.env` with the following keys:

```env
# HTTP port for Express
PORT=7001

# Session secret used if the server issues session cookies
SESSION_SECRET="ADD YOUR SESSION SECRET"

# MongoDB connection string (MongoDB Atlas or local)
CONNECTION_STRING="ADD YOUR MONGO DB CONNECTION STRING"

# Secret used to sign JWTs if token auth is enabled
JWT_SECRET="ADD YOUR JSON WEB TOKEN (JWT) SECRET"
```

> **Security:** Never commit this file. Rotate any credential that has ever been pushed.

### Client `.env`

If the frontend needs a base URL for the API, use one of the following (depending on the tooling):

```bash
# If the client is built with Create React App
REACT_APP_API_BASE_URL=http://localhost:7001

# If the client is built with Vite
VITE_API_BASE_URL=http://localhost:7001
```

Use the appropriate variable in your API client code.

---

## How the auth + 2FA flow works

1. **Register** → user submits email/username + password. Password is hashed and stored in MongoDB.
2. **Login (step 1)** → user enters credentials; server validates and issues a *pending‑2FA* state (e.g., short‑lived token or server session).
3. **2FA (step 2)** → user provides the one‑time code (from email/SMS **or** from an authenticator app if TOTP is enabled).
4. **On success** → server establishes a logged‑in session (cookie) and returns a JWT to the client.

> OTP delivery and TOTP setup vary by configuration. If using TOTP, the server typically exposes an endpoint to generate a secret and QR code during setup and stores the shared secret for future verification.

---

## API overview (typical endpoints)

> Endpoint names can differ; update this section if you change routes. These examples illustrate a common 2FA design.

**Auth basics**

```
POST   /api/auth/register        { email, password }
POST   /api/auth/login           { email, password }  → returns pending 2FA token or sets a temp session
POST   /api/auth/logout          (requires auth)
```

**2FA lifecycle**

```
# If using email/SMS OTP
POST   /api/2fa/send             → sends a one‑time code (rate limited)
POST   /api/2fa/verify           { code } → completes login

# If using TOTP (authenticator apps)
POST   /api/2fa/setup            → returns { otpauth_url, base32Secret }
POST   /api/2fa/enable           { code } → confirms TOTP and enables on the account
POST   /api/2fa/verify           { code } → completes login (or sensitive action)
POST   /api/2fa/reset          { password?, code? } → removes TOTP after re‑auth
```


---

## Running the app

- **Backend:**
  - `npm run dev` if using nodemon; otherwise `npm start`.
  - Server listens on `PORT` (default `7001`).
- **Client:**
  - `npm run dev` (Vite) or `npm start` (CRA).
  - Configure the API base URL to point at the backend.

---

## Troubleshooting

- **CORS errors**: Check the frontend base URL and the server CORS config.
- **Network errors from the client**: Confirm the backend is listening on `PORT` and reachable from the client dev server.
- **JWT/session confusion**: Ensure either cookie or header‑based auth is wired consistently; don’t mix both unless intentional (e.g., session for 2FA step, JWT post‑login).
- **MongoDB connection**: Verify `CONNECTION_STRING` and IP allowlist in Atlas.

---

### License

If you intend to publish this, add a `LICENSE` file (e.g., MIT) and reference it here.

