var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
const truffleAssert = require('truffle-assertions');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const id1 = 1;
    const id2 = 2;
    const tokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Housing Token", "HST");

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, id1, tokenURI);
            await this.contract.mint(account_one, id2, tokenURI);

        })

        it('should return total supply', async function () {

            var total = await this.contract.totalSupply();
            assert(total == 2, "Error: The total supply should be 2");
        })

        it('should get token balance', async function () { 
            var balance = await this.contract.balanceOf(account_one);
            assert(balance == 2, "Error: The token blance should be 2"); 
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            
            let expectedURI1 = tokenURI+id1;
            let expectedURI2 = tokenURI+id2;

            let uri1 = await this.contract.tokenURI(id1);
            let uri2 = await this.contract.tokenURI(id2);

            assert(uri1 == expectedURI1, "Error: The token uri of token 1 should be: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1");
            assert(uri2 == expectedURI2, "Error: The token uri of token 2 should be: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2");
        })

        it('should transfer token from one owner to another', async function () { 

            var tx1 = await this.contract.ownerOf(id1);
            assert(tx1 == account_one, "Error: Before transfer, account_one should be owner of this token")

            var tx2 = await this.contract.safeTransferFrom(account_one, account_two, id1);
            truffleAssert.eventEmitted(tx2, 'Transfer');

            var tx3 = await this.contract.ownerOf(id1);
            assert(tx3 == account_two, "Error: After transfer, account_two should be owner of this token")
        })

        it('should approves another address to transfer the given token ID', async function() {
            // approve account_two to transfer the token
            let tx1 = await this.contract.approve(account_two, id1)
            truffleAssert.eventEmitted(tx1, 'Approval')
            // confirm account_two is approved
            let tx2 = await this.contract.getApproved(id1)
            assert(tx2 == account_two, 'Error: The account_two should be approved for this token')
        })

        it('should approves another address to transfer all token on their behalf', async function() {

            // approve account_two to transfer all tokens
            let tx1 = await this.contract.setApprovalForAll(account_two, true)
            truffleAssert.eventEmitted(tx1, 'ApprovalForAll')
            // confirm account_two is approved
            let tx2 = await this.contract.isApprovedForAll(account_one, account_two)
            assert(tx2 == true, 'Error: The account_two should be approved to transfer all tokens')
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Housing Token", "HST");
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            // We expects the exception is thrown here as we not using contract owner address to mint the token
            try {
                await this.contract.mint(account_two, id1, tokenURI, {from : account_two});
            } catch (error) {
                assert(error.message.search('Only contract owner is allowed') >= 0, "'Only contract owner is allowed to mint the token")
            }

            
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert(owner == account_one, "Error: The owner should be account_one")
        })

        it('should transfer contract ownership', async function() {
            let tx = await this.contract.transferOwnership(account_two);
            let owner = await this.contract.getOwner();
            truffleAssert.eventEmitted(tx, 'OwnershipTransfer');
            assert(owner == account_two, 'Error: The owner should be account_two')
        })
    });

    describe('test pause contract', function () {

        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Housing Token", "HST");
        })

        it ('should pause the contract', async function () {
            let tx = await this.contract.pause();
            truffleAssert.eventEmitted(tx, 'Paused');
        })

        it ('should unPause the contract', async function() {
            // Pause the contract first
            await this.contract.pause();
            let tx = await this.contract.unPause();
            truffleAssert.eventEmitted(tx, 'Unpaused');
        })
    })
})