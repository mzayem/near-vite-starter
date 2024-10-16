import React, { useEffect } from "react";
import { create as createStore } from "zustand";
import { NETWORK_ID, SOCIAL_CONTRACT } from "../config";
import { Wallet } from "../lib/near-wallet";
import { NetworkId } from "@near-wallet-selector/core";
import { GUESTBOOK_CONTRACT } from "@/lib/guestbook";

interface StoreState {
  wallet: Wallet | undefined;
  signedAccountId: string;
  networkId: NetworkId;
  setNetworkId: (networkId: NetworkId) => void;
  setWallet: (wallet: Wallet) => void;
  setSignedAccountId: (signedAccountId: string) => void;
}

// Store to share wallet and signed account
export const useWallet = createStore<StoreState>((set) => ({
  wallet: undefined,
  signedAccountId: "",
  networkId: NETWORK_ID,
  setNetworkId: (networkId: NetworkId) => set({ networkId }),
  setWallet: (wallet: Wallet) => set({ wallet }),
  setSignedAccountId: (signedAccountId: string) => {
    return set({ signedAccountId });
  }
}));

type NearProviderProps = {
  children: React.ReactNode;
};

const getNearContract = (networkId: NetworkId) => GUESTBOOK_CONTRACT[networkId];

export default function NearProvider({ children }: NearProviderProps) {
  const { setWallet, setSignedAccountId, networkId } = useWallet();

  useEffect(() => {
    const wallet = new Wallet({
      createAccessKeyFor: getNearContract(networkId as NetworkId),
      networkId: networkId as NetworkId
    });
    wallet.startUp((accountId: string) => setSignedAccountId(accountId));

    setWallet(wallet);
  }, [networkId]);

  return <>{children}</>;
}
