import db from "../config/db.js"

const logoutController = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.token) return res.sendStatus(204); // No content
    const refreshToken = cookie.token;

    try {
        const sqlToken = "SELECT * FROM users where token = ?";
        const [reqToken] = await db.execute(sqlToken, [refreshToken]);
        const foundUser = reqToken[0];

        if(!foundUser) {
            res.clearCookie('token', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            return res.sendStatus(204); // No content
        } else {
            const sqlDeleteToken = "UPDATE users SET token = '' WHERE id = ?";
            const [reqDeleteToken] = await db.execute(sqlDeleteToken, [foundUser.id]);
            res.clearCookie('token', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            res.sendStatus(204); // No content
        }
    } catch(err) {
        res.sendStatus(500);
    }
}

export default logoutController