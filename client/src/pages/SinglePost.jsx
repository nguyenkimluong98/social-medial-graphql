import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";

import { CREATE_COMMENT_MUTATION, FETCH_POST_QUERY } from "../utils/graphql";
import { AuthContext } from "../contexts/auth";

import {
	Button,
	Card,
	Form,
	Grid,
	Icon,
	Image,
	Label,
} from "semantic-ui-react";

import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
	let postMarkup;
	const postId = props.match.params.postId;

	const [comment, setComment] = useState("");

	const { user } = useContext(AuthContext);

	const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
		update() {
			setComment("");
		},
		variables: { postId, body: comment },
	});

	const deletePostCallback = () => {
		props.history.push("/");
	};

	if (loading) {
		postMarkup = "Loading post...";
	} else if (error) {
		postMarkup`Error! ${error.message}`;
	} else {
		const {
			id,
			body,
			username,
			likes,
			likeCount,
			comments,
			commentCount,
			createdAt,
		} = data.getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							floated="right"
							size="small"
							src="https://react.semantic-ui.com//images/avatar/large/molly.png"
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={{ id, likes, likeCount }} />
								<Button
									as="div"
									labelPosition="right"
									onClick={() => alert("comment on post")}
								>
									<Button color="blue" basic>
										<Icon name="comment" />
									</Button>
									<Label color="blue" pointing="left" basic>
										{commentCount}
									</Label>
								</Button>
								{user && user.username === username && (
									<DeleteButton postId={id} callback={deletePostCallback} />
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												placeholder="Comment.."
												name="comment"
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											/>
											<button
												type="submit"
												className="ui button teal"
												disabled={comment.trim() === ""}
												onClick={createComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
}

export default SinglePost;
