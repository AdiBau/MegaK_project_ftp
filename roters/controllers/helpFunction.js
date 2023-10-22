import * as jwt from "jsonwebtoken";
import { pool } from "../../db/dataBase";

import { JWT_SECRET } from "./jwt";

export const readFtpSetings = async (auth) => {
	try {
		const { email } = jwt.decode(auth.split(" ")[1], JWT_SECRET);
		const [data] = await pool.execute(`SELECT urlFtp, portFtp, passFtp, userFtp FROM users WHERE email = :email`, {
			email,
		});
		return data[0];
	} catch (error) {
		console.log("readFtpSetings error: " + error);
		return null;
	}
};
