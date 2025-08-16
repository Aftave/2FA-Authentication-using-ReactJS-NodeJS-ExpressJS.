import {connect} from "mongoose";
import dotenv from "dotenv";


const dbconnect = async () => {
    try {
        const mongoDbConnection = await connect(process.env.CONNECTION_STRING, {dbName: "2fa-authentication-cluster"});
        console.log(`Database connected: ${mongoDbConnection.connection.host}`);
    } catch (err) {
        console.error(`Database connection failed: ${err}`);
        process.exit(1);
    }
};

export default dbconnect;