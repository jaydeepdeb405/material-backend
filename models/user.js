import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10; 
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
    const user = this;
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email: email }, function(err, user) {
        const message = 'Invalid username or password';
        if(err) callback(err);
        else if(!user) return callback(null, message);
        if(user) {
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if(err) callback(err);
                if(isMatch) callback(null, 'success', user);
                else return callback(null, message);
            });
        }
    });
};

const User = mongoose.model('user', UserSchema);
export default User;