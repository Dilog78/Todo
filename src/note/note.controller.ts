import { Controller, Delete, Get, HttpException, Post, Put, UseGuards, Request, Param, Body } from "@nestjs/common";
import { NoteDto } from "./dto/note.dto";
import { NoteService } from "./note.service";
import { Note, NoteDocument } from "../schemas/note.schema";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";


@Controller()
export class NoteController {
  constructor(
    private readonly noteService: NoteService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  async createNote(@Request() req): Promise<NoteDocument> {
    const { id } = req.user;
    const createNote: NoteDto = req.body;
    return await this.noteService.createNote(createNote, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("getnotes")
  async getNotesSort(@Request() req): Promise<Note[]> {
    const { id } = req.user;
    const { sort } = req.query;
    return await this.noteService.getNotesSort(sort, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  async deleteNote(@Request() req): Promise<HttpException> {
    const noteId = req.params.id;
    const userId = req.user.id;
    return await this.noteService.deleteNote(noteId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("update/:id")
  async updateNote(@Body() updateNote: NoteDto, @Param("id") id: string): Promise<NoteDocument> {
    return this.noteService.updateNote(updateNote, id);
  }
}