import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import ABI from "../../public/contracts/RockPaperScissors.sol/RockPaperScissors.json";
import Loader from "../../components/Loader";

const STATES = ["IDLE", "CREATED", "JOINED", "COMMITED", "REVEALED"];

const RockPaperScissors: NextPage = () => {
  const { status, account } = useMetaMask();

  const [accounts, setAccounts] = useState<string[]>([]);
  const [contract, setContract] = useState<ethers.Contract>();
  const [game, setGame] = useState<any>({ state: "0" });
  const [move, setMove] = useState<any>();

  useEffect(() => {
    const getContract = async () => {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_06_CONTRACT as string,
        ABI.abi,
        new ethers.providers.Web3Provider(window.ethereum).getSigner()
      );
      setContract(contract);
    };

    const getAccounts = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      setAccounts(accounts);
    };

    if (status === "connected") {
      getContract();
      getAccounts();
    }
  }, [status, account]);

  useEffect(() => {
    if (accounts && contract) {
      updateGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, contract]);

  const updateGame = async () => {
    try {
      let gameId = parseInt(await contract?.gameId());
      gameId = gameId > 0 ? gameId - 1 : gameId;
      const [id, bet, players, state] = await contract?.getGame(gameId);

      setGame({
        id: ethers.utils.formatUnits(id, 0),
        bet,
        players,
        state: state.toString(),
      });

      const localMove = JSON.parse(sessionStorage.getItem("MOVE") || "null");
      if (localMove?.id) {
        setMove(localMove);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createGame = async (e) => {
    e.preventDefault();
    const participant = e.target.elements[0].value;
    const bet = e.target.elements[1].value;

    try {
      if (contract && accounts?.length) {
        const tx = await contract.createGame(participant, {
          value: ethers.utils.parseEther(bet),
        });
        await tx.wait();
        await updateGame();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const joinGame = async () => {
    try {
      if (contract) {
        const tx = await contract.joinGame(game.id, {
          value: game.bet,
          gasLimit: 50000,
        });
        await tx.wait();
        await updateGame();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commitMove = async (e) => {
    e.preventDefault();
    const select = e.target.elements[0];
    const moveId = select.options[select.selectedIndex].value;
    const salt = Math.floor(Math.random() * 1000);
    try {
      if (contract) {
        const tx = await contract.commitMove(game.id, moveId, salt, {
          from: accounts[0],
        });
        await tx.wait();
        setMove({ id: moveId, salt });
        sessionStorage.setItem("MOVE", JSON.stringify({ id: moveId, salt }));
        await updateGame();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const revealMove = async () => {
    try {
      if (contract) {
        const tx = await contract.revealMove(game.id, move.id, move.salt, {
          from: accounts[0],
        });
        await tx.wait();
        setMove(undefined);
        sessionStorage.removeItem("MOVE");
        await updateGame();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetGame = () => {
    setGame({ state: "0" });
  };

  if (typeof game.state === "undefined") {
    return <Loader />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Rock, Paper &amp; Scissors</h1>

      <p className="mb-1 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Account: {account}
      </p>

      <p className="mb-3 text-lg font-light text-gray-500 md:text-xl dark:text-gray-400">
        Contract address: {process.env.NEXT_PUBLIC_06_CONTRACT}
      </p>

      <p className="text-xl font-bold mb-4">
        State: {STATES[Number(game.state)]}
      </p>

      {game.state === "1" && (
        <>
          <p>Bet: {ethers.utils.formatEther(game.bet.toString())} ETH</p>
          <div>
            <h2>Players</h2>
            <ul>
              {game?.players?.map((player: string) => (
                <li key={player}>{player}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* {(game.state === "0" || game.state === "4") && ( */}
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-xl font-bold mb-4">Create Game</h2>
            <form onSubmit={createGame}>
              <div className="mb-3">
                <label
                  htmlFor="participant"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Participant
                </label>
                <input
                  type="text"
                  id="participant"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="bet"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Bet
                </label>
                <input
                  type="text"
                  id="bet"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      {/* )} */}

      {game.state === "1" &&
        game?.players[1].toLowerCase() === accounts[0]?.toLowerCase() && (
          <div className="row">
            <div className="col-sm-12">
              <h2 className="text-xl font-bold mb-4">Bet</h2>
              <button
                onClick={joinGame}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </div>
          </div>
        )}

      {game.state === "2" && (
        <div className="row">
          <div className="col-sm-12">
            <h2 className="text-xl font-bold mb-4">Commit move</h2>
            <form onSubmit={commitMove}>
              <div className="mb-3">
                <label
                  htmlFor="move"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Move
                </label>
                <select
                  id="move"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option defaultValue="-1">Choose a move</option>
                  <option value="1">Rock</option>
                  <option value="2">Paper</option>
                  <option value="3">Scissors</option>
                </select>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {game.state === "3" && (
        <>
          <h2 className="text-xl font-bold mb-4">Reveal move</h2>
          <button
            onClick={revealMove}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            See Result
          </button>
          <div className="mt-3">
            <button
              onClick={resetGame}
              className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Reset Game
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default RockPaperScissors;
