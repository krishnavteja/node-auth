// get an instance of mongoose and mongoose.Schema
import * as mongoose from "mongoose";
import { IUserModel } from "./interfaces/Iuser";

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String,
    admin: Boolean
});

var User = mongoose.model<IUserModel>("User", userSchema);

export { User };
