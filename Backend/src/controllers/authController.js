import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            isMFAActive: false,
        });
        console.log("New User: ", newUser);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user", message: error });

    }
};
export const login = async (req, res) => {
    console.log("The authenticated user is: ", req.user);
    res.status(200).json({
        message: "User logged in successfully",
        user: req.user,
        isMFAActive: req.user.isMFAActive,
    });

};
export const authStatus = async (req, res) => {

    if (req.user) {
        res.status(200).json({
            message: "User logged in successfully",
            user: req.user,
            isMFAActive: req.user.isMFAActive,
        });
    }
    else {
        res.status(401).json({ message: "User not authenticated" });
    }
};
export const logout = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "User not authenticated" });
    };
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie("connect.sid");             //clear cookie 
            res.status(200).json({ message: "Logged Out Successfully" });
        });
    });
};


export const setup2FA = async (req, res) => {
    try {
        console.log("The authenticated user is:", req.user);
        const user = req.user;
        var secret = speakeasy.generateSecret();
        console.log("The secret object is: ", secret);
        user.twofactorsecret = secret.base32;
        user.isMFAActive = true;
        await user.save();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.username}`,
            issuer: "2FA Authentication App",
            encoding: "base32",
        });
        const qrCode = await qrcode.toDataURL(url);
        res.status(200).json({
            secret: secret.base32,
            qrCode,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error setting up 2FA", message: error });
    }
};


export const verify2FA = async (req, res) => {
    const { token } = req.body;
    const user = req.user;
    const verified = speakeasy.totp.verify({
        secret: user.twofactorsecret,
        encoding: "base32",
        token,

    });

    if (verified) {
        const jwtToken = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            message: "2FA verified successfully",
            token: jwtToken,
            user: { username: user.username },
        });
    }
    else {
        res.status(400).json({ message: "Invalid 2FA token" });
    }
};


export const reset2FA = async (req, res) => {
    try {
        const user = req.user;
        user.twofactorsecret = "";
        user.isMFAActive = false;
        await user.save();
        res.status(200).json({ message: "2FA reset successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error resetting 2FA", message: error });

    }
};
