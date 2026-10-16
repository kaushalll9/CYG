# CipherChat: End-to-End Encrypted (E2EE) Chat Application

> A real-time messaging application demonstrating modern cryptographic primitives: **ECDH (X25519)**, **HKDF-SHA256**, **AES-256-GCM**, and **Ed25519 Digital Signatures**.

---

## 🔒 Security Architecture Overview

In CipherChat, the server acts solely as a **blind relay**. It forwards and persists encrypted packets without having access to the encryption keys needed to read the plaintext.

```
+-----------------------------------------------------------------------------------------+
|                                  END-TO-END FLOW                                        |
+-----------------------------------------------------------------------------------------+

  [ Alice's Client ]                                                [ Bob's Client ]
          |                                                                 |
          |  1. Authenticated Key Exchange (ECDH X25519 + Ed25519)          |
          |<===============================================================>|
          |                                                                 |
          |  2. Shared Secret Derived: K_shared = ECDH(Priv_A, Pub_B)      |
          |     Symmetric Key Derived: K_session = HKDF(K_shared)           |
          |                                                                 |
          |  3. Encrypt: C = AES-256-GCM(K_session, Nonce, Plaintext)       |
          |     Sign:   Sig = Ed25519_Sign(Priv_A, C || Nonce || Seq)       |
          |                                                                 |
          |  4. Transmit Encrypted Payload                                  |
          |     { ciphertext, nonce, auth_tag, seq, sig }                   |
          |-------------------------\                                       |
                                    v                                       |
                         +--------------------+                             |
                         | Relay Server & DB  |                             |
                         | (Zero-Knowledge)   |                             |
                         |  - Cannot decrypt  |                             |
                         |  - Forwards packet |                             |
                         +--------------------+                             |
                                    |                                       |
                                    |  5. Forward Payload                   |
                                    \-------------------------------------->|
                                                                            |
                                               6. Verify Sig: Ed25519       |
                                                  Check Replay: Seq > last  |
                                                  Decrypt: AES-256-GCM      |
                                                  Display: Plaintext        |
```

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, Socket.IO
- **Database:** PostgreSQL (with `schema.sql` supporting users, identity keys, conversations, and ciphertext records)
- **Cryptography:** Native Web Crypto API & Node.js `crypto`
- **Testing:** Node.js built-in automated test runner (`node:test`)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment (Optional)
```bash
cp server/.env.example server/.env
# Edit server/.env with your PostgreSQL credentials if connecting to local PostgreSQL
```

### 3. Run Development Servers
```bash
# Terminal 1: Backend Server (Port 5001)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```

### 4. Run Automated Tests
```bash
npm test
```
# IRE-
