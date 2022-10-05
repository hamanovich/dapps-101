import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
import { BigNumber, ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import ABI from "../../public/contracts/Escrow.sol/Escrow.json";

const Escrow: NextPage = () => {
  const { status, account } = useMetaMask();

  const [deposit, setDeposit] = useState("");
  const [balance, setBalance] = useState("");
  const [accountBalance, setAccountBalance] = useState<BigNumber>();
  const [sendto, setSendto] = useState("");
  const [sendvalue, setSendvalue] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_05_CONTRACT as string,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );
      const balance = await contract.balanceOf();
      setBalance(balance);

      await getAccountBalance(account as string);
    };

    if (status === "connected") getBalance();
  }, [status, account]);

  const getAccountBalance = async (address: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    setAccountBalance(balance);
  };

  const handleDepositChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDeposit(e.target.value);
  };

  const handleSendtoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSendto(e.target.value);
  };

  const handleSendvalueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSendvalue(e.target.value);
  };

  const handleDepositSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_05_CONTRACT as string,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      const tx = await contract.deposit({
        from: account,
        value: ethers.utils.parseEther(deposit),
      });

      await tx.wait();
      const balance = await contract.balanceOf();
      setBalance(balance);
      setDeposit("");
      getAccountBalance(account as string);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendtoSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_05_CONTRACT as string,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      const tx = await contract.sendTo(sendto, {
        value: ethers.utils.parseEther(sendvalue as string),
      });

      await tx.wait();

      setSendto("");
      setSendvalue("");
      getAccountBalance(account as string);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Escrow</h1>

      <p className="mb-1 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Account: {account}
      </p>

      {accountBalance && (
        <p className="mb-5 text-lg font-light text-gray-900 md:text-xl dark:text-gray-800">
          Account Balance:{" "}
          <span className="font-bold">
            {ethers.utils.formatEther(accountBalance)} ETH
          </span>
        </p>
      )}
      <p className="mb-3 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Contract address: {process.env.NEXT_PUBLIC_05_CONTRACT}
      </p>

      {balance && (
        <p className="mb-5 text-lg font-light text-gray-900 md:text-xl dark:text-gray-800">
          Contract balance:{" "}
          <span className="font-bold">
            {ethers.utils.formatEther(balance)} ETH
          </span>
        </p>
      )}

      <h2 className="text-xl font-bold mb-4">Deposit</h2>

      <form onSubmit={handleDepositSubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="deposit"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Deposit
          </label>
          <input
            type="number"
            id="deposit"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={deposit || ""}
            onChange={handleDepositChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Transfer
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Send To</h2>

      <form onSubmit={handleSendtoSubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="sendto"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            To
          </label>
          <input
            type="text"
            id="sendto"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={sendto || ""}
            onChange={handleSendtoChange}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="sendvalue"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            value
          </label>
          <input
            type="text"
            id="sendvalue"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={sendvalue || ""}
            onChange={handleSendvalueChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Send
        </button>
      </form>
    </>
  );
};

export default Escrow;
