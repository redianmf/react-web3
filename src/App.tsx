import { useEffect, useRef, useState } from "react";
import Toast, { ToastType } from "./components/Toast";

function App() {
  const firstLoad = useRef(true);
  const [walletAccount, setWalletAcccount] = useState<string>("");
  const ethereum = window?.ethereum;

  const checkWalletExist = async () => {
    if (!ethereum) {
      Toast.fire({
        icon: ToastType.ERROR,
        title: "Please install Metamask",
      });
    } else {
      console.log("Wallet detected");
    }

    if (firstLoad.current) return;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts?.length !== 0) {
      setWalletAcccount(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!ethereum) {
      Toast.fire({
        icon: ToastType.ERROR,
        title: "Please install Metamask",
      });
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAcccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    firstLoad.current = false;
    checkWalletExist();
  }, []);

  // useEffect(() => {
  //   const switchAccount = (accounts: string[]) => {
  //     setWalletAcccount(accounts[0]);
  //   };
  //   ethereum.on("accountsChanged", switchAccount);

  //   // to unsubscribe
  //   // ethereum.removeListener("accountsChanged", logAccounts);

  //   ethereum.on("disconnect", () => {
  //     setWalletAcccount("");
  //   });
  // }, [ethereum]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <section className="w-full bg-purple-800 p-3 flex justify-between items-center">
        <h1 className="text-white text-3xl font-mono font-bold">Header</h1>
        {walletAccount ? (
          <button
            disabled
            className="border rounded-lg p-2 font-semibold font-mono bg-white text-purple-800 mr-2"
          >
            Wallet Connected
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="border rounded-lg p-2 text-white font-semibold font-mono hover:bg-white hover:text-purple-800"
          >
            Connect wallet
          </button>
        )}
      </section>
      <section className="flex-1 flex justify-center items-center">
        <div>
          <h1 className="text-white text-4xl font-mono font-bold">
            Test web3 project
          </h1>
        </div>
      </section>
    </div>
  );
}

export default App;
