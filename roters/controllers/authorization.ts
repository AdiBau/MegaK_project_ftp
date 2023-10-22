import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./jwt";

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.auth) return res.status(StatusCodes.UNAUTHORIZED).end();
		const { auth } = req.headers;
		if (auth.toString() || auth.toString() !== "undefined") {
			if (auth?.toString().startsWith("BearerFTP")) {
				const token = auth.toString().split(" ")[1];
				const cos = jwt.verify(token, JWT_SECRET);
				console.log("auth ok");
				next();
			}
		} else {
			console.log("auth not");
			return res.status(StatusCodes.UNAUTHORIZED).end();
		}
	} catch (err) {
		console.log("Error z authenticated ", err);
		return res.status(StatusCodes.UNAUTHORIZED).end();
	}
};
