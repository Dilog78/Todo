import {Body, Controller, Post} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserDto} from "./dto/user.dto";
import {IUserResponse} from "./types/user.interface";
import {AuthService} from "../auth/auth.service";
import {ILogin} from "../auth/types/auth.interfase";


@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {
    }

    @Post('registration')
    async createUser(@Body() user: UserDto): Promise<IUserResponse> {
        return await this.userService.createUser(user);
    }

    @Post('login')
    async login(@Body() user: UserDto): Promise<ILogin> {
        return await this.authService.login(user);
    }
}
