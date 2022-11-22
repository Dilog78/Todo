import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NoteDto } from "./dto/note.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Note, NoteDocument } from "../initDB/note.schema";
import { Model } from "mongoose";

@Injectable()
export class NoteService {
    constructor(
        @InjectModel(Note.name) private noteModel: Model<NoteDocument>
    ) {}

    async create(note: NoteDto): Promise<NoteDocument> {
        return await this.noteModel.create(note)
    }

    async getAll(sort: string): Promise<NoteDocument[]> {
        if(sort === 'title') {
            return this.noteModel.find().sort({title: 'asc'})
        }
        if(sort === 'date') {
            return this.noteModel.find().sort({createdAt: 'asc'})
        }
        if(sort === 'daterev') {
            return this.noteModel.find().sort({createdAt: 'desc'})
        }
        if(sort === 'priority') {
            return this.noteModel.find().sort({priority: 'asc' })
        }
        return this.noteModel.find();
    }

    async delete(id: number): Promise<HttpException> {
        try {
            await this.noteModel.deleteOne({_id: id})
        } catch (e) {
            if(e) {
                throw new HttpException('note does not exist', HttpStatus.BAD_REQUEST);
            }
        }
        return new HttpException('succes', HttpStatus.OK);
    }
    //
    async update(updateNote: NoteDto, id: number): Promise<NoteDocument> {

        try {
            await this.noteModel.findOneAndUpdate({ _id: id }, { ...updateNote })
        } catch (e) {
            if(e) {
                throw new HttpException('note does not update', HttpStatus.BAD_REQUEST);
            }
        }
        return this.noteModel.findOne({_id: id})
    }
}

