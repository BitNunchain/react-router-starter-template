"use client";
import { UserProfile } from "../../components/user-profile";
import { useEffect, useState } from "react";
import { Blockchain } from "../../lib/blockchain";

export default function UserProfilePage() {
  const [blockchain, setBlockchain] = useState<Blockchain | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBlockchain(new Blockchain());
    }
  }, []);

  return blockchain
    ? (
        <UserProfile
          blockchain={blockchain}
          mining={{ getHashRate: () => 0 }}
        />
      )
    : null;
}
