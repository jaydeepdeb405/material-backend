import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if(err) return done(err);
        if(!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        user.comparePassword(password, function (err, isMatch) {
            if(err) return done(err);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            else {
                return done(null, user, { message: 'Success.' });
            }                
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
    done(err, user);
});
});

export default passport;