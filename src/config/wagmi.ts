import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { localhost, mainnet } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, localhost],
  connectors: [],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [localhost.id]: http(),
  },
});
