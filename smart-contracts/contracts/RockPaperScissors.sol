// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Deployed at 0xFfe06BC9d6980c424533800ACF3eEF3BF8b8fd1b

contract RockPaperScissors {
    enum State {
        IDLE,
        CREATED,
        JOINED,
        COMMITED,
        REVEALED,
        ENDED
    }
    struct Game {
        uint256 id;
        uint256 bet;
        address payable[] players;
        State state;
    }

    struct Move {
        bytes32 hash;
        uint256 value;
    }
    mapping(uint256 => Game) public games;
    uint256[] public gamesLib;
    mapping(uint256 => mapping(address => Move)) public moves;
    mapping(uint256 => uint256) public winningMoves;
    uint256 public gameId;

    constructor() {
        winningMoves[1] = 3;
        winningMoves[2] = 1;
        winningMoves[3] = 2;
    }

    function getGame(uint256 _gameId)
        external
        view
        returns (
            uint256,
            uint256,
            address[] memory,
            State
        )
    {
        for (uint256 i; i < gamesLib.length; i++) {
            if (gamesLib[i] == _gameId) {
                Game storage game = games[_gameId];
                address[] memory players = new address[](2);
                players[0] = game.players[0];
                players[1] = game.players[1];

                return (game.id, game.bet, players, game.state);
            }
        }

        revert("Game with id was not found");
    }

    function createGame(address payable participant) external payable {
        require(msg.value > 0, "have to send some ether");
        address payable[] memory players = new address payable[](2);
        players[0] = payable(msg.sender);
        players[1] = participant;

        games[gameId] = Game(gameId, msg.value, players, State.CREATED);
        gamesLib.push(gameId);
        gameId++;
    }

    function joinGame(uint256 _gameId) external payable {
        Game storage game = games[_gameId];
        require(msg.sender == game.players[1], "sender must be second player");
        require(msg.value >= game.bet, "not enough ether sent");
        require(game.state == State.CREATED, "game must be in CREATED state");

        if (msg.value > game.bet) {
            (bool sent, ) = msg.sender.call{value: msg.value - game.bet}("");
            require(sent, "Failed to send Ether");
        }

        game.state = State.JOINED;
    }

    function commitMove(
        uint256 _gameId,
        uint256 moveId,
        uint256 salt
    ) external {
        Game storage game = games[_gameId];

        require(game.state == State.JOINED, "game must be in JOINED state");
        require(
            msg.sender == game.players[0] || msg.sender == game.players[1],
            "can only be called by one of players"
        );
        require(moves[_gameId][msg.sender].hash == 0, "move already made");
        require(
            moveId == 1 || moveId == 2 || moveId == 3,
            "move needs to be 1, 2 or 3"
        );

        moves[_gameId][msg.sender] = Move(
            keccak256(abi.encodePacked(moveId, salt, msg.sender)),
            0
        );

        if (
            moves[_gameId][game.players[0]].hash != 0 &&
            moves[_gameId][game.players[1]].hash != 0
        ) {
            game.state = State.COMMITED;
        }
    }

    function revealMove(
        uint256 _gameId,
        uint256 moveId,
        uint256 salt
    ) external {
        Game storage game = games[_gameId];
        Move storage move1 = moves[_gameId][game.players[0]];
        Move storage move2 = moves[_gameId][game.players[1]];
        Move storage moveSender = moves[_gameId][msg.sender];

        require(game.state == State.COMMITED, "game must be in COMMITED state");
        require(
            msg.sender == game.players[0] || msg.sender == game.players[1],
            "can only be called by one of players"
        );
        require(
            moveSender.hash ==
                keccak256(abi.encodePacked(moveId, salt, msg.sender)),
            "moveId does not match commitment"
        );

        moveSender.value = moveId;

        if (move1.value != 0 && move2.value != 0) {
            if (move1.value == move2.value) {
                (bool sent1, ) = game.players[0].call{value: game.bet}("");
                require(sent1, "Failed to send Ether");
                (bool sent2, ) = game.players[1].call{value: game.bet}("");
                require(sent2, "Failed to send Ether");
                game.state = State.REVEALED;
                return;
            }

            address payable winner;
            winner = winningMoves[move1.value] == move2.value
                ? game.players[0]
                : game.players[1];
            (bool sentWinner, ) = winner.call{value: 2 * game.bet}("");
            require(sentWinner, "Failed to send Ether");
            game.state = State.REVEALED;
        }
    }
}
