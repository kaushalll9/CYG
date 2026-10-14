-- CipherChat Database Schema (PostgreSQL)
-- Phase 0 & Beyond: End-to-End Encrypted Messaging Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Cryptographic Identity & Public Keys Table
-- Notice: NO private keys or shared secrets are EVER stored on the server!
CREATE TABLE IF NOT EXISTS user_keys (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    identity_public_key TEXT NOT NULL,       -- Base64/SPKI Ed25519 Public Key
    key_fingerprint VARCHAR(128) NOT NULL,   -- SHA-256 Fingerprint for out-of-band verification
    ecdh_public_key TEXT,                   -- Base64/SPKI X25519 Public Key
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_a VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_conversation_participants UNIQUE (user_a, user_b)
);

-- 4. Encrypted Messages Table
-- Stores ONLY ciphertext, nonce/IV, authentication tag, sequence number, and digital signature.
-- The server has ZERO capability to read plaintext content.
CREATE TABLE IF NOT EXISTS encrypted_messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ciphertext TEXT NOT NULL,                -- AES-256-GCM encrypted payload (Base64)
    iv TEXT NOT NULL,                        -- 96-bit AES-GCM Nonce / IV (Base64)
    auth_tag TEXT NOT NULL,                  -- 128-bit GCM Authentication Tag (Base64)
    sequence_number BIGINT NOT NULL,         -- Monotonic sequence counter for replay protection
    sender_signature TEXT NOT NULL,          -- Ed25519 signature over ciphertext + sequence + headers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON encrypted_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(user_a, user_b);
