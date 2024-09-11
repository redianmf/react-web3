import { ethers, providers } from "ethers";
import { useMemo } from "react";
import type { Chain, Client, Transport } from "viem";
import { Config, useClient } from "wagmi";

const clientToProvider = (
  client: Client<Transport, Chain>
): providers.JsonRpcProvider => {
  const { chain, transport } = client;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback") {
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    ) as unknown as providers.JsonRpcProvider;
  }

  return new providers.JsonRpcProvider(transport.url, network);
};

export const useEthersProvider = ({
  chainId,
}: { chainId?: number | undefined } = {}) => {
  const client = useClient<Config>({ chainId });

  const provider = useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client]
  );

  return provider;
};

export const connectBrowserProvider = async () => {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();
  console.log(signer, "signer");
};
