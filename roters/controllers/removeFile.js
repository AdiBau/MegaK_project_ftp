import { readFtpSetings } from "./helpFunction";
const { StatusCodes } = require("http-status-codes");

const { connect } = require("../../db/database/connect");
export const removeFile = async (req, res) => {
	console.log("Removing file");
	const pathList = req.headers.path;
	const name = req.headers.filename;

	try {
		if (!name) return res.status(StatusCodes.BAD_REQUEST).end();

		const { urlFtp, userFtp, passFtp, portFtp } = await readFtpSetings(req.headers.auth);

		const client = await connect(urlFtp, userFtp, passFtp, portFtp);
		if (name) {
			await client.cd(pathList);
			await client.remove(name);
			client.close();

			return res.status(200).end();
		}
	} catch (error) {
		console.log("Removing File error ", error);
		res.status(StatusCodes.FORBIDDEN).end();
	}
};
