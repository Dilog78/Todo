import { Module } from '@nestjs/common';
import {NoteService} from "./note.service";
import {NoteController} from "./note.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Note, NoteSchema } from "../schemas/note.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [ AuthModule, MongooseModule.forFeature([{
        name: Note.name,
        schema: NoteSchema
    },{
        name: User.name,
        schema: UserSchema
    }])],
    controllers: [NoteController],
    providers: [NoteService],
})
export class NoteModule {}