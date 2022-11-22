import { Module } from '@nestjs/common';
import {NoteModule} from "./note/note.module";
import { MongooseModule } from "@nestjs/mongoose";
require('dotenv').config();


@Module({
  imports: [MongooseModule.forRoot(process.env.DB_CONN) ,NoteModule],
})
export class AppModule {}

