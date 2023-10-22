import { Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");
import * as jwt from "jsonwebtoken";
const { v4: newId } = require("uuid");
import { pool } from "../../db/dataBase";
const bcrypt = require("bcrypt");
import { JWT_SECRET } from "./jwt";
import { FieldPacket } from "mysql2";
import { data } from "../interface/SingelData";

type Results = [data[], FieldPacket[]];
export const login = async (req: Request, res: Response) => {
	console.log("ftp Login");
	try {
		const { email, password } = req.body;
		if (req.body.length === 0) return res.status(StatusCodes.FORBIDDEN).end();

		if (!email.includes("@") || !email.includes(".")) return res.status(StatusCodes.FORBIDDEN).end();
		const [data] = (await pool.execute(`SELECT password FROM users WHERE email = :email`, {
			email,
		})) as Results;

		if (data.length === 0) {
			return res.status(StatusCodes.UNAUTHORIZED).end();
		}
		const user = await bcrypt.compare(password, data[0].password);
		if (!user) return res.status(StatusCodes.BAD_REQUEST).send("Invalid Email or Password.");
		const token = jwt.sign({ authorized: "authorized", email }, JWT_SECRET, { expiresIn: "30d" });

		res.status(StatusCodes.OK).json({ auth: `BearerFTP ${token}` });
	} catch (err) {
		res.status(StatusCodes.UNAUTHORIZED).json(err);
	}
};
