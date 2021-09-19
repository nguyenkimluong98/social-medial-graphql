import React, { useContext } from "react";
import { useQuery } from "@apollo/client";

import { AuthContext } from "../contexts/auth";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

const Home = () => {
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	const { user } = useContext(AuthContext);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<h1>Loading posts...</h1>
				) : (
					<Posts data={data} user={user} />
				)}
			</Grid.Row>
		</Grid>
	);
};

const Posts = ({ data, user }) => {
	const { getPosts: posts } = data;

	return (
		<>
			<Transition.Group animation="drop" duration={500}>
				{posts &&
					posts.map((post) => (
						<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
							<PostCard user={user} post={post} />
						</Grid.Column>
					))}
			</Transition.Group>
		</>
	);
};

export default Home;
