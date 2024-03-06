require("dotenv").config();
const express = require("express");
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/", indexRouter);
app.use("/user", userRouter);

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
