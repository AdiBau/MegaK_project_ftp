import { readFtpSetings } from "./helpFunction";

const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const { JWT_SECRET } = require("./jwt");
const { pool } = require("../../db/dataBase");

export const ftpOptionsSave = async (req, res) => {
	console.log("FtpOptionsave");
	try {
		const { urlFtp, userFtp, passFtp, portFtp } = req.body;

		const { email } = await jwt.decode(req.headers.auth.split(" ")[1], JWT_SECRET);

		const [data] = await pool.execute(`UPDATE users SET urlFtp = :urlFtp ,portFtp = :portFtp , passFtp = :passFtp , userFtp =:userFtp WHERE email = :email`, {
			urlFtp,
			portFtp,
			passFtp,
			userFtp,
			email,
		});
		console.log(data);
		res.status(StatusCodes.OK).end();
	} catch (err) {
		console.log("FtpOptionSave", err);
	}
};

export const getFtpOptions = async (req, res) => {
	console.log("getFtp options");
	try {
		const data = await readFtpSetings(req.headers.auth);

		res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log("Error z getFtpOptions", err);
	}
};
