import gql from "graphql-tag";

const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			username
			body
			createdAt

			likeCount

			likes {
				username
			}

			commentCount

			comments {
				id
				username
				body
				createdAt
			}
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query GetPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			username
			body
			createdAt

			likeCount

			likes {
				username
			}

			commentCount

			comments {
				id
				username
				body
				createdAt
			}
		}
	}
`;

const LIKE_POST_MUTATION = gql`
	mutation LikePost($postId: ID!) {
		likePost(postId: $postId) {
			id

			likes {
				id
				username
			}

			likeCount
		}
	}
`;

const DELETE_POST_MUTATION = gql`
	mutation DeletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const CREATE_COMMENT_MUTATION = gql`
	mutation CreateComment($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				username
				body
				createdAt
			}
			commentCount
		}
	}
`;

const DELELTE_COMMENT_MUTATION = gql`
	mutation DeleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				body
				createdAt
			}
			commentCount
		}
	}
`;

export {
	FETCH_POSTS_QUERY,
	LIKE_POST_MUTATION,
	FETCH_POST_QUERY,
	DELETE_POST_MUTATION,
	DELELTE_COMMENT_MUTATION,
	CREATE_COMMENT_MUTATION,
};
