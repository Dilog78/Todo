import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NoteDto } from "./dto/note.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Note, NoteDocument } from "../schemas/note.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { UpdateNoteDto } from "./dto/updateNote.dto";

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async createNote(noteDto: NoteDto, id: string): Promise<NoteDocument> {
    const check = await this.userModel.findById(id);

    if (!check) {
      throw new HttpException("User Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return await this.noteModel.create({ user: id, ...noteDto })
      .then(async newNote => {
        await this.userModel.updateOne({ _id: id }, { $push: { note: newNote._id } });
        return newNote;
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }

  async getNotesSort(sort: string, id: string): Promise<Note[]> {
    if (sort === "title") {
      return await this.userModel.findById(id).populate({
        path: "note",
        options: { sort: { "title": 1 } }
      }).then(user => {
        if (!user) throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        return user.note;
      });
    }
    if (sort === "date") {
      return await this.userModel.findById(id).populate({
        path: "note",
        options: { sort: { "createdAt": 1 } }
      }).then(user => {
        if (!user) throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        return user.note;
      });
    }
    if (sort === "daterev") {
      return await this.userModel.findById(id).populate({
        path: "note",
        options: { sort: { "createdAt": -1 } }
      }).then(user => {
        if (!user) throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        return user.note;
      });
    }
    if (sort === "priority") {
      return await this.userModel.findById(id).populate({
        path: "note",
        options: { sort: { "priority": 1 } }
      }).then(user => {
        if (!user) throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        return user.note;
      });
    }
    return await this.userModel.findById(id).populate("note")
      .then(user => {
        if (!user) throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        return user.note;
      });
  }

  async deleteNote(noteId: string, userId: string): Promise<HttpException> {

    const user = await this.userModel.findByIdAndUpdate({ _id: userId }, { $pull: { note: noteId } });
    if (!user) throw new HttpException(`User UNAUTHORIZED`, HttpStatus.UNAUTHORIZED);

    const note = await this.noteModel.deleteOne({ _id: noteId });
    if (!note.deletedCount) throw new HttpException(`note does not exist`, HttpStatus.BAD_REQUEST);

    return new HttpException("succes", HttpStatus.OK);
  }

  async updateNote(updateNote: UpdateNoteDto, id: string): Promise<NoteDocument> {

    const note = await this.noteModel.findOneAndUpdate({ _id: id }, { ...updateNote });
    if (!note) throw new HttpException("note does not update", HttpStatus.BAD_REQUEST);

    return this.noteModel.findById(id);
  }
}

