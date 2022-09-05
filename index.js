const { readFileSync } = require("fs");
const { ApolloServer, gql } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");
const { buildSubgraphSchema } = require("@apollo/subgraph");
require("dotenv").config();
// Connection mongoose
require("./config/db")();
const typeDefs = gql(readFileSync("./accounts.graphql", { encoding: "utf-8" }));
const resolvers = require("./resolvers");
const { permissions } = require("./permissions");
// Api
const AccountAPI = require("./datasources/AccountApi");

const server = new ApolloServer({
  schema: applyMiddleware(buildSubgraphSchema({ typeDefs, resolvers }), permissions),
  context: ({ req }) => {
    const user = req.headers.auth ? JSON.parse(req.headers.auth) : null;
    const dataSources = {
      accountAPI: new AccountAPI(),
    };
    return { user, dataSources };
  },
});

const subgraphName = "users";

server
  .listen({ port: process.env.PORT || 4001 })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
