"use client";
import { SmartContractsDashboard } from "../../components/smart-contracts-dashboard";
import { useEffect, useState } from "react";
import { Blockchain } from "../../lib/blockchain";
import { NFTEngine } from "../../lib/nft-engine";
import { SmartContractEngine } from "../../lib/smart-contracts";

export default function NFTPage() {
  const [contractEngine, setContractEngine] = useState<SmartContractEngine | null>(null);
  const [nftEngine, setNftEngine] = useState<NFTEngine | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const blockchain = new Blockchain();
      setContractEngine(new SmartContractEngine(blockchain));
      setNftEngine(new NFTEngine(blockchain));
    }
  }, []);


  return <SmartContractsDashboard contractEngine={contractEngine} nftEngine={nftEngine} />;
}
