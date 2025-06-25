import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, UseGuards, Patch, Param, Request, Delete, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SocialAccount, User } from '../users/schema/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface SignupDto {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  firstNameKana: string;
  lastNameKana: string;
  phoneNumber?: string;
  postCode?: string;
  address?: string;
  detailAddress?: string;
  accountNumber?: string;
}

interface UpdateLinkedAccountsDto {
  userId: string;
  linkedAccounts: SocialAccount[];
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    if (!email) {
      return { available: false, error: 'Email is required' };
    }
    const available = await this.authService.checkEmailAvailability(email);
    return { available };
  }

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
      secure: true,  // Always use secure for ngrok
      sameSite: 'none',  // Required for cross-site cookies
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear the cookie with the same options used when setting it
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req) {
    return this.authService.findById(req.user.id.toString());
  }

  @Patch('user/linked-accounts')
  @UseGuards(JwtAuthGuard)
  async updateLinkedAccounts(@Body() updateDto: UpdateLinkedAccountsDto) {
    return this.authService.updateLinkedAccounts(updateDto);
  }

  @Delete('user')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user.id.toString());
  }

  @Patch('user')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Request() req, @Body() updateData: Partial<User>) {
    return this.authService.updateUser(req.user.id.toString(), updateData);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Request() req,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.updatePassword(
      req.user.id.toString(),
      currentPassword,
      newPassword
    );
  }
}