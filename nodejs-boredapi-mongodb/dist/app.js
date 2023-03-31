"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const apollo_server_express_1 = require("apollo-server-express");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = __importDefault(require("http"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
mongoose_1.default.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@atlascluster.25ezekd.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`);
// Define Activity schema and model
const activitySchema = new mongoose_1.default.Schema({
    _id: String,
    activity: String,
    type: String,
    participants: Number,
    price: Number,
    link: String,
    key: String,
    accessibility: Number,
});
const Activity = mongoose_1.default.model("Activity", activitySchema);
// GraphQL schema
const typeDefs = (0, apollo_server_express_1.gql) `
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
        activities: async (_, { type }) => {
            const query = type ? { type } : {};
            const activities = await Activity.find(query);
            return activities;
        },
    },
    Mutation: {
        syncActivities: async () => {
            try {
                for (let i = 0; i < 20; i++) {
                    const response = await axios_1.default.get("https://www.boredapi.com/api/activity");
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
            }
            catch (err) {
                console.error(err);
                return false;
            }
        },
    },
};
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
});
const startServer = async () => {
    await server.start();
    app.use("/graphql", (0, cors_1.default)({
        origin: "*",
    }), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server));
    await new Promise((resolve) => httpServer.listen({ port: 3010 }, resolve));
    console.log(`🚀 Server ready at http://localhost:3010/graphql`);
};
startServer();
