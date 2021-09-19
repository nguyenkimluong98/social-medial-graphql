const gql = require("graphql-tag");

module.exports = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
	}

	type Comment {
		id: ID!
		createdAt: String!
		username: String!
		body: String!
	}

	type Like {
		id: ID!
		createdAt: String!
		username: String!
	}

	type User {
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
	}

	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}

	type Query {
		login(username: String!, password: String!): User!

		# posts
		getPosts: [Post]
		getPost(postId: ID!): Post
	}

	type Mutation {
		register(registerInput: RegisterInput): User!

		# post
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!

		# comment
		createComment(postId: ID!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!

		# like
		likePost(postId: ID!): Post!
	}

	type Subscription {
		createPost: Post!
	}
`;
