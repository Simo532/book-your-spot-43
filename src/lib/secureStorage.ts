/**
 * Secure Storage Utility
 * Encrypts/decrypts localStorage values using AES-GCM with Web Crypto API.
 * Uses PBKDF2 key derivation with a device-bound salt.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_KEY = '__ss_salt';
const STORAGE_PREFIX = '__enc_';

// In-memory cache for synchronous reads after init
let memoryCache: Map<string, string> = new Map();
let cryptoKey: CryptoKey | null = null;
let initialized = false;

// Derive a passphrase from browser fingerprint (not bulletproof, but adds entropy)
function getPassphrase(): string {
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `superdoc_${ua}_${lang}_${tz}_v1`;
}

function getSalt(): Uint8Array {
  const existing = localStorage.getItem(SALT_KEY);
  if (existing) {
    return Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, btoa(String.fromCharCode(...salt)));
  return salt;
}

async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const rawKey = encoder.encode(getPassphrase());
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    rawKey.buffer as ArrayBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: getSalt(), iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(plaintext: string): Promise<string> {
  if (!cryptoKey) throw new Error('SecureStorage not initialized');
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    cryptoKey,
    encoded
  );
  // Combine IV + ciphertext into one base64 string
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function decrypt(encoded: string): Promise<string> {
  if (!cryptoKey) throw new Error('SecureStorage not initialized');
  try {
    const raw = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const iv = raw.slice(0, IV_LENGTH);
    const ciphertext = raw.slice(IV_LENGTH);
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      cryptoKey,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    // Tampered or corrupted data — remove it
    return '';
  }
}

export const secureStorage = {
  /** Must be called once before app renders. Populates in-memory cache. */
  async init(): Promise<void> {
    if (initialized) return;
    cryptoKey = await deriveKey();

    // Load all encrypted values into memory cache
    const promises: Promise<void>[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const logicalKey = key.slice(STORAGE_PREFIX.length);
        const raw = localStorage.getItem(key);
        if (raw) {
          promises.push(
            decrypt(raw).then((val) => {
              if (val) memoryCache.set(logicalKey, val);
            })
          );
        }
      }
    }
    await Promise.all(promises);
    initialized = true;
  },

  /** Synchronous read from in-memory cache */
  getItem(key: string): string | null {
    return memoryCache.get(key) ?? null;
  },

  /** Async write — updates memory cache immediately, persists encrypted */
  async setItem(key: string, value: string): Promise<void> {
    memoryCache.set(key, value);
    const encrypted = await encrypt(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
  },

  /** Sync write for critical paths — encrypts in background */
  setItemSync(key: string, value: string): void {
    memoryCache.set(key, value);
    encrypt(value).then((encrypted) => {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
    });
  },

  removeItem(key: string): void {
    memoryCache.delete(key);
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    memoryCache.clear();
  },

  isInitialized(): boolean {
    return initialized;
  },
};
