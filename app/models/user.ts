// get an instance of mongoose and mongoose.Schema
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { IUserModel } from "./interfaces/Iuser";

var SALT_WORK_FACTOR = 10;
var UserSchema: any = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    admin: Boolean
});

// There are better ways to handle the "this" keyword scope issue when handling events
// but using plain javascript is the simplest way.
UserSchema.pre('save', function(next, done) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (user)
    {
        if(user.isModified && !user.isModified('password')) return next();
    }
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err); 
    
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
    
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// I know there are better ways to handle the "this" keyword scope issue when handling events
// but using plain javascript is the simplest way.
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var User = mongoose.model<IUserModel>("User", UserSchema);

export { User };
