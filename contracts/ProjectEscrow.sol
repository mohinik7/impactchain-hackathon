// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ProjectEscrow - Manages the lifecycle of philanthropic projects, donations, milestones, and fund release
/// @notice Core engine of the ImpactChain platform
contract ProjectEscrow is Ownable, ReentrancyGuard {
    enum ProjectState { Active, Completed, Cancelled }

    enum MilestoneState { Pending, Completed }

    struct Milestone {
        string description;
        uint256 amount;
        MilestoneState state;
    }

    struct Project {
        uint256 projectId;
        address payable ngo;
        Milestone[] milestones;
        uint256 totalAmount;
        uint256 fundsRaised;
        ProjectState state;
    }

    // Project storage
    mapping(uint256 => Project) public projects;
    uint256 public projectCounter;

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed ngo, string[] milestoneDescriptions, uint256[] milestoneAmounts);
    event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount);

    /// @notice Create a new philanthropic project with milestones
    /// @param ngo The address of the NGO
    /// @param milestoneDescriptions Descriptions for each milestone
    /// @param milestoneAmounts Amounts for each milestone
    function createProject(
        address ngo,
        string[] calldata milestoneDescriptions,
        uint256[] calldata milestoneAmounts
    ) external {
        require(ngo != address(0), "Invalid NGO address");
        require(milestoneDescriptions.length == milestoneAmounts.length, "Input array lengths must match");
        require(milestoneDescriptions.length > 0, "Project must have at least one milestone");

        uint256 currentId = projectCounter;
        Project storage newProject = projects[currentId];
        newProject.projectId = currentId;
        newProject.ngo = payable(ngo);

        uint256 totalProjectAmount = 0;
        for (uint i = 0; i < milestoneAmounts.length; i++) {
            newProject.milestones.push(
                Milestone({
                    description: milestoneDescriptions[i],
                    amount: milestoneAmounts[i],
                    state: MilestoneState.Pending
                })
            );
            totalProjectAmount += milestoneAmounts[i];
        }
        newProject.totalAmount = totalProjectAmount;
        newProject.state = ProjectState.Active;
        projectCounter++;

        emit ProjectCreated(currentId, ngo, milestoneDescriptions, milestoneAmounts);
    }

    /// @notice Donate to a project
    /// @param projectId The ID of the project
    function donate(uint256 projectId) external payable nonReentrant {
        Project storage p = projects[projectId];
        require(p.state == ProjectState.Active, "Project is not active");
        require(msg.value > 0, "Donation must be greater than zero");
        require(p.fundsRaised + msg.value <= p.totalAmount, "Donation exceeds project goal");

        p.fundsRaised += msg.value;
        emit DonationReceived(projectId, msg.sender, msg.value);
    }

    /// @notice Mark a milestone as completed and release funds to the NGO
    /// @param projectId The ID of the project
    /// @param milestoneIndex The index of the milestone to complete
    function completeMilestone(uint256 projectId, uint256 milestoneIndex) external onlyOwner nonReentrant {
        Project storage p = projects[projectId];
        require(p.state == ProjectState.Active, "Project is not active");
        require(milestoneIndex < p.milestones.length, "Invalid milestone index");
        Milestone storage m = p.milestones[milestoneIndex];
        require(m.state == MilestoneState.Pending, "Milestone already completed");
        require(p.fundsRaised >= m.amount, "Insufficient funds for milestone");

        // Mark milestone as completed and release funds
        m.state = MilestoneState.Completed;
        (bool sent, ) = p.ngo.call{value: m.amount}("");
        require(sent, "Fund transfer failed");
        p.fundsRaised -= m.amount;

        // Check if all milestones are completed
        bool allDone = true;
        for (uint256 i = 0; i < p.milestones.length; i++) {
            if (p.milestones[i].state == MilestoneState.Pending) {
                allDone = false;
                break;
            }
        }
        if (allDone) {
            p.state = ProjectState.Completed;
        }
    }
}
