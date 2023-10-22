import { readFtpSetings } from "./helpFunction";

const { StatusCodes } = require("http-status-codes");
const path = require("path");
const { connect } = require("../../db/database/connect");
const { rm } = require("fs").promises;
const { tempPath } = require("./tempPath");

export const list = async (req, res) => {
	console.log("ftp List");
	try {
		const pathList = req.headers.path;
		const { urlFtp, userFtp, passFtp, portFtp } = await readFtpSetings(req.headers.auth);

		const client = await connect(urlFtp, userFtp, passFtp, portFtp);
		if (pathList) await client.cd(pathList);
		const list = await client.list();
		const pwd = await client.pwd();
		client.close();
		return res.status(StatusCodes.OK).json([list, pwd]);
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.FORBIDDEN).end();
	}
};

export const listGetOne = async (req, res) => {
	console.log("listGetOne");
	try {
		const name = req.headers.filename;
		const pathURL = req.headers.path;
		const { urlFtp, userFtp, passFtp, portFtp } = await readFtpSetings(req.headers.auth);

		if (!name) return res.status(StatusCodes.BAD_REQUEST).end();

		const client = await connect(urlFtp, userFtp, passFtp, portFtp);
		if (name) {
			await client.cd(pathURL);
			console.log("jest");
			await client.downloadTo(`${tempPath}/${name}`, name);
			client.close();
			res.setHeader("filename", name);
			await res.download(`${tempPath}/${name}`);
			return await rm(`${tempPath}/${name}`);
		}
	} catch (error) {
		console.log(error);
		res.status(StatusCodes.FORBIDDEN).end();
	}
};
