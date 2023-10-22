import * as ftp from "basic-ftp";
export const connect = async (urlftp, userftp, passftp, portftp) => {
	try {
		const client = new ftp.Client();
		client.ftp.verbose = false;
		await client.access({
			host: urlftp,
			port: portftp,
			user: userftp,
			password: passftp,
		});
		return client;
	} catch (error) {
		return "login error";
	}
};
