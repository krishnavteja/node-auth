///<reference path="../../../typings/mongoose/mongoose.d.ts"/>

import * as mongoose from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    admin: boolean;
    
    comparePassword: any;
};

interface IUserModel extends IUser, mongoose.Document { }

export { IUserModel };
