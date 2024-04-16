require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const port = process.env.PORT || 3000;
const mongoDb = process.env.DATABASE_URL;

const app = express();

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo conection error"));
db.on("connected", console.log.bind(console, "connected to database"));

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/", indexRouter);
app.use("/user", userRouter);

// Serve static files from the "public" directory
// there's no need to include 'public' in the path since it is part of the root
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
