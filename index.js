require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const port = process.env.PORT || 3000;
/* mongodb connection string pattern:
 * DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.clyk6yk.mongodb.net/<databasename>?retryWrites=true&w=majority&appName=Cluster0"
 */
const mongoDb = process.env.DATABASE_URL;

const app = express();

mongoose.connect(mongoDb, { maxPoolSize: 4 }); // amount of allowed connections
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo conection error"));
db.on("connected", console.log.bind(console, "connected to database"));

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/", indexRouter);
app.use("/user", userRouter);

// Serve static files from the "public" directory
// adding 'public' in the virtual path is not a requirement
app.use("/public/uploads/", express.static(path.join(__dirname, "public", "uploads")));

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
