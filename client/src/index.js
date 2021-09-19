import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloProvider from "./providers/ApolloProvider";

ReactDOM.render(
	<ApolloProvider>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
