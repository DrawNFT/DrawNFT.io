const DrawNFT = artifacts.require('DrawNFT');

module.exports = function (deployer) {
  const fs = require('fs');

  deployer.deploy(DrawNFT).then(() => {
    fs.writeFileSync(
      `./build/contracts/DrawNFT-address.json`,
      JSON.stringify({ address: DrawNFT.address }, undefined, 2)
    );
  });
};