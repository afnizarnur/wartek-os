// src/core/lib/storage.js

const STORAGE_PREFIX = 'wartek.';

export function getItem(key, defaultValue = null) {
  const fullKey = STORAGE_PREFIX + key;
  const stored = localStorage.getItem(fullKey);
  return stored ? JSON.parse(stored) : defaultValue;
}

export function setItem(key, value) {
  const fullKey = STORAGE_PREFIX + key;
  localStorage.setItem(fullKey, JSON.stringify(value));
}

export function removeItem(key) {
  const fullKey = STORAGE_PREFIX + key;
  localStorage.removeItem(fullKey);
}

export function clear() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}
