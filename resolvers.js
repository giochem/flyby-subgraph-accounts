const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    async account(_, { id }, { dataSources }) {
      return await dataSources.accountAPI.findAccountById(id);
    },
    async accounts(_, { roles }, { dataSources }) {
      return await dataSources.accountAPI.findAllAccountsByRoles(roles);
    },
  },
  Account: {
    __resolveReference: ({ id }, { dataSources }) => {
      return dataSources.accountAPI.findAccountById(id);
    },
  },
  Mutation: {
    async login(_, { account }, { dataSources }) {
      const { email, password } = account;
      if (!email || !password) {
        return {
          code: 400,
          success: false,
          message: "Please add all field",
          token: null,
        };
      }
      const accountExist = await dataSources.accountAPI.login(account);
      if (!accountExist) {
        return {
          code: 400,
          success: false,
          message: "Email or password fail",
          token: null,
        };
      }

      const { id, roles, permissions } = accountExist;
      const token = jwt.sign({ data: { id, roles, permissions } }, process.env.JWT_SECRET || "secret", {
        algorithm: "HS256",
        subject: id,
        expiresIn: "1d",
      });

      return {
        code: 200,
        success: true,
        message: "Account found",
        token: token,
      };
    },

    async newTourist(_, { account }, { dataSources }) {
      const { email, phone, password } = account;
      if (!email || !phone || !password) {
        return {
          code: 400,
          success: false,
          message: "Please add all field",
          token: null,
        };
      }
      const accountExist = await dataSources.accountAPI.findAccountByEmail(account.email);
      if (accountExist) {
        return {
          code: 400,
          success: false,
          message: "Account already exists",
          token: null,
        };
      }
      const { roles, permissions, ...data } = account;
      const newAccount = await dataSources.accountAPI.newAccount(data);

      const token = jwt.sign({ data: { id: newAccount._id, roles, permissions } }, process.env.JWT_SECRET || "secret", {
        algorithm: "HS256",
        subject: id,
        expiresIn: "1d",
      });
      return {
        code: 201,
        success: true,
        message: "Account created successfully",
        token: token,
      };
    },
    async customAccount(_, { account }, { dataSources }) {
      const accountExist = await dataSources.accountAPI.findAccountByEmail(account.email);
      if (accountExist) {
        return {
          code: 400,
          success: false,
          message: "Account already exists",
          token: null,
        };
      }
      const newAccount = await dataSources.accountAPI.newAccount(account);
      const { id, roles, permissions } = newAccount;
      const token = jwt.sign({ data: { id, roles, permissions } }, process.env.JWT_SECRET || "secret", {
        algorithm: "HS256",
        subject: id,
        expiresIn: "1d",
      });
      return {
        code: 201,
        success: true,
        message: "Account created successfully",
        token: token,
      };
    },
    async updateAccount(_, { id, account }, { dataSources }) {
      const accountUpdated = await dataSources.accountAPI.findAccountByIdAndUpdate(id, account);
      if (accountUpdated) {
        return {
          code: 201,
          success: true,
          message: "Account update successfully",
          account: accountUpdated,
        };
      }
      return {
        code: 400,
        success: false,
        message: "Account not found",
        account: null,
      };
    },
    async deleteAccount(_, { id }, { dataSources }) {
      const accountDeleted = await dataSources.accountAPI.findAccountByIdAndDelete(id);
      if (accountDeleted) {
        return {
          code: 201,
          success: true,
          message: "Account delete successfully",
          account: accountDeleted,
        };
      }
      return {
        code: 400,
        success: false,
        message: "Account not found",
        account: null,
      };
    },
  },
};

module.exports = resolvers;
