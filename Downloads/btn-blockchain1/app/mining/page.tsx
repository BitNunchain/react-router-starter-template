"use client";

import { MiningDashboard } from "../../components/mining-dashboard";
import { useEffect, useState } from "react";
import { Blockchain } from "../../lib/blockchain";
import { MiningEngine } from "../../lib/mining";

export default function MiningPage() {
  const [miningEngine, setMiningEngine] = useState<MiningEngine | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const blockchain = new Blockchain();
      setMiningEngine(new MiningEngine(blockchain));
    }
  }, []);

  return miningEngine ? <MiningDashboard miningEngine={miningEngine} /> : null;
}
