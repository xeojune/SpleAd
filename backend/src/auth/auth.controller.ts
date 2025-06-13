import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SocialAccount } from '../users/schema/user.schema';

interface SignupDto {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  postCode: string;
  address: string;
  detailAddress?: string;
  accountNumber: string;
}

interface UpdateLinkedAccountsDto {
  userId: string;
  linkedAccounts: SocialAccount[];
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signup(signupDto);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authService.login(email, password);
    
    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  // @UseGuards(JwtAuthGuard)
  me() {
    return { message: 'Current user info' };
  }

  @Patch('user/linked-accounts')
  // @UseGuards(JwtAuthGuard)
  async updateLinkedAccounts(@Body() updateDto: UpdateLinkedAccountsDto) {
    return this.authService.updateLinkedAccounts(updateDto);
  }
}