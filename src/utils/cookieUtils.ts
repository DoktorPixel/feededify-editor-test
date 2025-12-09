// src/utils/cookieUtils.ts
export type SameSiteOption = "Lax" | "Strict" | "None";
export type CookieOptions = {
  expires?: number | Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSiteOption;
};

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const cookies = document.cookie ? document.cookie.split(";") : [];

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      const rawValue = cookie.substring(nameEQ.length);
      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }

  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") {
    console.warn("setCookie called in non-browser environment");
    return;
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (typeof options.maxAge === "number") {
    cookieString += `; Max-Age=${Math.floor(options.maxAge)}`;
  } else if (options.expires !== undefined) {
    let expiresDate: Date;
    if (typeof options.expires === "number") {
      expiresDate = new Date();
      expiresDate.setTime(
        expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000
      );
    } else {
      expiresDate = options.expires;
    }
    cookieString += `; Expires=${expiresDate.toUTCString()}`;
  }

  cookieString += `; Path=${options.path ?? "/"}`;

  if (options.domain) {
    cookieString += `; Domain=${options.domain}`;
  }

  const defaultSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = options.secure ?? defaultSecure;
  if (secure) {
    cookieString += "; Secure";
  }

  const sameSite = options.sameSite ?? "Lax";

  if (sameSite === "None" && !secure) {
    console.warn(
      "Setting SameSite=None without Secure may be rejected by browsers"
    );
  }
  cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
}

export function deleteCookie(
  name: string,
  options: { path?: string; domain?: string } = {}
): void {
  setCookie(name, "", {
    path: options.path ?? "/",
    domain: options.domain,
    expires: new Date(0),
    secure: false,
  });
}
