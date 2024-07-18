import express from "express";
import cors from "cors";
import proposals from "./routes/proposal.js";

import gql from "graphql-tag";
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import resolvers from "./resolvers.js";
import { readFileSync } from "fs";

import DateScalar from './DateScalar';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());


const typeDefs =
  'scalar Date'
  gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});
// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();

app.use("/proposal", proposals);
app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server),
);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});