import { Module } from '@nestjs/common';
import {NoteModule} from "./note/note.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
require('dotenv').config();


@Module({
  imports: [MongooseModule.forRoot(process.env.DB_CONN) ,NoteModule, UserModule],
})
export class AppModule {}

