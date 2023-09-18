const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const axios = require('axios');

const urlUsers = 'http://localhost:3000/users';

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => { // Add async here
        try {
            console.log('here');

            const response = await axios.get(urlUsers);
            const users = response.data;

            console.log(users);

            const user = users.find(user => user.email === email);

            if (!user || !bcrypt.compare(password, user.password)) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            return done(null, user);
        } catch (error) {
            console.log(error);
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => { // Add async here
    try {
        const response = await axios.get(urlUsers);
        const users = response.data;
        const user = users.find(user => user.id === id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});