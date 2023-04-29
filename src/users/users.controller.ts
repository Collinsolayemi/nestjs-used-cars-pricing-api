import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user-dto';
import { UserUpdateDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialise } from '../interceptors/serialise.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user-decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './users.entity';

@Controller('/auth')
@Serialise(UserDto) //custom interceptor
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  //Signup routes
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;

    return user;
  }
  @HttpCode(HttpStatus.OK)
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // @Get('/whoami')
  // whoAmI(@Req() user: Request) {
  //   return user;
  // }
  @HttpCode(HttpStatus.OK)
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    //console.log(user);
    return user;
  }

  //Signin route handler
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async getUsers(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    //check if user does not exist
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UserUpdateDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @HttpCode(204)
  @Delete('/:id')
  remove(@Param() id: string) {
    return this.usersService.remove(id);
  }
}
