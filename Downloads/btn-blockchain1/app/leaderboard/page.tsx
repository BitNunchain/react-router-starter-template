"use client";

import { Leaderboard } from "../../components/leaderboard";
import { useEffect, useState } from "react";
import { Blockchain } from "../../lib/blockchain";

export default function LeaderboardPage() {
  interface BlockchainData {
    nativeStorage: {
      userProfiles: Map<string, Record<string, unknown>>;
    };
    getBalance: (address: string) => number;
  }
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const blockchain = new Blockchain();
      // Extract only plain objects and functions
      setBlockchainData({
        nativeStorage: blockchain.getNativeStorage(),
        getBalance: (address: string) => blockchain.getBalance(address)
      });
    }
  }, []);

  return blockchainData ? <Leaderboard blockchain={blockchainData} /> : null;
}
