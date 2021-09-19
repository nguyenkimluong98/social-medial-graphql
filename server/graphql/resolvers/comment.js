const { UserInputError } = require("apollo-server-express");
const Post = require("../../models/Post");

const checkAuth = require("../../utils/auth");

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			console.log("into createComment");
			const { username } = checkAuth(context);

			if (body.trim() === "") {
				throw new UserInputError("Empty comment", {
					errors: {
						body: "Comment body must not empty",
					},
				});
			}

			const post = await Post.findById(postId);

			if (post) {
				post.comments.unshift({
					body,
					username,
					createdAt: new Date().toISOString(),
				});

				await post.save();

				return post;
			}

			throw new UserInputError("Post not found");
		},

		deleteComment: async (_, { postId, commentId }, context) => {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				const commentIndex = post.comments.findIndex((c) => c.id === commentId);

				if (
					post.comments[commentIndex] &&
					post.comments[commentIndex].username === username
				) {
					post.comments.splice(commentIndex, 1);
					await post.save();

					return post;
				}

				throw new AuthenticationError("Action not allowed");
			}

			throw new UserInputError("Post not found");
		},

		likePost: async (_, { postId }, context) => {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				const likeIndex = post.likes.findIndex((c) => c.username === username);

				if (post.likes[likeIndex]) {
					post.likes.splice(likeIndex, 1);
				} else {
					post.likes.unshift({
						createdAt: new Date().toISOString(),
						username,
					});
				}

				await post.save();

				return post;
			}

			throw new UserInputError("Post not found");
		},
	},
};
