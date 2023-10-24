import 'dotenv/config';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import { getLevelFromXP, xpRequiredForNextLevel } from '../services/levelingSystem.js';

export const handleRefreshToken = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.token || cookie.token === '') return res.sendStatus(401); // Unauthorize
    const oldRefreshToken = cookie.token;
    res.clearCookie('token', oldRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});

    try {
        const sqlUser = "SELECT * FROM users WHERE token = ?";
        const [reqUser] = await db.execute(sqlUser, [oldRefreshToken]);
        const foundUser = reqUser[0];
        if(!foundUser) return res.sendStatus(409); // No token user found

        jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                // Token Not Valid
                if(err || foundUser.id !== decoded.id) return res.sendStatus(403);
                // Token Valid
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
                // Update new token
                const usernameUser = foundUser.username;
                const XPUser = xpRequiredForNextLevel(foundUser.XP);
                const LVLUser = getLevelFromXP(foundUser.XP);
                const userAvatar = foundUser.avatar;
                const sqlUpdateToken = "UPDATE users SET token = ? WHERE id = ?";
                const [reqUpdateToken] = await db.execute(sqlUpdateToken, [refreshToken, foundUser.id]);
                if (reqUpdateToken.affectedRows === 0) return res.sendStatus(500);
                res.cookie('token', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
                res.json({accessToken, usernameUser, XPUser, LVLUser, userAvatar });
                res.status(200);
            }
        );
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}
