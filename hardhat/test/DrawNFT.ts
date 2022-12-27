import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers as eethers } from 'ethers';
import { ethers } from 'hardhat';

describe('DrawNFT', function () {
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

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

  describe('Mint NFT', function () {
    const signMessage = async (
      drawNft: any,
      otherAccount: any
    ): Promise<eethers.Signature> => {
      const signer = eethers.Wallet.fromMnemonic(
        process.env.SIGNER_MNEMONIC || ''
      );

      const message = `${await drawNft.readNonce(
        otherAccount.address
      )}${otherAccount.address.toLocaleLowerCase()}`;

      // message to sign
      const messageHash = eethers.utils.id(message);
      const messageHashArray = eethers.utils.arrayify(messageHash);

      // sign hashed message
      const signature = await signer.signMessage(messageHashArray);

      // split signature
      return eethers.utils.splitSignature(signature);
    };

    it('Should get invalid signature error', async function () {
      const signature = {
        v: 27,
        s: '0x0f06a6856f57d89afea6243563042bd71496a1815ba90a2206cd729d27353a6c',
        r: '0xa0fa76ea6d5d7c7a4ec31a46021f3ba076e1c1f1bc061fa13765a3a34f24ce4a',
      };
      const { drawNft } = await loadFixture(deployContract);
      await expect(
        drawNft.safeMint('metaDataUri', signature, {
          value: ethers.utils.parseEther('0.04'),
        })
      ).to.be.revertedWith('The provided signature is invalid.');
    });

    it('Should get invalid funds error', async function () {
      const { drawNft, otherAccount } = await loadFixture(deployContract);
      const signature = await signMessage(drawNft, otherAccount);
      const messageVerifyAttributes = {
        v: signature.v,
        s: signature.s,
        r: signature.r,
      };

      await expect(
        drawNft
          .connect(otherAccount)
          .safeMint('metaDataUri', messageVerifyAttributes, {
            value: ethers.utils.parseEther('0.01'),
          })
      ).to.be.revertedWith(
        'Insufficient ETH has been transmitted. The minimum required amount to mint an NFT is 0.04 ETH.'
      );
    });

    it('Should mint the NFT', async function () {
      const { drawNft, otherAccount, owner } = await loadFixture(
        deployContract
      );
      const signature = await signMessage(drawNft, otherAccount);
      const messageVerifyAttributes = {
        v: signature.v,
        s: signature.s,
        r: signature.r,
      };

      await expect(
        drawNft
          .connect(otherAccount)
          .safeMint('metaDataUri', messageVerifyAttributes, {
            value: ethers.utils.parseEther('0.04'),
          })
      )
        .to.emit(drawNft, 'MintedNft')
        .withArgs(1);

      expect(await drawNft.readNonce(otherAccount.address)).to.equal('1');
      expect(await drawNft.readNonce(owner.address)).to.equal('0');
    });

    it('Should mint the NFT and owner withdraw the fees', async function () {
      const { drawNft, otherAccount, owner } = await loadFixture(
        deployContract
      );
      const signature = await signMessage(drawNft, otherAccount);
      const messageVerifyAttributes = {
        v: signature.v,
        s: signature.s,
        r: signature.r,
      };

      await drawNft
        .connect(otherAccount)
        .safeMint('metaDataUri', messageVerifyAttributes, {
          value: ethers.utils.parseEther('0.04'),
        });

      const ownerPrevBalance = await owner.getBalance();
      await drawNft.connect(owner).withdrawMintPayments();
      const ownerAfterBalance = await owner.getBalance();

      expect(
        eethers.utils.formatEther(ownerAfterBalance.sub(ownerPrevBalance))
      ).to.equal('0.039948463983347392');
    });
  });
});
