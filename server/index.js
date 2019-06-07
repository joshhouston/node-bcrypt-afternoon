require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authController = require('./controllers/authController');
const treasureController = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');


const PORT = 4000;
const {CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected');
})

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
    })
)

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/logout', authController.logout);

app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', treasureController.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`listening on port ${PORT}`))