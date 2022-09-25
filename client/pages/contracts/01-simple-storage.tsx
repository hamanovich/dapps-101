import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";

import ABI from "../../public/contracts/SimpleStorage.sol/SimpleStorage.json";
import Loader from "../../components/Loader";

const DEPLOY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const SimpleStorage: NextPage = () => {
  const { status, chainId, connect, account, switchChain } = useMetaMask();

  const [input, setInput] = useState<undefined | string>("");
  const [contractData, setContractData] = useState("");

  useEffect(() => {
    const getAndSetContractData = async () => {
      const SimpleStorageContract = new ethers.Contract(
        DEPLOY_ADDRESS,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );
      const data = await SimpleStorageContract.getData();
      setContractData(data);
    };

    if (status === "connected") getAndSetContractData();
  }, [status]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const SimpleStorageContract = new ethers.Contract(
        DEPLOY_ADDRESS,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      const tx = await SimpleStorageContract.setData(input?.toString());
      await tx.wait();
      const data = await SimpleStorageContract.getData();
      setContractData(data);
      setInput(undefined);
    } catch (error) {
      console.error(error);
    }
  };

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

  if (chainId !== process.env.NEXT_PUBLIC_CHAIN_ID) {
    return (
      <button
        type="button"
        onClick={() => switchChain(process.env.NEXT_PUBLIC_CHAIN_ID as string)}
        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      >
        Switch to Localhost network
      </button>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Simple Storage</h1>

      <p className="mb-3 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Account: {account}
      </p>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="setDataInput"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Set the data
          </label>
          <input
            type="number"
            id="setDataInput"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={input || ""}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>

      {contractData && (
        <p className="text-2xl font-black text-gray-900">
          Data from blockchain:{" "}
          <span className="text-blue-700">{contractData}</span>
        </p>
      )}
    </>
  );
};

export default SimpleStorage;