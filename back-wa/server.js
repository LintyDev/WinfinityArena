import 'dotenv/config'
import cors from 'cors';
import express, { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import webSockets from './sockets/index.js';
import credentials from './middleware/credentials.js';
import corsOptions from './config/corsOptions.js';
import verifyJWT from './middleware/verifyJWT.js';
// Modules Routes
import authRoute from './routes/auth.js';
import refreshRoute from './routes/refresh.js';
import profileRoute from './routes/profile.js';

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);


// Middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(urlencoded({extended: false}));
app.use(json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);

//WebSockets 
webSockets(server);

// Verify Routes
app.use(verifyJWT);

// Profile Routes
app.use('/profile', profileRoute);

// 404 Error 
app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('json')) {
        res.json({'error' : '404 Not found !'});
    } else {
        res.type('txt').send('404 Not found !');
    }
})

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));