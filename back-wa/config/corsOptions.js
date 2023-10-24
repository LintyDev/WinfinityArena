import allowOrigins from './allowedOrigins.js'

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (allowOrigins.indexOf(origin) !== 1){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
}

export default corsOptions;