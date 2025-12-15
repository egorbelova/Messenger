export interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export interface AppCookies {
  theme: 'light' | 'dark';
  userId: string;
  preferences: string;
  sessionToken: string;
}

export class CookieManager {
  static get(name: string): string | null {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      console.warn(
        'Document is not available. Are you running on server side?'
      );
      return null;
    }

    try {
      const cookieString = document.cookie;
      if (!cookieString) return null;

      const cookies = cookieString.split(';');

      for (const cookie of cookies) {
        const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
        const cookieValue = cookieValueParts.join('=');

        if (cookieName === name) {
          return decodeURIComponent(cookieValue);
        }
      }
    } catch (error) {
      console.error(`Error getting cookie "${name}":`, error);
    }

    return null;
  }

  static set(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): boolean {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      console.warn(
        'Document is not available. Are you running on server side?'
      );
      return false;
    }

    try {
      if (!name || typeof name !== 'string') {
        throw new Error('Cookie name must be a non-empty string');
      }

      if (typeof value !== 'string') {
        throw new Error('Cookie value must be a string');
      }

      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
        value
      )}`;

      if (options.expires) {
        const expiresDate =
          typeof options.expires === 'number'
            ? new Date(Date.now() + options.expires * 864e5)
            : options.expires;
        cookieString += `; expires=${expiresDate.toUTCString()}`;
      }

      if (options.path) cookieString += `; path=${options.path}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.secure) cookieString += '; secure';
      if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error(`Error setting cookie "${name}":`, error);
      return false;
    }
  }

  static delete(name: string, path?: string, domain?: string): boolean {
    return this.set(name, '', {
      expires: new Date(0),
      path,
      domain,
    });
  }

  static has(name: string): boolean {
    return this.get(name) !== null;
  }

  static getAll(): Record<string, string> {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return {};
    }

    try {
      const cookies: Record<string, string> = {};
      const cookieString = document.cookie;

      if (!cookieString) return cookies;

      cookieString.split(';').forEach((cookie) => {
        const [name, ...valueParts] = cookie.trim().split('=');
        if (name) {
          const decodedName = decodeURIComponent(name);
          const decodedValue = decodeURIComponent(valueParts.join('='));
          cookies[decodedName] = decodedValue;
        }
      });

      return cookies;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  }

  static clearAll(): void {
    const allCookies = this.getAll();
    Object.keys(allCookies).forEach((cookieName) => {
      this.delete(cookieName);
    });
  }
}

export class TypedCookieManager {
  static get<K extends keyof AppCookies>(key: K): AppCookies[K] | null {
    try {
      const value = CookieManager.get(key);

      if (value === null) return null;

      switch (key) {
        case 'theme':
          if (value === 'light' || value === 'dark') {
            return value as AppCookies[K];
          }
          console.warn(`Invalid theme value: ${value}`);
          return null;

        case 'userId':
        case 'preferences':
        case 'sessionToken':
          return value as AppCookies[K];

        default:
          return value as AppCookies[K];
      }
    } catch (error) {
      console.error(`Error getting typed cookie "${key}":`, error);
      return null;
    }
  }

  static set<K extends keyof AppCookies>(
    key: K,
    value: AppCookies[K],
    options: CookieOptions = {}
  ): boolean {
    try {
      switch (key) {
        case 'theme':
          if (value !== 'light' && value !== 'dark') {
            throw new Error(
              `Invalid theme value: ${value}. Must be 'light' or 'dark'`
            );
          }
          break;

        case 'userId':
        case 'sessionToken':
          if (typeof value !== 'string' || !value.trim()) {
            throw new Error(`Invalid ${key} value: must be non-empty string`);
          }
          break;
      }

      return CookieManager.set(key, String(value), {
        secure: true,
        sameSite: 'strict',
        ...options,
      });
    } catch (error) {
      console.error(`Error setting typed cookie "${key}":`, error);
      return false;
    }
  }

  static delete(key: keyof AppCookies): boolean {
    return CookieManager.delete(key);
  }
}

export class SafeCookieUtils {
  static safeGet(name: string, defaultValue: string = ''): string {
    try {
      return CookieManager.get(name) || defaultValue;
    } catch (error) {
      console.warn(`Safe cookie get failed for "${name}":`, error);
      return defaultValue;
    }
  }

  static safeSet(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    try {
      CookieManager.set(name, value, {
        secure: true,
        sameSite: 'lax',
        ...options,
      });
    } catch (error) {
      console.warn(`Safe cookie set failed for "${name}":`, error);
    }
  }

  static getJSON<T>(name: string, defaultValue: T): T {
    try {
      const value = this.safeGet(name);
      if (!value) return defaultValue;

      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`Failed to parse JSON cookie "${name}":`, error);
      return defaultValue;
    }
  }

  static setJSON<T>(name: string, value: T, options: CookieOptions = {}): void {
    try {
      const jsonString = JSON.stringify(value);
      this.safeSet(name, jsonString, options);
    } catch (error) {
      console.warn(`Failed to set JSON cookie "${name}":`, error);
    }
  }
}

export default CookieManager;
