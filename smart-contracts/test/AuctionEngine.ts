import { BlockTag } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

/*
 * utils
 */

async function getTimestamp(bn: BlockTag) {
  return (await ethers.provider.getBlock(bn)).timestamp;
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

describe("AuctionEngine", () => {
  let owner: SignerWithAddress;
  let buyer: SignerWithAddress;
  let seller: SignerWithAddress;
  let auction: Contract;

  const _DURATION = 60;
  const _ITEM = "item";
  const _PRICE = ethers.utils.parseEther("0.0001");

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    const AuctionEngine = await ethers.getContractFactory(
      "AuctionEngine",
      owner
    );
    auction = await AuctionEngine.deploy();
    await auction.deployed();
  });

  it("sets owner", async () => {
    const currentOwner = await auction.owner();
    expect(currentOwner).to.eq(owner.address);
  });

  describe("createAuction", () => {
    it("creates auction correctly", async () => {
      const tx = await auction.createAuction(
        ethers.utils.parseEther("0.0001"),
        3,
        _ITEM,
        _DURATION
      );

      const cAuction = await auction.auctions(0);
      expect(cAuction.item).to.eq(_ITEM);
      const ts = await getTimestamp(tx.blockNumber);
      expect(cAuction.endsAt).to.eq(ts + _DURATION);
    });
  });

  describe("buy", () => {
    it("allows to buy", async function () {
      ethers.utils.parseEther("0.0001");
      await auction.connect(seller).createAuction(_PRICE, 3, _ITEM, _DURATION);

      this.timeout(5000);
      await delay(1000);

      const buyTx = await auction.connect(buyer).buy(0, { value: _PRICE });

      const { finalPrice } = await auction.auctions(0);
      await expect(() => buyTx).to.changeEtherBalance(
        seller,
        finalPrice - Math.floor((finalPrice * 10) / 100)
      );

      await expect(buyTx)
        .to.emit(auction, "AuctionEnded")
        .withArgs(0, finalPrice, buyer.address);
    });
  });
});
