import { useEffect, useState } from "react";
import { Connector } from "wagmi";

interface IButtonWalletProvider {
  connector: Connector;
  handleConnectWallet: () => void;
}

const ButtonWalletProvider: React.FC<IButtonWalletProvider> = ({
  connector,
  handleConnectWallet,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <button
      disabled={!ready}
      onClick={handleConnectWallet}
      className="bg-purple-800 rounded-lg px-3 py-2 w-full text-white font-semibold font-mono hover:bg-white hover:text-purple-800 transition-colors duration-500"
    >
      {connector.name}
    </button>
  );
};

export default ButtonWalletProvider;
