import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {HydratedDocument, Types} from "mongoose";
import { User } from "./user.schema";

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  priority: number;

  @Prop({ required: true, default: false})
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;

}

export const NoteSchema = SchemaFactory.createForClass(Note);