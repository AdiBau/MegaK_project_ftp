import { StatusCodes } from "http-status-codes";
import { client, connect } from "../../db/database/connect";
import { readFtpSetings } from "./helpFunction";
export const connectFTP = async (req, res) => {
	console.log("Connect");
	try {
		const { urlFtp, userFtp, passFtp, portFtp } = await readFtpSetings(req.headers.auth);
		if (!urlFtp || !userFtp || !passFtp || !portFtp) {
			return res.status(StatusCodes.BAD_REQUEST).end();
		}

		const client = await connect(urlFtp, userFtp, passFtp, portFtp);

		if (!client) {
			return res.status(StatusCodes.BAD_REQUEST).send("login error");
		}

		client.close();
		return res.status(StatusCodes.OK).end();
	} catch (error) {
		console.log("Connect error :", error);
		return res.status(StatusCodes.BAD_REQUEST).send("login error");
	}
};
export const disConnect = async (req, res) => {
	if (client) await client.close();
	res.status(StatusCodes.OK).send("Rozłączono");
};
