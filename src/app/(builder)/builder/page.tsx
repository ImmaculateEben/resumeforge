"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function BuilderPage() {
  const router = useRouter();

  useEffect(() => {
    const id = uuidv4();
    router.replace(`/resume/${id}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
      <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}
