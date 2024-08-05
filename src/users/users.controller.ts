import { Controller, Get, Post, Body, Patch, Param, Query, Delete, UseInterceptors, ClassSerializerInterceptor, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) { }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Session() session: any) {

    const user = await this.authService.signup(createUserDto.email, createUserDto.password)

    session.userId = user.id

    return user

  }

  @Post('signin')
  async signin(@Body() loginDto: LoginDto, @Session() session: any) {

    const user = await this.authService.signin(loginDto.email, loginDto.password)

    session.userId = user.id

    return user

  }

  // @Get('current-user')
  // getCurrentUser(@Session() session: any) {

  //   return this.usersService.findUser(session.userId)

  // }

  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: UserEntity) {

    return user

  }

  @Post('logout')
  logout(@Session() session: any) {

    session.userId = null

  }

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {

    return this.usersService.create(createUserDto.email, createUserDto.password)

  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get(':id')
  findUser(@Param('id') id: number) {

    // console.log('run 2');

    return this.usersService.findUser(id)

  }

  @Get()
  findAllUsers(@Query('email') email: string) {

    return this.usersService.findUserByEmail(email)

  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {

    return this.usersService.updateUser(id, updateUserDto)

  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {

    return this.usersService.removeUser(id)

  }

}
