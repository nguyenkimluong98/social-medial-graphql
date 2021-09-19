import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { Button, Card, Icon, Image, Label } from "semantic-ui-react";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = (props) => {
	const { post, user } = props;
	const { id, username, body, likeCount, commentCount, likes, createdAt } =
		post;

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com//images/avatar/large/molly.png"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow(true)}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton post={{ id, likes, likeCount }} />
				<Button as={Link} to={`/post/${id}`} labelPosition="right">
					<Button color="blue" basic>
						<Icon name="comment" />
					</Button>
					<Label basic color="blue" pointing="left">
						{commentCount}
					</Label>
				</Button>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
