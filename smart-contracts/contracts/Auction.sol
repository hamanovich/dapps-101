// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error AuctionEngine__Create(
    uint256 startingPrice,
    uint256 currentPrice,
    string message
);

contract AuctionEngine {
    address public immutable owner;
    uint256 constant DURATION = 2 days;
    uint256 constant FEE = 10; // %
    struct Auction {
        address payable seller;
        uint256 startingPrice;
        uint256 finalPrice;
        uint256 startAt;
        uint256 endsAt;
        uint256 discountRate;
        string item;
        bool stopped;
    }
    Auction[] public auctions;

    event AuctionCreated(
        uint256 index,
        string itemName,
        uint256 startingPrice,
        uint256 duration
    );
    event AuctionEnded(uint256 index, uint256 finalPrice, address winner);

    constructor() {
        owner = msg.sender;
    }

    function createAuction(
        uint256 _startingPrice,
        uint256 _discountRate,
        string calldata _item,
        uint256 _duration
    ) external {
        uint256 duration = _duration == 0 ? DURATION : _duration;

        if (_startingPrice < _discountRate & duration) {
            revert AuctionEngine__Create({
                startingPrice: _startingPrice,
                currentPrice: _discountRate,
                message: "Incorrect starting price"
            });
        }

        auctions.push(
            Auction({
                seller: payable(msg.sender),
                startingPrice: _startingPrice,
                finalPrice: _startingPrice,
                discountRate: _discountRate,
                startAt: block.timestamp,
                endsAt: block.timestamp + duration,
                item: _item,
                stopped: false
            })
        );

        emit AuctionCreated(
            auctions.length - 1,
            _item,
            _startingPrice,
            duration
        );
    }

    function getPriceFor(uint256 index) public view returns (uint256) {
        Auction storage cAuction = auctions[index];
        require(!cAuction.stopped, "stopped!");
        uint256 elapsed = block.timestamp - cAuction.startAt;
        uint256 discount = cAuction.discountRate * elapsed;
        return cAuction.startingPrice - discount;
    }

    function stop(uint256 index) external {
        auctions[index].stopped = true;
    }

    function buy(uint256 index) external payable {
        Auction storage cAuction = auctions[index];
        require(!cAuction.stopped, "stopped!");
        require(block.timestamp < cAuction.endsAt, "ended!");
        uint256 cPrice = getPriceFor(index);
        require(msg.value >= cPrice, "not enough funds!");
        cAuction.stopped = true;
        cAuction.finalPrice = cPrice;

        uint256 refund = msg.value - cPrice;
        if (refund > 0) {
            (bool sentToBuyer, ) = payable(msg.sender).call{value: refund}("");
            require(sentToBuyer, "Failed to send Ether");
        }

        (bool sentToSeller, ) = cAuction.seller.call{
            value: cPrice - ((cPrice * FEE) / 100)
        }("");
        require(sentToSeller, "Failed to send Ether");

        emit AuctionEnded(index, cPrice, msg.sender);
    }
}
