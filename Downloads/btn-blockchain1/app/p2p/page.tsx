"use client";

import { P2PNetworkDashboard } from "../../components/p2p-network-dashboard";
import { useEffect, useState } from "react";
import { Blockchain } from "../../lib/blockchain";
import { P2PNetwork } from "../../lib/p2p";

export default function P2PPage() {
  const [p2pNetwork, setP2PNetwork] = useState<P2PNetwork | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const blockchain = new Blockchain();
      setP2PNetwork(new P2PNetwork(blockchain));
    }
  }, []);

  return p2pNetwork ? <P2PNetworkDashboard p2pNetwork={p2pNetwork} /> : null;
}
