const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectEscrow", function () {
  let ProjectEscrow, projectEscrow, owner, ngo, donor;

  beforeEach(async function () {
    [owner, ngo, donor] = await ethers.getSigners();
    ProjectEscrow = await ethers.getContractFactory("ProjectEscrow");
    projectEscrow = await ProjectEscrow.deploy();
    await projectEscrow.waitForDeployment();
  });

  it("should allow anyone to create a project with valid milestones", async function () {
    const milestoneDescriptions = ["Milestone 1", "Milestone 2"];
    const milestoneAmounts = [ethers.parseEther("1"), ethers.parseEther("2")];

    await expect(
      projectEscrow.createProject(
        ngo.address,
        milestoneDescriptions,
        milestoneAmounts
      )
    )
      .to.emit(projectEscrow, "ProjectCreated")
      .withArgs(0, ngo.address, milestoneDescriptions, milestoneAmounts);

    const project = await projectEscrow.projects(0);
    expect(project.ngo).to.equal(ngo.address);
    expect(project.totalAmount).to.equal(
      milestoneAmounts[0] + milestoneAmounts[1]
    );
    expect(project.state).to.equal(0); // ProjectState.Active
  });

  it("should allow anyone to donate to an active project and update fundsRaised", async function () {
    const milestoneDescriptions = ["Milestone 1"];
    const milestoneAmounts = [ethers.parseEther("1")];
    await projectEscrow.createProject(ngo.address, milestoneDescriptions, milestoneAmounts);

    await expect(
      projectEscrow.connect(donor).donate(0, { value: ethers.parseEther("0.5") })
    )
      .to.emit(projectEscrow, "DonationReceived")
      .withArgs(0, donor.address, ethers.parseEther("0.5"));

    const project = await projectEscrow.projects(0);
    expect(project.fundsRaised).to.equal(ethers.parseEther("0.5"));
  });

  it("should revert when donating to a non-existent project", async function () {
    await expect(
      projectEscrow.connect(donor).donate(999, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Project is not active");
  });

  it("should revert when donating zero or more than the project goal", async function () {
    const milestoneDescriptions = ["Milestone 1"];
    const milestoneAmounts = [ethers.parseEther("1")];
    await projectEscrow.createProject(ngo.address, milestoneDescriptions, milestoneAmounts);

    await expect(
      projectEscrow.connect(donor).donate(0, { value: 0 })
    ).to.be.revertedWith("Donation must be greater than zero");

    await expect(
      projectEscrow.connect(donor).donate(0, { value: ethers.parseEther("2") })
    ).to.be.revertedWith("Donation exceeds project goal");
  });

  // Test cases will be added here
});
