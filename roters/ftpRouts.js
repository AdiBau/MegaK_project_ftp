const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { client } = require("../db/database/connect");
const { authorization } = require("./controllers/authorization");
import { login } from "./controllers/login";
import { register } from "./controllers/register";
import { logOut } from "./controllers/logout";
import { connectFTP, disConnect } from "./controllers/connectDisconnect";
import { list, listGetOne } from "./controllers/list";
import { ftpOptionsSave, getFtpOptions } from "./controllers/ftpOptions";
import { file, newFolder } from "./controllers/uploadFile";

import { removeFile } from "./controllers/removeFile";

const ftpRouter = express.Router();

ftpRouter.route("/connect").get(authorization, connectFTP);
ftpRouter.route("/disconnect").get(disConnect);

ftpRouter.route("/newfolder").put(authorization, newFolder);
ftpRouter.route("/list").get(authorization, list);

ftpRouter.route("/listGetOne").get(authorization, listGetOne);
ftpRouter.route("/file").post(authorization, file);
ftpRouter.route("/ftpOptions").post(authorization, ftpOptionsSave).get(authorization, getFtpOptions);
ftpRouter.route("/removeFile").delete(authorization, removeFile);
ftpRouter
	.route("/login")
	.post(login)
	.get(authorization, (req, res) => res.status(200).end());
ftpRouter.route("/register").post(register);
ftpRouter.route("/logOut").get(logOut);
module.exports = ftpRouter;
