// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HarvestFinance
 * @dev Decentralized credit system for farmers based on harvest validation.
 */
contract HarvestFinance {
    struct Loan {
        uint256 amount;
        uint256 debt;
        bool isRepaid;
        bool exists;
    }

    mapping(address => Loan) public loans;
    address public owner;

    event LoanRequested(address indexed farmer, uint256 amount);
    event LoanRepaid(address indexed farmer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Farmers request a loan. In a real scenario, this would check credit score.
     */
    function requestLoan(uint256 _amount) external {
        require(!loans[msg.sender].exists || loans[msg.sender].isRepaid, "Existing unpaid loan found");
        
        loans[msg.sender] = Loan({
            amount: _amount,
            debt: _amount + (_amount * 5 / 100), // 5% interest
            isRepaid: false,
            exists: true
        });

        emit LoanRequested(msg.sender, _amount);
    }

    /**
     * @dev Repay the loan. Usually called after harvest sale validation.
     */
    function repayLoan() external payable {
        Loan storage farmerLoan = loans[msg.sender];
        require(farmerLoan.exists, "No loan found");
        require(!farmerLoan.isRepaid, "Loan already repaid");
        require(msg.value >= farmerLoan.debt, "Insufficient repayment amount");

        farmerLoan.isRepaid = true;
        
        emit LoanRepaid(msg.sender, msg.value);
    }

    function getLoanStatus(address _farmer) external view returns (uint256, uint256, bool) {
        Loan memory l = loans[_farmer];
        return (l.amount, l.debt, l.isRepaid);
    }
}
