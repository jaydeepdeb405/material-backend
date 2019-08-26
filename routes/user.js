import Router from 'express';
import User from '../models/user';
const router = Router();

router.get('/all', (req, res) => {
    User.find({}, (err, Users) => {
        if (err) throw err;
        res.send(Users);
    })
});

router.post('/add', (req, res) => {
    const requestBody = req.body;
    new User({
        email: requestBody.email,
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        password: requestBody.password
    }).save().then((User) => {
        res.send(User);
    }).catch((err) => {
        res.send({ 'errorMessage': err.message });
    });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        User.authenticate(email, password, function (err, message, user) {
            if (err) res.sendStatus(500);
            else if (user) res.send({ user: { email: user.email, firstName: user.firstName, lastName: user.lastName }, session: req.sessionID });
            else res.send({ message: message });
        });
    } else {
        res.send({ message: "Email & password required" });
    }
});

router.post('/google-login', (req, res) => {
    console.log(req.body.token)
    const CLIENT_ID = '946880795736-5ojeo39e17n91ggfena8unt59bfnc0l7.apps.googleusercontent.com';
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        console.log(ticket)
        const payload = ticket.getPayload();
        console.log(payload)
        const userid = payload['sub'];
        console.log(userid)
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    verify().catch(console.error);
});

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy((err) => {
            if(err) res.sendStatus(500);
            res.sendStatus(200);
        });
    }
});

export default router;