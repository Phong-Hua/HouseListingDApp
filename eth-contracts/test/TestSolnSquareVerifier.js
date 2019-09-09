var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Verfier = artifacts.require("Verifier");
const truffleAssert = require('truffle-assertions');

contract('TestSolnSquareVerifier', accounts => {

    let contract;
    let a, b, c, input;
    beforeEach(async () => {
        
        const verfier = await Verfier.new();
        contract = await SolnSquareVerifier.new("Housing Token", "HST", verfier.address);

        a = ["0x1894927c4d20c2e4cad375f6a1a18fddfef758b345869a631295d19c317214c7", "0x1976a7be08fb76db3614c30757bbf6ac67d23197d21466920938bd5fd320b465"];
        b = [["0x2bd353101ea6def9ba77f1f867c01537d59b38932943f72618b6a553d6ae7d40", "0x272924670d790f469fc0b977d5ae755be8663ae7d4017d0a4c887557eea527c9"], 
        ["0x2a1803a8bda023a8e3525ed42b15f0f16cf612a7a3d17e8f8ff780ecdf8ccf3e", "0x123b6dd46f4c65493b13aa8c61e8b55f1849af974d47b0642063d4297e9f0eeb"]];
        c = ["0x15d634a028e7e2e58ff8d5b8096cb8a0fcc31ae7f201370a3927d412d0a74639", "0x054e87f91a5686d7ed3a35c6a0b80b74166ffbf65913c22965c9146527f0e241"];
        input = ["0x0000000000000000000000000000000000000000000000000000000000000090", "0x0000000000000000000000000000000000000000000000000000000000000001"];
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it ('Test if a new solution can be added for contract - SolnSquareVerifier', async function() {

        let tx = await contract.addSolution(a, b, c, input);
        truffleAssert.eventEmitted(tx, 'SolutionAdded');
    })
    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it ('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function() {

        let address = accounts[0];
        let tokenId = 1;
        let uri = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

        let tx = await contract.mintNewToken(a, b, c, input, address, tokenId, uri);
        truffleAssert.eventEmitted(tx, 'TokenMinted');

    })

    it('Test if a solution can only be used once', async function(){

        let address = accounts[0];
        let tokenId = 1;
        let uri = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

        let tx = await contract.mintNewToken(a, b, c, input, address, tokenId, uri);
        truffleAssert.eventEmitted(tx, 'TokenMinted');

        tokenId = 2;

        // Error should happen here as we re-used the solution
        try {
            await contract.mintNewToken(a, b, c, input, address, tokenId, uri)
        } catch (error) {
            assert(error.message.search('Require new Solution') >= 0, "Require new Solution")
        }
    })

})

