import React, { useState, useEffect } from 'react';
import { ShieldCheck, Server, Lock, Cpu, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [serverStatus, setServerStatus] = useState({ checking: true, connected: false, message: 'Connecting to backend...' });

  useEffect(() => {
    fetch('http://localhost:5001/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({
          checking: false,
          connected: true,
          message: data.message || 'Connected to Express server',
          dbStatus: data.database
        });
      })
      .catch((err) => {
        setServerStatus({
          checking: false,
          connected: false,
          message: 'Backend server not detected (start server on port 5001)'
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              CipherChat E2EE
            </h1>
            <p className="text-xs text-slate-400">Cryptography Course Project • Phase 0 Initialized</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-2 ${
            serverStatus.connected
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${serverStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{serverStatus.connected ? 'Backend Online' : 'Awaiting Backend'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8">
        {/* Phase 0 Badge */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-md">
                Phase 0 • Setup & Architecture
              </span>
              <h2 className="text-2xl font-bold mt-3 text-slate-100">
                End-to-End Encrypted Messaging Environment
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                The core scaffold has been initialized with React + Vite, Tailwind CSS, Express, Socket.IO, PostgreSQL configuration, and native Web Crypto / Node.js cryptographic primitives.
              </p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          {/* Service Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Frontend Client</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200 mt-2">React 19 + Vite</p>
              <p className="text-xs text-emerald-400/90 mt-0.5">Running & Ready</p>
            </div>

            <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Relay Backend</span>
                </span>
                {serverStatus.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <p className="text-sm font-semibold text-slate-200 mt-2">Node.js Express + Socket.IO</p>
              <p className={`text-xs mt-0.5 ${serverStatus.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                {serverStatus.message}
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Database</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200 mt-2">PostgreSQL</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {serverStatus.dbStatus ? `Status: ${serverStatus.dbStatus}` : 'Configured (schema ready)'}
              </p>
            </div>
          </div>
        </div>

        {/* Cryptography Roadmap Blueprint */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/40 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
            <span>Cryptographic Architecture (To Be Implemented in Upcoming Phases)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="text-emerald-400 font-medium">1. ECDH Key Agreement (X25519)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Alice and Bob compute a shared secret over an insecure channel without transmitting the secret itself or letting the relay server see it.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="text-cyan-400 font-medium">2. Key Derivation (HKDF-SHA256)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts pseudorandom keys from the raw ECDH shared secret to derive cryptographically strong, uniform symmetric encryption keys.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="text-teal-400 font-medium">3. Authenticated Encryption (AES-256-GCM)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Encrypts plaintext messages with confidentiality and provides a 128-bit authentication tag to immediately catch tampering and forgery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="text-indigo-400 font-medium">4. Digital Signatures & Replay Defense</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ed25519 signatures authenticate key exchanges against Man-In-The-Middle (MITM) attacks, paired with monotonic counters/nonces against replay.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        CipherChat • College Cryptography Project • Ready for Phase 1
      </footer>
    </div>
  );
}
