import { Sequelize } from "sequelize";
import {DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME} from "../config/env.js";

const sequelize = new Sequelize(
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: false
        },
    }
);

const connectToDB = async() => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch(e) {
        console.error('Error connecting to the database: ',e);
    }
}

export default connectToDB;