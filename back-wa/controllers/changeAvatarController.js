import 'dotenv/config';
import db from '../config/db.js';


const changeAvatarController = async (req, res) => {
    if (!req.body.newAvatar) return res.sendStatus(400);
    try {
        const sqlAvatar = "UPDATE users SET avatar = ? WHERE id = ?";
        const [reqAvatar] = await db.execute(sqlAvatar, [req.body.newAvatar.toString(), req._id]);
        if(reqAvatar.affectedRows === 0) return res.sendStatus(500);
        res.sendStatus(200);
    } catch (error) {
        if(error) {
            res.sendStatus(500);
        }
    }
}

export default changeAvatarController