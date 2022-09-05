const { and, or, allow, rule, shield } = require("graphql-shield");

function getPermissions(user) {
  if (user && user.data) {
    return user.data.permissions;
  }
  return [];
}
// Admin
const canReadAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:any");
});
const canReadOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:own_account");
});
// Tourist
const canUpdateOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:own_account");
});
const canCreateAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("create:any");
});
const canUpdateAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:any");
});
const canDeleteAny = rule()((_, __, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:any");
});

// roles
const isOwnAccount = rule()((parent, { id }, { user }) => {
  return user && user.sub === id;
});
// authorization
const checkParametersOfUpdate = rule()((_, { account }) => {
  const { roles, permissions } = account;
  return roles || permissions ? false : true;
});
const permissions = shield({
  Query: {
    account: or(and(canReadOwnAccount, isOwnAccount), canReadAny),
    accounts: canReadAny,
  },
  Mutation: {
    login: allow,
    newTourist: allow,
    customAccount: canCreateAny,
    updateAccount: or(and(canUpdateOwnAccount, checkParametersOfUpdate), canUpdateAny),
    deleteAccount: canDeleteAny,
  },
});
module.exports = { permissions };
