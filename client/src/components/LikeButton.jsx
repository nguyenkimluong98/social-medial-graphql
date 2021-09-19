import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LIKE_POST_MUTATION } from "../utils/graphql";
import { useMutation } from "@apollo/client";

import { AuthContext } from "../contexts/auth";

import { Button, Icon, Label } from "semantic-ui-react";

function LikeButton({ post: { id, likeCount, likes } }) {
	const [liked, setLiked] = useState(false);

	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const likeButton = user ? (
		liked ? (
			<Button color="teal">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="teal" basic>
			<Icon name="heart" />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" onClick={likePost}>
			{likeButton}
			<Label basic color="teal" pointing="left">
				{likeCount}
			</Label>
		</Button>
	);
}

export default LikeButton;
