import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import userRoute from './routes/user';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'secret', name: 'session_id', saveUninitialized: false, resave: true}));
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        res.sendStatus(400);
    } else {
        next();
    }
});

app.use('/api/user', userRoute);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true })
.then(
    console.log('Connected to Mongo server')
)
.catch((err) => {
    console.error(`Mongo start error: ${err}`);
    process.exit(1);
});

const corsOptions = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent');
    next();
}

const server = app.listen(process.env.PORT || 3000, (err) => {
    if(err) throw err;
    console.log(`Express running on port ${server.address().port}`);
});