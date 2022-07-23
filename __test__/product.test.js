const { Products, Profiles, Categories, Wishlist } = require("../models");
const {
  getAllProduct,
  getProduct,
  getProductSeller,
  createProduct,
  updateProduct,
  deleteProduct,
  getListCategories,
  addWishlist,
  getWishlist,
  getWishlistedProduct,
} = require("../controllers/ProductController");

jest.mock("../models");

const request = {
  id: 1,
  params: { id: 1 },
  body: {
    name: "fake_name",
    description: "fake_description",
    CategoryId: 1,
    price: 1,
    file: "fake_file",
  },
  file: {
    filename: "fake_name",
  },
};
const response = {
  status: jest.fn((x) => x),
  send: jest.fn((x) => x),
  json: jest.fn((x) => x),
  sendStatus: jest.fn((x) => x),
};

describe("Get All Product", () => {
  it("Should return 200 if success Get all product ", async () => {
    Products.findAll.mockImplementationOnce();
    await getAllProduct(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get all product ", async () => {
    try {
      Products.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getAllProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("get Product", () => {
  it("Should return 200 if success get all product ", async () => {
    Products.findOne.mockImplementationOnce();
    await getProduct(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get all product ", async () => {
    try {
      Products.findOne.mockImplementationOnce(() => {
        throw new Error();
      });
      await getProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Get Product Seller", () => {
  it("Should return 200 if success get product seller ", async () => {
    Profiles.findOne.mockImplementationOnce();
    Products.findOne.mockImplementationOnce();
    await getProductSeller(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get product seller ", async () => {
    try {
      Products.findOne.mockImplementationOnce(() => {
        throw new Error();
      });
      await getProductSeller(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Create Product", () => {
  it("Should return json error if failed create product ", async () => {
    try {
      Products.create.mockImplementationOnce(() => {
        throw new Error();
      });
      await createProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Update Product", () => {
  it("Should return 200 if success update product ", async () => {
    Products.findOne.mockImplementationOnce();
    Products.update.mockImplementationOnce();
    await updateProduct(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed update product ", async () => {
    try {
      Products.update.mockImplementationOnce(() => {
        throw new Error();
      });
      await updateProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Delete Product", () => {
  it("Should return 204 if success delete product ", async () => {
    Products.destroy.mockImplementationOnce();
    await deleteProduct(request, response);
    expect(response.status).toHaveBeenCalledWith(204);
  });
  it("Should return json error if failed delete product ", async () => {
    try {
      Products.destroy.mockImplementationOnce(() => {
        throw new Error();
      });
      await deleteProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Get List Categories", () => {
  it("Should return 200 if success get categories ", async () => {
    Categories.findAll.mockImplementationOnce();
    await getListCategories(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get all categories ", async () => {
    try {
      Categories.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getListCategories(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
describe("Add Wislist", () => {
  it("Should return 200 if success add wishlist ", async () => {
    Products.findOne.mockImplementationOnce();
    Wishlist.create.mockImplementationOnce();
    await addWishlist(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed add wishlist", async () => {
    try {
      Wishlist.create.mockImplementationOnce(() => {
        throw new Error();
      });
      await addWishlist(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});

describe("Get Wislist", () => {
  it("Should return 200 if success get wishlist ", async () => {
    Wishlist.findAll.mockImplementationOnce();
    await getWishlist(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get wishlist", async () => {
    try {
      Wishlist.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getWishlist(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});

describe("Get Wislisted Product", () => {
  it("Should return 200 if success get wishlisted product ", async () => {
    Wishlist.findAll.mockImplementationOnce();
    await getWishlistedProduct(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return json error if failed get wishlisted product", async () => {
    try {
      Wishlist.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getWishlistedProduct(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith({
        message: error.message,
      });
    }
  });
});
