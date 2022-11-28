import { IsEmail, IsNotEmpty } from "class-validator";


export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string
}