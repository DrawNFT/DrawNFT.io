import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
describe('DrawNFT', function () {
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;

    const DrawNFT = await ethers.getContractFactory('DrawNFT');
    const drawNft = await DrawNFT.deploy();

    return { drawNft, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('Should set the right name and symbol', async function () {
      const { drawNft } = await loadFixture(deployContract);

      expect(await drawNft.name()).to.equal('DrawNFT');
      expect(await drawNft.symbol()).to.equal('DRW');
    });
  });

  describe('Withdrawals', function () {
    it('Should revert with the right error if called from another account', async function () {
      const { drawNft, otherAccount } = await loadFixture(deployContract);
      await expect(
        drawNft.connect(otherAccount).withdrawMintPayments()
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
