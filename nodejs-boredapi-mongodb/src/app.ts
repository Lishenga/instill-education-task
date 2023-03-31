import express, { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import { gql } from "apollo-server-express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { json } from "body-parser";
import cors from "cors";

require("dotenv").config();
mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(
    process.env.MONGODB_PASSWORD!
  )}@atlascluster.25ezekd.mongodb.net/${
    process.env.MONGODB_DB_NAME
  }?retryWrites=true&w=majority`
);

// Define Activity schema and model
const activitySchema = new mongoose.Schema({
  _id: String,
  activity: String,
  type: String,
  participants: Number,
  price: Number,
  link: String,
  key: String,
  accessibility: Number,
});

const Activity = mongoose.model("Activity", activitySchema);

// GraphQL schema
const typeDefs = gql`
  type Activity {
    _id: ID!
    activity: String!
    type: String!
    participants: Int!
    price: Float!
    link: String
    key: String!
    accessibility: Float!
  }

  type Query {
    activities(type: String): [Activity]
  }

  type Mutation {
    syncActivities: Boolean
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    activities: async (_: unknown, { type }: { type?: string }) => {
      const query = type ? { type } : {};
      const activities = await Activity.find(query);
      return activities;
    },
  },
  Mutation: {
    syncActivities: async () => {
      try {
        for (let i = 0; i < 20; i++) {
          const response = await axios.get(
            "https://www.boredapi.com/api/activity"
          );
          const existingActivity = await Activity.findById(response.data.key);

          if (!existingActivity) {
            const activityData = new Activity({
              ...response.data,
              _id: response.data.key,
            });

            await activityData.save();
          }
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
};

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: "*",
    }),
    json(),
    expressMiddleware(server)
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3010 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:3010/graphql`);
};

startServer();
