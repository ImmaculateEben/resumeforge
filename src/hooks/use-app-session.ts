"use client";

import { useEffect, useState } from "react";
import { DEMO_AUTH_EVENT, clearDemoUser, loadDemoUser } from "@/lib/demo-auth";
import { supabase } from "@/lib/supabase";

export type AppSession =
  | {
      kind: "guest";
      email: null;
      displayName: "Guest";
    }
  | {
      kind: "demo";
      email: string;
      displayName: string;
    }
  | {
      kind: "supabase";
      email: string;
      displayName: string;
    };

const GUEST_SESSION: AppSession = {
  kind: "guest",
  email: null,
  displayName: "Guest",
};

function getDemoSession(): AppSession | null {
  const demoUser = loadDemoUser();

  if (!demoUser) {
    return null;
  }

  return {
    kind: "demo",
    email: demoUser.email,
    displayName: demoUser.fullName?.trim() || demoUser.email,
  };
}

async function getSupabaseSession(): Promise<AppSession | null> {
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user?.email) {
    return null;
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";

  return {
    kind: "supabase",
    email: user.email,
    displayName: fullName.trim() || user.email,
  };
}

export async function getCurrentAppSession(): Promise<AppSession> {
  const currentSupabaseSession = await getSupabaseSession();

  if (currentSupabaseSession) {
    return currentSupabaseSession;
  }

  return getDemoSession() ?? GUEST_SESSION;
}

export async function signOutAppSession(): Promise<void> {
  clearDemoUser();

  if (supabase) {
    await supabase.auth.signOut();
  }
}

export function useAppSession() {
  const [session, setSession] = useState<AppSession>(GUEST_SESSION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const nextSession = await getCurrentAppSession();

      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setIsLoading(false);
    };

    void syncSession();

    const handleDemoAuthChange = () => {
      void syncSession();
    };

    window.addEventListener(DEMO_AUTH_EVENT, handleDemoAuthChange);

    const authSubscription = supabase
      ? supabase.auth.onAuthStateChange(() => {
          void syncSession();
        }).data.subscription
      : null;

    return () => {
      isMounted = false;
      window.removeEventListener(DEMO_AUTH_EVENT, handleDemoAuthChange);
      authSubscription?.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
  };
}
