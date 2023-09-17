const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../data.json');
const axios = require('axios');

const urlUsers = 'http://localhost:3000/users'

passport.use(
    new LocalStrategy((email, password, done) => {
        const response = await axios.get(urlUsers);
        const users = response.data;
        const user = users.find(user => user.email === email);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = db.users.find(user => user.id === id);
    done(null, user);
});
