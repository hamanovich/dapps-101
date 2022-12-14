import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
        Dapps-101
      </h1>
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Blockchain applications
      </h2>
      <ul className="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400">
        <li className="flex items-center text-2xl">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link href="/contracts/01-simple-storage">
            <span className="decoration-indigo-500 underline cursor-pointer hover:no-underline">
              Simple storage
            </span>
          </Link>
        </li>

        <li className="flex items-center text-2xl">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link href="/contracts/02-advanced-storage">
            <span className="decoration-indigo-500 underline cursor-pointer hover:no-underline">
              Advanced storage
            </span>
          </Link>
        </li>

        <li className="flex items-center text-2xl">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link href="/contracts/03-crud">
            <span className="decoration-indigo-500 underline cursor-pointer hover:no-underline">
              CRUD
            </span>
          </Link>
        </li>

        <li className="flex items-center text-2xl">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link href="/contracts/04-ether-wallet">
            <span className="decoration-indigo-500 underline cursor-pointer hover:no-underline">
              Ether Wallet
            </span>
          </Link>
        </li>

        <li className="flex items-center text-2xl">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link href="/contracts/in_progress_05-escrow">
            <span className="decoration-indigo-500 underline cursor-pointer hover:no-underline">
              Escrow (in progress)
            </span>
          </Link>
        </li>

        <li className="flex items-center text-2xl">
          <svg
            className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <Link href="/contracts/06-rock-paper-scissors">
            <span className="decoration-indigo-500 underline cursor-pointer hover:no-underline">
              Rock, Paper &amp; Scissors
            </span>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Home;
