import { ethers } from "ethers";
import {
  Connector,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import {
  connectBrowserProvider,
  useEthersProvider,
} from "../hooks/useEthersProvider";

import { SwapWidget } from "@uniswap/widgets";
// import "@uniswap/widgets/fonts.css";

import ButtonWalletProvider from "../components/ButtonWalletProvider";
import Toast, { ToastType } from "../components/Toast";

import { FormatTypes, Interface } from "ethers/lib/utils";
import { formatAbi } from "abitype";
import artifact from "./TestSwap.json";
import { tokenList } from "./tokenList";

const mappedTokenList = tokenList.map((item) => ({
  chainId: item.chainId,
  address: item.address,
  name: item.name,
  decimals: item.decimals,
  symbol: item.symbol,
  logoURI: item.logoURI,
}));

const CONTRACT_ADDRESS = "0x58AA941Ba0568DF0886B6eC41233cFe94bF32178";

const dummyAbi = [
  "function deposit() public payable",
  "function withdraw(uint256 _amount)",
  "function checkAssets() public view returns(uint256)",
];

const Home = () => {
  // const abi = new Interface(artifact.abi);
  // const formattedAbi = abi.format(FormatTypes.full);
  const formattedAbi = formatAbi(artifact.abi)
  // console.log({ abi, formattedAbi });

  const chainId = useChainId();
  const { isConnected, address, connector } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const provider = useEthersProvider({ chainId });
  // console.log(provider, "provider");
  const account = provider?.getSigner();
  console.log(address, "acc");

  const { data: name } = useEnsName({ address });
  const { data: avatar } = useEnsAvatar({ name: name! });

  const buyToken = async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, formattedAbi, provider); // Instantiate the contract
    const signer = provider.getSigner(); // Assumes Metamask or similar is injected in the browser
    const contractWithSigner = contract.connect(await signer);


    try {
      const tx = await contractWithSigner.swapWETHForDAI(
        ethers.utils.parseEther("10").toString(),
        {
          gasLimit: ethers.utils.hexlify(1000000),
          gasPrice: ethers.utils.hexlify(1000),
        }
      );

      await tx.wait();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnectWallet = (connector: Connector) => {
    connect(
      { connector, chainId },
      {
        onSuccess() {
          // Sync with ethers
          connectBrowserProvider();

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
      <button onClick={buyToken}>buy DAI token</button>
      <section className="flex-1 flex justify-center items-center">
        <div>
          <h1 className="text-white text-4xl font-mono font-bold mb-3">
            Test web3 project
          </h1>
          {/* {isConnected && (
            <div className="Uniswap">
              <SwapWidget provider={provider} tokenList={mappedTokenList} />
            </div>
          )} */}
          {/* {isConnected && (
            <div>
              <iframe
                src="https://app.uniswap.org/#/swap?outputCurrency=0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
                height="660px"
                width="100%"
                id="myId"
              />
            </div>
          )} */}
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
