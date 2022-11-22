import { IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";


export class NoteDto {
    @IsNotEmpty()
    @Length(1, 45)
    readonly title: string

    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsNumberString()
    readonly priority: number
}