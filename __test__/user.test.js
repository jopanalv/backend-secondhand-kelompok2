const {
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  updateRole,
  logout,
} = require("../controllers/UserController");
const { Users, Profiles } = require("../models");
const { checkToken } = require("../services/authService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models");
jest.mock("bcrypt");
jest.mock("../services/authService");
jest.mock("jsonwebtoken");

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
describe("Get User By Id", () => {
  it("Should return 200 if user exist", async () => {
    Users.findOne.mockImplementationOnce(() => ({
      email: "email",
      password: "password",
      role: "seller",
    }));
    await getUserById(request, response);
    expect(response.status).toBeCalledWith(200);
  });
  it("Should return 404 if user did not exist", async () => {
    Users.findOne.mockResolvedValueOnce(undefined);
    await getUserById(request, response);
    expect(response.status).toHaveBeenCalledWith(404);
  });
  it("Should return 500 if error get user by id", async () => {
    try {
      Users.findOne.mockImplementationOnce(() => {
        throw new Error();
      });
      await getUserById(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith(500);
    }
  });
});
describe("Get Users", () => {
  it("Should return 200 if success", async () => {
    Users.findAll.mockImplementationOnce();
    await getUsers(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return 500 if error get users", async () => {
    try {
      Users.findAll.mockImplementationOnce(() => {
        throw new Error();
      });
      await getUsers(request, response);
    } catch (error) {
      expect(response.status).toHaveBeenCalledWith(500);
    }
  });
});

describe("Register", () => {
  it("Should return 400 if one of body value is empty", async () => {
    const req = {
      body: {
        name: null,
        email: "fake_email",
        password: "fake_password",
        role: "fake_role",
      },
    };
    await register(req, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });
  it("Should return 409 if user already exist", async () => {
    Users.findOne.mockResolvedValueOnce(true);
    await register(request, response);
    expect(response.status).toHaveBeenCalledWith(409);
  });
  it("Should return 201 if register success", async () => {
    Users.create.mockResolvedValueOnce(true);
    Profiles.create.mockResolvedValueOnce(true);
    await register(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });
  it("Should return 500 if error register user", async () => {
    try {
      Users.create.mockImplementationOnce(() => {
        throw new Error();
      });
      await register(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith(500);
    }
  });
});
describe("Login", () => {
  it("Should return 404 if user email did not exist", async () => {
    Users.findOne.mockResolvedValueOnce(false);
    await login(request, response);
    expect(response.status).toHaveBeenCalledWith(404);
  });
  it("Should return 401 if email and password did not match", async () => {
    Users.findOne.mockResolvedValueOnce(true);
    bcrypt.compare.mockResolvedValueOnce(false);
    await login(request, response);
    expect(response.status).toHaveBeenCalledWith(401);
  });
  it("Should return 200 if login success", async () => {
    Users.findOne.mockResolvedValueOnce(true);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockImplementationOnce();
    jwt.sign.mockImplementationOnce();
    await login(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return 500 if error when login", async () => {
    try {
      Users.findOne.mockImplementationOnce(() => {
        throw new Error();
      });
      await login(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith(500);
    }
  });
});
describe("Who Am I", () => {
  it("Should return 201 if value found", async () => {
    checkToken.mockResolvedValueOnce(true);
    await whoami(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });
  it("Should return 403 if token expired error", async () => {
    whoami.checkToken = () => {
      throw new Error("TokenExpiredError: jwt expired");
    };
    await whoami(request, response);
    expect(response.status).toHaveBeenCalledWith(500);
  });
  it("Should return 500 if error when who am i", async () => {
    try {
      whoami.checkToken = () => {
        throw new Error();
      };
      await whoami(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith(500);
    }
  });
});

describe("Logout", () => {
  it("Should return 204 if refresh token did not exist", async () => {
    const req = {
      cookies: { refreshToken: undefined },
    };
    await logout(req, response);
    expect(response.sendStatus).toHaveBeenCalledWith(204);
  });
  it("Should return 200 if logout successfully", async () => {
    const req = {
      cookies: { refreshToken: "dummy_token" },
    };
    await logout(req, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
});

describe("Update profile", () => {
  it("Should return 403 if user id token did not exist", async () => {
    const req = {
      user: { userId: undefined },
      body: { name: "name", city: "city", address: "address", no_hp: "no_hp" },
    };
    await updateProfile(req, response);
    expect(response.status).toHaveBeenCalledWith(403);
  });
  it("Should return 200 if update profile success", async () => {
    await Profiles.update.mockImplementationOnce();
    await Profiles.findOne.mockImplementationOnce();
    await updateProfile(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return 500 if error when update profile", async () => {
    try {
      Profiles.update.mockImplementationOnce(() => {
        throw new Error();
      });
      await updateProfile(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith(500);
    }
  });
});
describe("Update role", () => {
  it("Should return 201 if already have role", async () => {
    const req = {
      user: { role: "some_role" },
      body: { role: "some_role" },
    };
    await updateRole(req, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });
  it("Should return 403 if user id empty", async () => {
    await updateRole(request, response);
    expect(response.status).toHaveBeenCalledWith(403);
  });
  it("Should return 200 if success update role", async () => {
    const req = {
      user: { UserId: 1, role: null },
      body: { role: "some_role" },
    };
    Users.update.mockImplementationOnce();
    Users.findOne.mockImplementationOnce();
    await updateRole(req, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it("Should return 500 if error when update user", async () => {
    try {
      Users.update.mockImplementationOnce(() => {
        throw new Error();
      });
      await updateRole(request, response);
    } catch (error) {
      expect(response.json).toHaveBeenCalledWith(500);
    }
  });
});
