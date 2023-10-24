import 'dotenv/config';
import express from 'express';
import db from '../config/db.js';
const router = express();

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,24}$/;

const changeUsernameController = async (req, res) => {
    const username = req.body.username;
    if(!username) return res.sendStatus(400); // Vide
    const validUsername = USERNAME_REGEX.test(username);
    if(!validUsername) return res.sendStatus(400) // Username no valid

    try {
        const sqlUser = "SELECT * FROM users WHERE username = ?";
        const [reqUser] = await db.execute(sqlUser, [username.toString()]);
        const foundUser = reqUser[0];
        if(foundUser) return res.sendStatus(409); // Username already taken

        const sqlNewUsername = "UPDATE users SET username = ? WHERE id = ?";
        const [reqNewUsername] = await db.execute(sqlNewUsername, [username, req._id]);
        if(reqNewUsername.affectedRows === 0) return res.sendStatus(500);
        
        res.json({newUsername: username});
        res.status(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export default changeUsernameController