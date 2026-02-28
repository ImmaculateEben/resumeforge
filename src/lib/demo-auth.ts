export interface DemoUser {
  email: string;
  fullName?: string;
}

const DEMO_USER_KEY = "resumeforge_demo_user";
export const DEMO_AUTH_EVENT = "resumeforge-auth-changed";

function emitDemoAuthChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
}

export function saveDemoUser(user: DemoUser): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  emitDemoAuthChange();
}

export function loadDemoUser(): DemoUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(DEMO_USER_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as DemoUser;

    if (!parsed.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearDemoUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(DEMO_USER_KEY);
  emitDemoAuthChange();
}
