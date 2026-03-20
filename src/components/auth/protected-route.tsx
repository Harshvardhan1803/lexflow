"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LexLoader } from "@/components/ui/loader";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for login status (relying on user object)
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      // Not logged in, redirect to landing/login
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const role = (user.role || "User").toLowerCase();
      
      // Role-based protection: Settings is Admin only
      if (pathname.startsWith("/dashboard/settings") && role !== "admin") {
        router.push("/dashboard");
        return;
      }
      
      // AI Discovery is Admin/Specialist only
      if (pathname.startsWith("/dashboard/ai") && role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setAuthorized(true);
    } catch (e) {
      console.error("Auth check failed:", e);
      router.push("/");
    }
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <LexLoader label="Authenticating Secure Session..." />
      </div>
    );
  }

  return <>{children}</>;
}
