import 'dotenv/config';
import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Unauthorize
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //Token expired
            req._id = decoded.id;
            next();
        }
    )    
}

export default verifyJWT