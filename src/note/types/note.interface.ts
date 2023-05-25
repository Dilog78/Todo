import {Types} from "mongoose";


interface INote {
    title: string;
    description: string;
    priority: number;
    status: boolean;
    _id: Types.ObjectId;
    user: Types.ObjectId;
}

type TypeNotes = Types.ObjectId[] | INote[];

export {INote, TypeNotes}