import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import { Router } from 'express';
const router = Router();

//REGEX
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,254}$/;

const registerController = async (req, res) => {
    // Validation des données
    if(!req.body.username || !req.body.pwd || !req.body.matchPwd) return res.sendStatus(400); // Vide
    const validUsername = USERNAME_REGEX.test(req.body.username);
    const validPwd = PWD_REGEX.test(req.body.pwd);
    const validMatchPwd = req.body.pwd === req.body.matchPwd;
    if(!validUsername || !validPwd || !validMatchPwd) return res.sendStatus(400) // Not Validated

    // Insertion dans la base de donnée
    try {
        const sqlUserCheck = "SELECT * FROM users WHERE username = ?";
        const [reqUserCheck] = await db.execute(sqlUserCheck, [req.body.username.toString()]);
        if(reqUserCheck[0]) return res.sendStatus(409);// User Already registred

        const idUser = uuidv4();
        const salt = await bcrypt.genSalt(12);
        const hashPwd = await bcrypt.hash(req.body.pwd.toString(), salt);
        const sqlUser = "INSERT INTO users (`id`,`username`,`password`) VALUES (?, ?, ?)";
        const valuesqlUser = [idUser, req.body.username.toString(), hashPwd];
        const reqUser = await db.execute(sqlUser, valuesqlUser);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}
export default registerController;