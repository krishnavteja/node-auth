///<reference path="../../../typings/mongoose/mongoose.d.ts"/>

import * as mongoose from "mongoose";

interface IUser {
    email: string;
    password: string;
    displayName: string;
    admin: boolean;
};

interface IUserModel extends IUser, mongoose.Document { }

export { IUserModel };
