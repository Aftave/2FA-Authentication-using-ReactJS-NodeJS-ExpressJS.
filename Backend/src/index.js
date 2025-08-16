import express, { json, urlencoded } from 'express';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import dbconnect from './config/dbconnect.js';
import authrouts from './routes/authrouts.js';
import "./config/passportConfig.js"; 



dotenv.config();
dbconnect();


const app = express();

const corsOptions = {
    origin: ["http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(json({limit: "100mb"}));
app.use(urlencoded({limit:"100mb", extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 60000 * 60,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/auth", authrouts)


const PORT = process.env.PORT || 7002;

app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
});