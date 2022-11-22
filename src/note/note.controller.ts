import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from "@nestjs/common";
import {NoteDto} from "./dto/note.dto";
import {NoteService} from "./note.service";
import { NoteDocument } from "../initDB/note.schema";


@Controller()
export class NoteController {
    constructor(
        private readonly noteService: NoteService
    ) {}

    @Post('create')
    async create(@Body() createNote: NoteDto): Promise<NoteDocument> {
        return await this.noteService.create(createNote);
    }

    @Get('all')
    async getAll(@Query('sort') sort: string): Promise<NoteDocument[]> {
        return await this.noteService.getAll(sort)
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number): Promise<HttpException> {
        return await this.noteService.delete(id)
    }

    @Put('update/:id')
    async update(@Body() updateNote: NoteDto, @Param('id') id: number): Promise<NoteDocument> {
        return this.noteService.update(updateNote, id)
    }
}