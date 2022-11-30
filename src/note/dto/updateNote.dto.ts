import { IsBoolean, IsBooleanString, IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";


export class UpdateNoteDto {
    @IsNotEmpty()
    @Length(1, 45)
    readonly title: string

    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsNumberString()
    readonly priority: number

    @IsBooleanString()
    readonly status: boolean
}