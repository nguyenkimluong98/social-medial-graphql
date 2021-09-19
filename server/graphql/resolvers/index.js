const postResolvers = require("./post");
const userResolvers = require("./user");
const commentResolvers = require("./comment");

module.exports = {
	Post: {
		likeCount: (parent) => parent.likes.length,
		commentCount: (parent) => parent.comments.length,
	},
	Query: {
		...userResolvers.Query,
		...postResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...postResolvers.Mutation,
		...commentResolvers.Mutation,
	},
	Subscription: {
		...postResolvers.Subscription,
	},
};
