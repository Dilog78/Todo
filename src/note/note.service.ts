import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NoteDto } from "./dto/note.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Note, NoteDocument } from "../schemas/note.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { UpdateNoteDto } from "./dto/updateNote.dto";
import { INote, TypeNotes } from "./types/note.interface";

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  private readonly collSort = new Map<String, String>([
    ["title", "title"],
    ["date", "createdAt"],
    ["daterev", "createdAt"],
    ["priority", "priority"]
  ]);

  async createNote(noteDto: NoteDto, id: string): Promise<INote> {
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

  async getCompleted(id: string): Promise<TypeNotes> {
    return await this.userModel.findById(id).populate({
      path: "note",
      match: { status: true }
    }).then(user => {
      if (!user) throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
      return user.note;
    });
  }

  async getNotesSort(sort: string, id: string): Promise<TypeNotes> {

    const sortValue = this.collSort.get(sort);

    return this.userModel.findById(id).populate({
      path: 'note',
      options: { sort: sortValue }
    }).then(user => {
      if (!user) {
        throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
      }
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

  async updateNote(updateNote: UpdateNoteDto, id: string): Promise<INote> {

    const note = await this.noteModel.findOneAndUpdate({ _id: id }, { ...updateNote });
    if (!note) throw new HttpException("note does not update", HttpStatus.BAD_REQUEST);

    return this.noteModel.findById(id);
  }
}

