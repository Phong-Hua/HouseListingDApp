// migrating the appropriate contracts
var SquareVerifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Erc721Mintable = artifacts.require("ERC721MintableComplete");

module.exports = function(deployer, accounts) {

  deployer.deploy(SquareVerifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, "Housing Token", "HST", SquareVerifier.address);
  });
  // deployer.deploy(Erc721Mintable, "Housing Token", "HST");
};
