import {
  Connector,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import ButtonWalletProvider from "../components/ButtonWalletProvider";
import Toast, { ToastType } from "../components/Toast";

const Home = () => {
  const chainId = useChainId();
  const { isConnected, address, connector } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: name } = useEnsName({ address });
  const { data: avatar } = useEnsAvatar({ name: name! });

  const handleConnectWallet = (connector: Connector) => {
    connect(
      { connector, chainId },
      {
        onSuccess() {
          Toast.fire({
            title: "Success connect to wallet",
            icon: ToastType.SUCCESS,
          });
        },
        onError(error) {
          const errMessage =
            "shortMessage" in error ? error.shortMessage : error.message;
          Toast.fire({
            title: errMessage,
            icon: ToastType.ERROR,
          });
        },
      }
    );
  };

  const formattedAddress = () => {
    if (!address) return null;
    return `${address.slice(0, 6)}…${address.slice(38, 42)}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <section className="w-full bg-purple-800 p-3 flex justify-between items-center">
        <h1 className="text-white text-3xl font-mono font-bold">Header</h1>
        {isConnected && (
          <div className="flex items-center gap-3">
            <div className="text-white ">
              {avatar && <img alt="ENS Avatar" src={avatar} />}
              {address ? (
                <p>
                  {name ? `${name} ${formattedAddress()}` : formattedAddress()}
                </p>
              ) : (
                <p>Connected</p>
              )}
              <p className=" text-center font-semibold">{connector?.name}</p>
            </div>
            <button
              onClick={() => disconnect()}
              className="border rounded-lg p-2 font-semibold font-mono bg-white text-purple-800 mr-2"
            >
              Disconnect
            </button>
          </div>
        )}
      </section>
      <section className="flex-1 flex justify-center items-center">
        <div>
          <h1 className="text-white text-4xl font-mono font-bold mb-3">
            Test web3 project
          </h1>
          {!isConnected && (
            <div>
              {connectors.map((connector) => (
                <ButtonWalletProvider
                  connector={connector}
                  handleConnectWallet={() => handleConnectWallet(connector)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
