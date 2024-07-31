import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { mainnet } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
  },
});
