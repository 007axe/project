const { expect } = require("chai")
const { ethers } = require("hardhat")
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// Global constans for listing an item...
  const ID = 1
  const NAME = "กระต่าย"
  const DESCRIPTION = "dsfsdfsdf"
  const CATEGORY = "ปุ๋ย"
  const IMAGE = "https://media.discordapp.net/attachments/808186574382563349/1072811561007194122/60251770r.webp"
  const COST = tokens(1)
  const RATING = 4
  const STOCK = 5


describe("Farmer", () => {
  let farmer
  let deployer, buyer

  beforeEach(async () =>{
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners()

    // Deploy contact
    const Farmer = await ethers.getContractFactory("Farmer")
    farmer = await Farmer.deploy() 
  })

  describe("Deplyment", () => {
    it("Sets the owner", async () => {
      expect(await farmer.owner()).to.equal(deployer.address)
    })       
  })

  describe("Listing", () => {
    let transaction
    
    beforeEach(async () =>{
      transaction = await farmer.connect(deployer).list(
        ID,
        NAME,
        DESCRIPTION,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      )

      await transaction.wait()
    })

    it("Returns item attributes", async () => {
      const item = await farmer.items(ID)

      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.description).to.equal(DESCRIPTION)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })  

    it("Emits List event", () => {
      expect(transaction).to.emit(farmer, "List")
    })   
  })

  describe("Buying", () => {
    let transaction

    beforeEach(async () => {
      // List a item
      transaction = await farmer.connect(deployer).list(ID, NAME, DESCRIPTION, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await farmer.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()
    })


    it("Updates buyer's order count", async () => {
      const result = await farmer.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await farmer.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(farmer.address)
      expect(result).to.equal(COST)
    })

    it("Emits Buy event", () => {
      expect(transaction).to.emit(farmer, "Buy")
    })
  })
  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List a item
      let transaction = await farmer.connect(deployer).list(ID, NAME, DESCRIPTION, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await farmer.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw
      transaction = await farmer.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(farmer.address)
      expect(result).to.equal(0)
    })
  }) 
})
