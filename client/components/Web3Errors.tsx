import { useMetaMask } from "metamask-react";
import { NextPage } from "next";
import { PropsWithChildren } from "react";
import Loader from "../components/Loader";

const Web3Errors: NextPage<PropsWithChildren> = ({ children }) => {
  const { status, chainId, connect, account, switchChain } = useMetaMask();

  if (status === "initializing" || status === "connecting") {
    return <Loader />;
  }

  if (status === "unavailable") {
    return (
      <div
        className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
        role="alert"
      >
        <span className="font-medium">MetaMask not available :(</span>
      </div>
    );
  }

  if (status === "notConnected") {
    return (
      <button
        type="button"
        onClick={connect}
        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      >
        Connect to MetaMask
      </button>
    );
  }

  if (
    chainId !== process.env.NEXT_PUBLIC_CHAIN_ID &&
    chainId !== process.env.NEXT_PUBLIC_GOERLI_CHAIN_ID
  ) {
    return (
      <button
        type="button"
        onClick={() => switchChain(process.env.NEXT_PUBLIC_CHAIN_ID as string)}
        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      >
        Switch to valid network
      </button>
    );
  }

  return <>{children}</>;
};

export default Web3Errors;
