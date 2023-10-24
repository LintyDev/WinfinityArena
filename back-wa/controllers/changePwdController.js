import 'dotenv/config';
import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,254}$/;

const changePwdController = async (req, res) => {
    if(!req.body.oldPwd || !req.body.newPwd || !req.body.matchNewPwd) return res.sendStatus(400);
    if(req.body.newPwd !== req.body.matchNewPwd) return res.sendStatus(401);
    const validNewPwd = PWD_REGEX.test(req.body.newPwd);
    if(!validNewPwd) return res.sendStatus(400);

    try {
        const sqlPwdUser = "SELECT * FROM users WHERE id = ?";
        const [reqPwdUser] = await db.execute(sqlPwdUser, [req._id]);
        const foundUser = reqPwdUser[0];
        const match = await bcrypt.compare(req.body.oldPwd.toString(), foundUser.password);
        if (match) {
            const sqlPwd = "UPDATE users SET password = ? WHERE id = ?";
            const salt = await bcrypt.genSalt(12);
            const newHashPwd = await bcrypt.hash(req.body.newPwd.toString(), salt);
            const [reqPwd] = await db.execute(sqlPwd, [newHashPwd, req._id]);
            if(reqPwd.affectedRows === 0) return res.sendStatus(500);
            res.sendStatus(200);
        } else {
            return res.sendStatus(409);
        }
    } catch (err) { 
        res.sendStatus(500);
    }
}

export default changePwdController