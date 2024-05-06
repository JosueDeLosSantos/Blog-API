#! /usr/bin/env node

require("dotenv").config();

console.log("This script clears all users, all posts, and all comments");

const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));

/**
 * Connects to the MongoDB database, clears all users, posts, and comments, and then closes the connection.
 *
 * @return {Promise<void>} Promise that resolves when the function completes successfully.
 */
async function main() {
	console.log("Debug: About to connect");
	await mongoose.connect(mongoDB);
	console.log("maxPoolSize takes care of connections");

	await User.deleteMany({});
	console.log("deleted all users");
	await Post.deleteMany({});
	console.log("deleted all posts");
	await Comment.deleteMany({});
	console.log("deleted all comments");
	console.log("closing connection");
	await mongoose.connection.close();
}
