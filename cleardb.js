#! /usr/bin/env node

require('dotenv').config();

console.log(
	'This script clears all users, all posts, and all comments'
);

const User = require('./models/user');
const Post = require('./models/post');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));

async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await clearUsers();
	await clearPosts();
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}

async function clearUsers() {
	await User.deleteMany({});
	console.log('deleted all users');
}
async function clearPosts() {
	await Post.deleteMany({});
	console.log('deleted all posts');
}
