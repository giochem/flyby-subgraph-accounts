const Account = require("../models/Account");

class AccountAPI {
  async findAccountById(id) {
    try {
      return await Account.findById(id);
    } catch (error) {
      console.log(error);
    }
  }
  async findAllAccountsByRoles(roles) {
    try {
      return await Account.find({ roles: { $in: roles } });
    } catch (error) {
      console.log(error);
    }
  }
  async findAccountByEmail(email) {
    try {
      return await Account.findOne({ email: email });
    } catch (error) {
      console.log(error);
    }
  }
  async login({ email, password }) {
    try {
      return await Account.findOne({ email, password });
    } catch (error) {
      console.log(error);
    }
  }
  async newAccount(account) {
    try {
      return await Account.create(account);
    } catch (error) {
      console.log(error);
    }
  }
  async findAccountByIdAndUpdate(id, account) {
    try {
      return await Account.findByIdAndUpdate(id, account, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async findAccountByIdAndDelete(id) {
    try {
      return await Account.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = AccountAPI;
