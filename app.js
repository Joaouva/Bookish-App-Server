require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("./configs/passport");

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((x) => {
		console.log(
			`Connected to Mongo! Database name: "${x.connections[0].name}"`
		);
	})
	.catch((err) => {
		console.error("Error connecting to mongo", err);
	});

const app_name = require("./package.json").name;
const debug = require("debug")(
	`${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
	require("node-sass-middleware")({
		src: path.join(__dirname, "public"),
		dest: path.join(__dirname, "public"),
		sourceMap: true,
	})
);

app.use(express.static(path.join(__dirname, "dist")));

app.use(
	session({
		secret: "bokiniapp",
		cookie: { expire: 60000 },
		rolling: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

app.use(
	cors({
		credentials: true,
		origin: [process.env.CLIENT_HOSTNAME],
	})
);

const index = require("./routes/index");
app.use("/", index);

const books = require("./routes/book-routes");
app.use("/api", books);

const auth = require("./routes/auth-routes");
app.use("/api", auth);

module.exports = app;
