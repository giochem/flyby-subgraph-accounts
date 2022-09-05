const { Schema, model } = require("mongoose");

const accountSchema = Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    phone: { type: Number, require: true },
    // tourist, crew, admin, marketer
    roles: { type: Array, require: true, default: ["tourist"] },
    permissions: {
      type: Array,
      require: true,
      default: ["read:own_account", "update:own_account", "create:own_order", "delete:own_orders"],
    },
  },
  {
    collection: "accounts",
    timestamps: true,
  }
);
/*
tourist:
  read: own_account
  create: 
  update: own_account
  delete
crew:
  read: @guest
  create: @guest
  update: @guest
  delete: @guest
marketer:
  read: @tourist, any_tour, any_ticket
  create: @tourist, any_tour
  update: @tourist, any_tour
  delete: @tourist, any_tour
admin: 
  read: any
  create: any
  update: any
  delete: any
*/
module.exports = model("Account", accountSchema);
