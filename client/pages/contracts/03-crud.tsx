import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import type { NextPage } from "next";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";

import ABI from "../../public/contracts/CRUD.sol/CRUD.json";

const DEPLOY_ADDRESS = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

const CRUD: NextPage = () => {
  const { account } = useMetaMask();

  const [username, setUsername] = useState<undefined | string>("");
  const [error, setError] = useState<string>("");
  const [id, setId] = useState<undefined | string>("");
  const [destroyId, setDestroyId] = useState<undefined | string>("");
  const [updateId, setUpdateId] = useState<undefined | string>("");
  const [updateName, setUpdateName] = useState<undefined | string>("");
  const [user, setUser] = useState<{ id: number | null; name: string }>();

  const handleCreateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleReadChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleDestroyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestroyId(e.target.value);
  };

  const handleUpdateIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateId(e.target.value);
  };

  const handleUpdateNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateName(e.target.value);
  };

  const handleCreateSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const CRUDContract = new ethers.Contract(
        DEPLOY_ADDRESS,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      await CRUDContract.create(username);
      setUsername(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDestroySubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const CRUDContract = new ethers.Contract(
        DEPLOY_ADDRESS,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      await CRUDContract.destroy(destroyId);
    } catch (error) {
      setError("User doesn't exist!");
      console.error(error);
    }
  };

  const handleReadSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const CRUDContract = new ethers.Contract(
        DEPLOY_ADDRESS,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      const [userId, name] = await CRUDContract.read(id);
      setUser({ id: Number(userId), name });
      setError("");
    } catch (error) {
      setUser(undefined);
      setError("User doesn't exist!");
      console.error(error);
    }
  };

  const handleUpdateSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const CRUDContract = new ethers.Contract(
        DEPLOY_ADDRESS,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );

      const tx = await CRUDContract.update(updateId, updateName);
      await tx.wait();
      const [userId, name] = await CRUDContract.read(updateId);
      console.log("!!!", userId, name);
      setUser({ id: Number(userId), name });
      setError("");
    } catch (error) {
      setUser(undefined);
      setError("User doesn't exist!");
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">CRUD</h1>

      <p className="mb-1 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Account: {account}
      </p>

      <p className="mb-3 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Contract address: {DEPLOY_ADDRESS}
      </p>

      {(user?.id || error) && (
        <div className="p-6 mb-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          {user?.id && (
            <p className="text-xl text-white">
              User with ID <span className="font-bold">#{user.id}</span> has
              name <span className="font-bold">{user.name}</span>
            </p>
          )}

          {error && (
            <div
              className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>
      )}

      <h1 className="text-xl font-bold mb-4">Create</h1>

      <form onSubmit={handleCreateSubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="createName"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            User name
          </label>
          <input
            type="string"
            id="createName"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={username || ""}
            onChange={handleCreateChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Create
        </button>
      </form>

      <h1 className="text-xl font-bold mb-4">Read</h1>

      <form onSubmit={handleReadSubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="readName"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            User id
          </label>
          <input
            type="number"
            id="readName"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={id || ""}
            onChange={handleReadChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Read
        </button>
      </form>

      <h1 className="text-xl font-bold mb-4">Destroy</h1>

      <form onSubmit={handleDestroySubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="destroyId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            User id
          </label>
          <input
            type="number"
            id="destroyId"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={destroyId || ""}
            onChange={handleDestroyChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Delete
        </button>
      </form>

      <h1 className="text-xl font-bold mb-4">Update</h1>

      <form onSubmit={handleUpdateSubmit} className="mb-10">
        <div className="mb-3">
          <label
            htmlFor="updateId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            User id
          </label>
          <input
            type="number"
            id="updateId"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={updateId || ""}
            onChange={handleUpdateIdChange}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="updateName"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            User name
          </label>
          <input
            type="text"
            id="updateName"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            value={updateName || ""}
            onChange={handleUpdateNameChange}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Update
        </button>
      </form>
    </>
  );
};

export default CRUD;
