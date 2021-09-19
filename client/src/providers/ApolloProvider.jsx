import React from "react";
import {
	ApolloProvider as Provider,
	InMemoryCache,
	createHttpLink,
	ApolloClient,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
	uri: "http://localhost:5000/graphql",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");

	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache({}),
});

const ApolloProvider = (props) => {
	return <Provider children={props.children} client={client} />;
};

export default ApolloProvider;
