import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { UserDto } from "../user/dto/user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async login(userDto: UserDto): Promise<any> {

    const user = await this.usersService.getUser(userDto.email);
    if (!user) {
      throw new HttpException("Credentials are not valid", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isValidPass = await bcrypt.compare(userDto.password, user.password);
    if (!isValidPass) {
      throw new HttpException("Credentials are not valid", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return {
      token: this.jwtService.sign({ id: user._id }, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d'}),
      email: user.email
    };
  }
}

