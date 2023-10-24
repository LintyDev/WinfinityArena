import 'dotenv/config';
import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

import { getLevelFromXP, xpRequiredForNextLevel } from '../services/levelingSystem.js';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,254}$/;

const loginController = async (req, res) => {
    if(!req.body.username || !req.body.pwd) return res.sendStatus(400); // Vide
    const validUsername = USERNAME_REGEX.test(req.body.username);
    const validPwd = PWD_REGEX.test(req.body.pwd);
    if(!validUsername || !validPwd) return res.sendStatus(400); // Not valid

    try {
        const sqlUser = "SELECT * FROM users WHERE username = ?";
        const [reqUserCheck] = await db.execute(sqlUser, [req.body.username.toString()]);
        const foundUser = reqUserCheck[0];
        if(!foundUser) return res.sendStatus(400); // user not found

        const match = await bcrypt.compare(req.body.pwd.toString(), foundUser.password);
        if (match) {
            const accessToken = jwt.sign(
                {id: foundUser.id, username: foundUser.username},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "900s"}
            );
            const refreshToken = jwt.sign(
                {id: foundUser.id, username: foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: "2628000s"}
            );
            // Insert token to db
            const usernameUser = foundUser.username;

            const XPUser = xpRequiredForNextLevel(foundUser.XP);
            const LVLUser = getLevelFromXP(foundUser.XP);
            const userAvatar = foundUser.avatar;
            const sqlToken = "UPDATE users SET token = ? WHERE username = ?";
            const [reqToken] = await db.execute(sqlToken, [refreshToken, usernameUser]);
            if(reqToken.affectedRows === 0) return res.sendStatus(500);
            res.cookie('token', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            res.json({accessToken, usernameUser, XPUser, LVLUser, userAvatar });
            res.status(200);
        } else {
            return res.sendStatus(400); // Combinaire incorrect
        }
    }catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
};

export default loginController;
