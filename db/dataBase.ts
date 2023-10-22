import { createPool } from "mysql2/promise";

export const pool = createPool({
	host: "www.XYZ.pl",
	user: "USERNAME",
	password: "PASSWORD",
	database: "DATABASENAME",
	namedPlaceholders: true,
	decimalNumbers: true,
	bigNumberStrings: false,
});
