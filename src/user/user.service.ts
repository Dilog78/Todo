import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { UserDto } from "./dto/user.dto";
import {IUser, IUserResponse} from "./types/user.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async createUser(userDto: UserDto): Promise<IUserResponse> {

    const check = await this.userModel.findOne({email: userDto.email});

    if(check) {
      throw new HttpException('email already exists', HttpStatus.UNPROCESSABLE_ENTITY );
    }

    const newUser = new User();
    Object.assign(newUser, userDto);

    newUser.password = await bcrypt.hash(userDto.password, 10);

    return await this.userModel.create(newUser).then(user => {
      user = JSON.parse(JSON.stringify(user));
      delete user.password;
      return user;
    })
      .catch(err => {
        throw new Error(err.message);
      });
  }

  async getUser(email: string): Promise<IUser> {
    return this.userModel.findOne({email: email});
  }
}