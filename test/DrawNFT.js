const DrawNFT = artifacts.require('DrawNFT');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ethers = require('ethers');

contract('DrawNFT', ([owner, other]) => {
  let drawNFT;
  let signMessage;

  const keys = {
    v: 0x1c,
    r: '0x5e1757e25c7b81b00b5a79b1d8b45762f3b93619c5cf30b2e72c8baef7bf98dd',
    s: '0x2fdbadf3c4e5cec8cdf7c77c22fdf02b13d8f68e7feb5e5a33f2623b8c10564d',
  };

  beforeEach(async () => {
    drawNFT = await DrawNFT.new();
    signMessage = async function () {
      const signer = ethers.Wallet.fromMnemonic(
        process.env.SIGNER_MNEMONIC || ''
      );

      // message to sign
      const message = `${await drawNFT.readNonce(owner)}${owner}`;
      const messageHash = ethers.utils.id(message);
      const messageHashArray = ethers.utils.arrayify(messageHash);

      // sign hashed message
      const signature = await signer.signMessage(messageHashArray);

      // split signature
      return ethers.utils.splitSignature(signature);
    };
  });

  // check that only the contract owner can withdraw mint payments
  it('only owner can withdraw mint payments', async () => {
    await expectRevert(
      drawNFT.withdrawMintPayments({ from: other }),
      'Ownable: caller is not the owner'
    );
  });

  it('should fail when provided with an invalid signature', async () => {
    await expectRevert(
      drawNFT.safeMint('test', keys, {
        value: ethers.utils.parseEther('0.07'),
      }),
      'Invalid Signature'
    );
  });

  // TODO: this doesn work :(
  // check that the correct nonce is returned for a given address
  it('returns correct nonce for given address', async () => {
    // Increase the nonce for the owner address
    const signature = await signMessage();
    await drawNFT.safeMint(
      'test',
      {
        v: signature.v,
        s: signature.s,
        r: signature.r,
      },
      {
        from: owner,
        sender: owner,
        value: ethers.utils.parseEther('0.07'),
      }
    );

    // Read the nonce for the owner address and expect it to be 1
    const nonce = await drawNFT.readNonce(owner);
    expect(nonce).to.be.bignumber.equal(new BN(1));
  });

  // // check that the mint price is correctly enforced
  // it('enforces the correct mint price', async () => {
  //   // Calculate the expected mint price
  //   const expectedMintPrice = ethers.utils.parseUnits(
  //     (await drawNFT.MINT_PRICE()).toString(),
  //     'wei'
  //   );

  //   // Try to mint a token without sending the expected mint price and expect the transaction to revert
  //   await expectRevert(
  //     drawNFT.safeMint('test', keys, { from: owner }),
  //     'Not enough ETH sent'
  //   );

  //   // Mint a token by sending the expected mint price
  //   const tx = await drawNFT.safeMint('test', keys, {
  //     from: owner,
  //     value: expectedMintPrice,
  //   });

  //   // Check that the correct amount of ETH was received by the contract
  //   expectEvent(tx, 'Transfer', {
  //     from: '0x0000000000000000000000000000000000000000',
  //     to: owner,
  //     tokenId: '1',
  //   });
  // });
});
