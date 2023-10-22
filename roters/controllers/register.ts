import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as newId } from "uuid";
import { pool } from "../../db/dataBase";
import * as bcrypt from "bcrypt";
import { FieldPacket } from "mysql2";
import { data } from "../interface/SingelData";
import { ResultSetHeader } from "../interface/ResultSetHeader";
const saltRounds = 10;

type Results = [data[], FieldPacket[]];
export const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email.includes("@") || !email.includes(".")) {
			return res.status(StatusCodes.FORBIDDEN).end();
		}
		const [user] = (await pool.execute(`SELECT * FROM users WHERE email = :email`, {
			email,
		})) as Results;

		if (user.length !== 0) {
			return res.status(StatusCodes.FORBIDDEN).end();
		}
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(password, salt);

		const [data] = (await pool.execute(`INSERT INTO users VALUES (:id , :email, :password,urlFtp, portFtp, passFtp, userFtp, lastModified)`, {
			id: newId(),
			email,
			password: hash,
		})) as ResultSetHeader[];

		if (data.affectedRows === 0) {
			return res.status(StatusCodes.UNAUTHORIZED).end();
		}

		return res.status(StatusCodes.OK).end();
	} catch (err) {
		res.status(StatusCodes.UNAUTHORIZED).json(err);
		console.log(err);
	}
};
