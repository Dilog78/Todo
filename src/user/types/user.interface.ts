import {Types} from "mongoose";

interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    note: Types.ObjectId[];
}

interface IUserResponse extends Omit<IUser, 'password'> {
}

export {IUserResponse, IUser};