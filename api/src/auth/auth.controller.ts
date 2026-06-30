import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokenGuard } from 'src/common/guards/auth.guard';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly usersService: UsersService
  ) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto, @ActiveUser('role') activeUserRole: string) {
    return this.usersService.create(createUserDto, activeUserRole);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh")
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get("me")
  getMe(@ActiveUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }
}
