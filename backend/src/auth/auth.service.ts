import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, SocialAccount } from '../users/schema/user.schema';
import * as bcrypt from 'bcrypt';

interface TokenPayload {
  sub: string;
  email: string;
}

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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { 
      email, 
      password, 
      confirmPassword,
      name,
      phoneNumber,
      postCode,
      address,
      detailAddress,
      accountNumber
    } = signupDto;

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      postCode,
      address,
      detailAddress,
      accountNumber,
      linkedAccounts: []
    });

    const savedUser = await user.save();
    const { password: _, ...result } = savedUser.toJSON();
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = { 
      sub: user._id.toString(), 
      email: user.email 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name,
        linkedAccounts: user.linkedAccounts 
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async updateLinkedAccounts(updateDto: UpdateLinkedAccountsDto) {
    const { userId, linkedAccounts } = updateDto;
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { linkedAccounts },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      linkedAccounts: updatedUser.linkedAccounts
    };
  }
}