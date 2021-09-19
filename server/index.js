const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGO_DB_URL } = require("./config");

const app = express();

const httpServer = createServer(app);

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const server = new ApolloServer({
	schema,
	context: ({ req }) => ({ req }),
	plugins: [
		{
			async serverWillStart() {
				return {
					async drainServer() {
						subscriptionServer.close();
					},
				};
			},
		},
	],
});

const subscriptionServer = SubscriptionServer.create(
	{ schema, execute, subscribe },
	{ server: httpServer, path: server.graphqlPath }
);

const PORT = 5000;

mongoose
	.connect(MONGO_DB_URL)
	.then(() => {
		console.log("Mongo database start running...");
		return server.start();
	})
	.then(() => server.applyMiddleware({ app }))
	.then(() => httpServer.listen(PORT))
	.then(() =>
		console.log(`Server is now running on http://localhost:${PORT}/graphql`)
	)
	.catch((err) => console.log(`Server started error: ${err}`));
