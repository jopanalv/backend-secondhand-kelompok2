const { Profiles, Products, Transactions } = require("../models");
const {
  buyProduct,
  getTransactionHistoryBuyer,
  getTransactionHistorySeller,
  getNotifSeller,
  getNotifBuyer,
  detailTransaction,
  acceptTransaction,
  cancelTransaction,
  successTransaction,
} = require("../controllers/TransactionController");
jest.mock("../models");

const request = {
  params: { id: 1 },
  body: {
    name: "fake_name",
    email: "fake_email",
    password: "fake_password",
    role: "fake_role",
  },
};
const response = {
  status: jest.fn((x) => x),
  send: jest.fn((x) => x),
  json: jest.fn((x) => x),
  sendStatus: jest.fn((x) => x),
};

const buyer = {
  name: "fake_name",
  address: "fake_address",
  no_hp: "fake_no_hp",
  role: "fake_role",
};

describe("Detail Transaction", () => {
  it("Should return 200 if transaction exist", async () => {
    Transactions.findOne.mockReturnValueOnce({ ProductId: 1 });
    Products.findOne.mockImplementationOnce();
    await detailTransaction(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if error occured ", async () => {
    try {
      Transactions.findOne.mockImplementationOnce(() => {
        throw new Error();
      });
      await detailTransaction(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Get Notif Seller", () => {
  it("Should return 200 if success get notif seller", async () => {
    Transactions.findAll.mockImplementationOnce();
    await getNotifSeller(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get notif seller ", async () => {
    try {
      Transactions.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getNotifSeller(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Get Notif Buyer", () => {
  it("Should return 200 if success get notif buyer", async () => {
    Transactions.findAll.mockImplementationOnce();
    await getNotifBuyer(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get notif buyer ", async () => {
    try {
      Transactions.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getNotifBuyer(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});

describe("Get Transaction History Buyer", () => {
  it("Should return 200 if success get transaction history buyer", async () => {
    Transactions.findAll.mockImplementationOnce();
    await getTransactionHistoryBuyer(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get transaction history buyer ", async () => {
    try {
      Transactions.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getTransactionHistoryBuyer(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Get Transaction History Seller", () => {
  it("Should return 200 if success get transaction history seller", async () => {
    Transactions.findAll.mockImplementationOnce();
    await getTransactionHistorySeller(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get transaction history seller ", async () => {
    try {
      Transactions.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getTransactionHistorySeller(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Buy Product", () => {
  it("Should return json message if profile did not filled", async () => {
    Profiles.findOne
      .mockReturnValueOnce(buyer.address === null)
      .mockReturnValueOnce(buyer.no_hp === null);
    await buyProduct(request, response);
    expect.objectContaining(response.json);
  });
  it("Should return 201 if success Buy Product", async () => {
    Profiles.findOne
      .mockReturnValueOnce(buyer.address == "fake_address")
      .mockReturnValueOnce(buyer.no_hp == "fake_no_hp");
    Transactions.create.mockImplementationOnce();
    await buyProduct(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });
  it("Should return json error if failed Buy Product ", async () => {
    try {
      Profiles.findOne.mockImplementationOnce(() => {
        throw new Error();
      });
      await buyProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Accept Transaction", () => {
  it("Should return 201 if success accept transaction", async () => {
    Transactions.findOne.mockImplementationOnce();
    Transactions.update.mockImplementationOnce();
    await acceptTransaction(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed accept transaction ", async () => {
    try {
      Transactions.update.mockImplementationOnce(() => {
        throw new Error();
      });
      await acceptTransaction(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Cancel Transaction", () => {
  it("Should return 201 if success cancel transaction", async () => {
    Transactions.findOne.mockImplementationOnce();
    Transactions.update.mockImplementationOnce();
    await cancelTransaction(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed cancel transaction ", async () => {
    try {
      Transactions.update.mockImplementationOnce(() => {
        throw new Error();
      });
      await cancelTransaction(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
