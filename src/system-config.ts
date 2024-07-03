import * as process from "process";
require('dotenv').config();

type DatabaseConfig = {
	host: string,
	port: string,
	username: string,
	password: string,
	database: string,
}
export default ():{port: number, database: DatabaseConfig} => ({
	port: parseInt(process.env.PORT, 10) || 3000,
	database: {
		host: process.env.ENV === 'development' ? 'localhost' : process.env.POSTGRES_HOST,
		port: process.env.DATABASE_PORT,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
	}
});