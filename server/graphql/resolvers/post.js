const {
	UserInputError,
	AuthenticationError,
} = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");

const Post = require("../../models/Post");
const checkAuth = require("../../utils/auth");

const pubsub = new PubSub();

module.exports = {
	Query: {
		getPosts: async () => {
			console.log("into getPosts");
			try {
				return await Post.find();
			} catch (error) {
				throw new Error(error);
			}
		},

		getPost: async (_, { postId }) => {
			try {
				const post = await Post.findById(postId);

				if (!post) {
					throw new Error("Post not found!");
				}

				return post;
			} catch (error) {
				throw new Error(error);
			}
		},
	},
	Mutation: {
		createPost: async (_, { body }, context) => {
			console.log("into get one post");
			const user = checkAuth(context);

			if (body.trim() === "") {
				throw new UserInputError("Post body must be provided");
			}

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});

			const result = await newPost.save();

			pubsub.publish("NEW_POST", { createPost: result });

			return result;
		},
		deletePost: async (_, { postId }, context) => {
			try {
				const post = await Post.findById(postId);

				if (!post) {
					throw new Error("Post not found!");
				}

				const user = checkAuth(context);

				if (user.username === post.username) {
					await post.delete();
					return "Post deleted successfully";
				}

				throw new AuthenticationError("Action not allowed");
			} catch (error) {
				throw new Error(error);
			}
		},
	},
	Subscription: {
		createPost: {
			subscribe: () => pubsub.asyncIterator(["NEW_POST"]),
		},
	},
};
