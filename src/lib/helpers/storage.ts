export const getStorageKey = (key: string, userId?: string) => {
  if (userId) return `user:${userId}:${key}`;
  return `guest:${key}`;
};

export const setStorageItem = (key: string, value: string, userId?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(key, userId), value);
};

export const getStorageItem = (key: string, userId?: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(getStorageKey(key, userId));
};

export const removeStorageItem = (key: string, userId?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getStorageKey(key, userId));
};
