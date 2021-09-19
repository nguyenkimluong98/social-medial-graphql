import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import {
	DELELTE_COMMENT_MUTATION,
	DELETE_POST_MUTATION,
	FETCH_POSTS_QUERY,
} from "../utils/graphql";

import { Button, Confirm, Icon } from "semantic-ui-react";

function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELELTE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		update(cache) {
			setConfirmOpen(false);

			if (!commentId) {
				const data = cache.readQuery({
					query: FETCH_POSTS_QUERY,
				});

				cache.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: {
						...data,
						getPosts: data.getPosts.filter((post) => post.id !== postId),
					},
				});
			}

			if (callback) callback();
		},
		onError() {
			setConfirmOpen(false);
		},
		variables: { postId, commentId },
	});

	return (
		<>
			<Button as="div" floated="right" onClick={() => setConfirmOpen(true)}>
				<Icon color="red" name="trash" style={{ margin: 0 }} />
			</Button>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrComment}
			/>
		</>
	);
}

export default DeleteButton;
