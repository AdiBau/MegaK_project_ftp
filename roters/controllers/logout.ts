import { Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");
const { client, connect } = require("../../db/database/connect");

export const logOut = async (req: Request, res: Response) => {
	res.clearCookie("auth");
	return res.status(StatusCodes.OK).end();
};
