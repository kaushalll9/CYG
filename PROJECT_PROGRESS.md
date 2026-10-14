# CipherChat E2EE — Project Progress & Roadmap Tracker

## 1. Project Overview
- **Project Name:** CipherChat (End-to-End Encrypted Chat Application)
- **Target Course:** College Cryptography Course Project & Viva Evaluation
- **Primary Goal:** Real-time messaging where two users (Alice & Bob) communicate with authenticated end-to-end encryption, while the intermediate relay server and database persist only ciphertext payloads with zero decryption capability.

---

## 2. Current Status
- **Current Phase:** Phase 0 — Planning & Project Setup (**COMPLETED**)
- **Next Phase:** Phase 1 — Basic Chat Application (Frontend, Socket.IO, DB integration)

---

## 3. Completed Features (Phase 0)
- [x] Initialized Git repository and configured `.gitignore` (ignoring secrets, node_modules, build outputs).
- [x] Scaffolding of React + Vite frontend with Tailwind CSS 3 and Lucide icons.
- [x] Scaffolding of Node.js + Express + Socket.IO backend relay server.
- [x] PostgreSQL connection pool manager (`pg`) configured with `.env` / `DATABASE_URL` support and graceful connection checks.
- [x] Defined complete relational database schema (`schema.sql`) for users, public identity keys, conversations, and encrypted messages.
- [x] Implemented automated test suite harness utilizing Node.js native test runner (`node:test`).
- [x] Unified root execution scripts in `package.json` (`npm run dev`, `npm test`, `npm run build:client`, `npm run db:init`).

---

## 4. Implemented & Planned Cryptographic Algorithms

| Primitive | Purpose | Algorithm / Standard | Status |
| :--- | :--- | :--- | :---: |
| **Key Agreement** | Derive shared secret over insecure channel | ECDH over Curve25519 (X25519) | Planned (Phase 2) |
| **Key Derivation** | Derive uniform symmetric keys from shared secret | HKDF-SHA256 (RFC 5869) | Planned (Phase 2) |
| **Message Encryption** | Confidentiality & tamper-proof authenticity | AES-256-GCM (96-bit nonce, 128-bit tag) | Planned (Phase 2) |
| **Digital Signatures** | Identity authenticity & MITM prevention | Ed25519 (EdDSA) | Planned (Phase 2) |
| **Key Verification** | Out-of-band identity check / fingerprinting | SHA-256 Key Fingerprints | Planned (Phase 2) |
| **Replay Protection** | Prevent retransmission of captured payloads | Monotonic Sequence Numbers + Message IDs | Planned (Phase 3) |

---

## 5. Architectural Decisions

1. **Zero-Knowledge Backend Relay:**
   - The server routes WebSocket messages and stores records in PostgreSQL.
   - The server **NEVER** holds private identity keys, ephemeral private keys, or derived symmetric AES keys.
   - Message payloads are encrypted purely on the sender's device and decrypted purely on the recipient's device.

2. **Native Web Crypto & Node Crypto APIs:**
   - Instead of unmaintained custom crypto libraries, we leverage the battle-tested, standard-compliant `Web Crypto API` (browser) and `node:crypto` (server & test harness) for X25519, Ed25519, AES-GCM, and HKDF.

3. **Database Schema Design:**
   - `users`: User profiles.
   - `user_keys`: Public keys only (Ed25519 signing public key, X25519 key exchange public key, SHA-256 fingerprint).
   - `conversations`: Participant mapping.
   - `encrypted_messages`: `ciphertext`, `iv` (nonce), `auth_tag`, `sequence_number`, `sender_signature`.

4. **Graceful Fallback for Local Development:**
   - If local PostgreSQL service requires credentials that haven't been provided yet, the backend reports database status gracefully via `/api/health` without crashing HTTP/Socket.IO connectivity.

---

## 6. Files Created & Modified

### Root
- [`package.json`](file:///Users/kaushalrawat/Desktop/CYG%20Project/package.json): Unified root scripts.
- [`.gitignore`](file:///Users/kaushalrawat/Desktop/CYG%20Project/.gitignore): Ignores node_modules, build outputs, environment files.
- [`PROJECT_PROGRESS.md`](file:///Users/kaushalrawat/Desktop/CYG%20Project/PROJECT_PROGRESS.md): Master continuity and progress log.

### Frontend (`client/`)
- [`client/package.json`](file:///Users/kaushalrawat/Desktop/CYG%20Project/client/package.json): React 19, Vite, Tailwind CSS, Lucide icons, Socket.IO client.
- [`client/tailwind.config.js`](file:///Users/kaushalrawat/Desktop/CYG%20Project/client/tailwind.config.js): Tailwind custom color palette & styling config.
- [`client/postcss.config.js`](file:///Users/kaushalrawat/Desktop/CYG%20Project/client/postcss.config.js): PostCSS processing.
- [`client/src/index.css`](file:///Users/kaushalrawat/Desktop/CYG%20Project/client/src/index.css): Base styling with Tailwind directives.
- [`client/src/App.jsx`](file:///Users/kaushalrawat/Desktop/CYG%20Project/client/src/App.jsx): Phase 0 status dashboard & cryptography roadmap overview.

### Backend (`server/`)
- [`server/package.json`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/package.json): Express, Socket.IO, pg (PostgreSQL), dotenv, cors.
- [`server/.env.example`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/.env.example): Template for database and server port configuration.
- [`server/src/index.js`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/src/index.js): Express server, Socket.IO real-time hub, health check endpoint.
- [`server/src/db/index.js`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/src/db/index.js): PostgreSQL connection manager & health checks.
- [`server/src/db/schema.sql`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/src/db/schema.sql): Complete relational tables for E2EE messaging.
- [`server/src/db/init.js`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/src/db/init.js): Migration runner to initialize database tables.
- [`server/tests/server.test.js`](file:///Users/kaushalrawat/Desktop/CYG%20Project/server/tests/server.test.js): Automated test suite for health check endpoint.

---

## 7. Tests Performed & Results

| Test Suite | Command | Result | Notes |
| :--- | :--- | :---: | :--- |
| **Client Production Build** | `npm run build:client` | **PASS (719ms)** | Vite bundled successfully with 0 lint/type errors. |
| **Backend Health API Test** | `npm test` | **PASS (221ms)** | Verified `/api/health` returns status 200 and JSON metadata. |

---

## 8. Known Issues / Temporary Limitations
- PostgreSQL database credentials are awaiting configuration in `server/.env` if persisting to local DB instance. The server detects and logs status safely.

---

## 9. Next Recommended Task
- **Proceed to Phase 1: Basic Chat Application**
  - Implement two-user session picker / login in React.
  - Implement the chat room and messaging UI.
  - Connect Socket.IO client to server for real-time message exchange.
  - Validate message transport before introducing the cryptographic layer.
