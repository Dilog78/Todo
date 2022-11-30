import { Body, Controller, Post, Redirect } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { UserInterface } from "./types/user.interface";
import { AuthService } from "../auth/auth.service";


@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('registration')
  async createUser(@Body() user: UserDto): Promise<UserInterface> {
    return await this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() user: UserDto): Promise<UserInterface> {
    return await this.authService.login(user);
  }
}
