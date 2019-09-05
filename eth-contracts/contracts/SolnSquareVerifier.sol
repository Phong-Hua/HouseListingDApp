pragma solidity >=0.4.21 <0.6.0;
import './ERC721Mintable.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns (bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721MintableComplete {

    Verifier private verifier;

    constructor(string memory _name, string memory _symbol, address verifierContract)
    ERC721MintableComplete(_name, _symbol)
    public
    {
        verifier = Verifier(verifierContract);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address solutionOwner;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;


    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) private submittedSolution;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded();

    event TokenMinted();

    /**
    * Create a unique uint for a solution.
    */
    function _getSolutionKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
    internal
    pure
    returns(uint256)
    {
        bytes32 temp = keccak256(abi.encodePacked(a, b, c, input));
        return uint256(temp);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] calldata a, uint[2][2] calldata b, uint[2] calldata c, uint[2] calldata input)
    external
    requireVerifiedSolution(a, b, c, input)
    {
        uint256 key = _getSolutionKey(a, b, c, input);
        require(submittedSolution[key].solutionOwner == address(0), "Require new Solution");
        Solution memory sol;
        sol.index = solutions.length;
        sol.solutionOwner = msg.sender;
        submittedSolution[key] = sol;
        solutions.push(sol);
        emit SolutionAdded();
    }


    modifier requireVerifiedSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
    {
        require(verifier.verifyTx(a, b, c, input) == true, "Require the solution is valid");
        _;
    }



    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mintNewToken(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address to, uint256 tokenId, string memory tokenURI)
    public
    requireVerifiedSolution(a, b, c, input)
    {
        uint256 key = _getSolutionKey(a, b, c, input);
        require(submittedSolution[key].solutionOwner == address(0), "Require new Solution");
        if (super.mint(to, tokenId, tokenURI))
            emit TokenMinted();
    }
}
























