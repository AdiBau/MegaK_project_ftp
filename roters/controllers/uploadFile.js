const { tempPath } = require("./tempPath");
const { rm } = require("fs").promises;
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const { connect } = require("../../db/database/connect");
import { readFtpSetings } from "./helpFunction";

export const file = async (req, res) => {
	console.log("Plik");
	try {
		const file = req.files.file;
		const filename = req.files.file.name;
		const pathURL = req.headers.path;

		await file.mv(path.join(tempPath, filename));

		const { urlFtp, userFtp, passFtp, portFtp } = await readFtpSetings(req.headers.auth);

		const client = await connect(urlFtp, userFtp, passFtp, portFtp);
		await client.cd(pathURL);

		await client.uploadFrom(path.join(tempPath, filename), filename);
		await rm(path.join(tempPath, filename));
		client.close();
		return res.status(StatusCodes.CREATED).end();
	} catch (error) {
		console.log("Plik Error ", error);
		return res.status(StatusCodes.BAD_REQUEST).end();
	}
};

export const newFolder = async (req, res) => {
	console.log("new Folder");
	try {
		const newFolder = req.headers.foldername;
		const pathURL = req.headers.path;
		const { urlFtp, userFtp, passFtp, portFtp } = await readFtpSetings(req.headers.auth);
		const client = await connect(urlFtp, userFtp, passFtp, portFtp);
		await client.cd(pathURL);
		await client.ensureDir(newFolder);
		client.close();
		return res.status(StatusCodes.CREATED).end();
	} catch (error) {
		console.log("Error NewFolder ", error);
	}
	return res.status(StatusCodes.BAD_REQUEST).end();
};
