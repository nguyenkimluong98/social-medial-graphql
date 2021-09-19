import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { AuthProvider } from "./contexts/auth";
import AuthRoute from "./utils/AuthRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import SinglePost from "./pages/SinglePost";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<MenuBar />
					<Route exact path="/" component={Home} />
					<AuthRoute exact path="/register" component={Register} />
					<AuthRoute exact path="/login" component={Login} />
					<Route exact path="/posts/:postId" component={SinglePost} />
				</Container>
			</Router>
		</AuthProvider>
	);
}

export default App;
