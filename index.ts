import * as express from "express";
const cookieParser = require("cookie-parser");
import * as cors from "cors";
const path = require("path");
const ftpRouts = require("./roters/ftpRouts");
const fileUpload = require("express-fileupload");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, "temp"), uploadTimeout: 0, defParamCharset: "utf8" }));

app.use(function (req, res, next) {
	req.accepts(["json", "html", "text/plain", "application/json"]);
	res.setHeader("Access-Control-Allow-Headers", ["Content-Type", "auth"]);
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Methods", "POST GET");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
});

app.use("/ftp", ftpRouts);

app.listen(3001, "0.0.0.0", () => {
	console.log("Listening on http://localhost:3001");
});
