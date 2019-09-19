pragma solidity 0.5.10;

contract Contador {
    uint256 public state;

    constructor() public {
        state = 0;
    }

    function increment() public {
        state = state + 1;
    }
}