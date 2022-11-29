import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NoteDto } from "./dto/note.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Note, NoteDocument } from "../schemas/note.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";

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
      throw new HttpException("User not found", 404);
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

  async getNotesSort(sort: string, id: string): Promise<NoteDocument[]> {

    const user = await this.userModel.findById(id).populate("note");
    const userResponse = JSON.parse(JSON.stringify(user));

    if(!user) throw new HttpException("", HttpStatus.UNAUTHORIZED); 

    if (sort === "title") {
      return userResponse.note.sort((a, b) => a.title - b.title);
    }
    if (sort === "date") {
      return userResponse.note.sort((a, b) => a.createdAt - b.createdAt);
    }
    if (sort === "daterev") {
      return userResponse.note.sort((a, b) => {
        if (b.createdAt < a.createdAt) {
          return -1;
        }
      });
    }
    if (sort === "priority") {
      return userResponse.note.sort((a, b) => a.priority - b.priority);
    }
    return userResponse.note;
  }

  async deleteNote(noteId: string, userId: string): Promise<HttpException> {
    try {
      await this.noteModel.deleteOne({ _id: noteId })
      await this.userModel.findByIdAndUpdate({_id: userId}, {$pull: {note: noteId}})

    } catch (e) {
      if (e) {
        throw new HttpException(`note does not exist, ${e}` , HttpStatus.BAD_REQUEST);
      }
    }
    return new HttpException("succes", HttpStatus.OK);
  }

  //
  async updateNote(updateNote: NoteDto, id: string): Promise<NoteDocument> {

    try {
      await this.noteModel.findOneAndUpdate({ _id: id }, { ...updateNote });

    } catch (e) {
      if (e) {
        throw new HttpException("note does not update", HttpStatus.BAD_REQUEST);
      }
    }
    return this.noteModel.findOne({ _id: id });
  }
}

