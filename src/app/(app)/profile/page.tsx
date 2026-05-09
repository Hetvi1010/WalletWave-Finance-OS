"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearSession } from "@/lib/auth";
import { User } from "@/types";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.getProfile().then(setUser);
  }, []);

  if (!user) {
    return <LoadingSkeleton className="h-80" />;
  }

  return (
    <ProfilePanel
      user={user}
      exportCsv={api.exportCsv()}
      exportPdf={api.exportPdf()}
      onLogout={() => {
        clearSession();
        router.push("/login");
      }}
    />
  );
}
