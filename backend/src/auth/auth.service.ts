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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async checkEmailAvailability(email: string): Promise<boolean> {
    console.log('Checking email availability for:', email);
    const user = await this.userModel.findOne({ email }).exec();
    console.log('User found:', !!user);
    return !user; // Return true if user doesn't exist (email is available)
  }

  async signup(signupDto: SignupDto) {
    const { 
      email, 
      password, 
      confirmPassword,
      name,
      firstNameKana,
      lastNameKana,
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

    // Create new user with empty strings for required fields
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
      firstNameKana,
      lastNameKana,
      phoneNumber: '',
      postCode: '',
      address: '',
      detailAddress: '',
      accountNumber: '',
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

  async findById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...result } = user.toJSON();
    return result;
  }

  async updateLinkedAccounts(updateDto: UpdateLinkedAccountsDto) {
    const { userId, linkedAccounts } = updateDto;
    
    // Get the current user first
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // For each new linked account, update or add it to the existing accounts
    const updatedAccounts = [...currentUser.linkedAccounts];
    for (const newAccount of linkedAccounts) {
      const existingIndex = updatedAccounts.findIndex(
        account => account.platform === newAccount.platform
      );
      
      if (existingIndex >= 0) {
        // Update existing account
        updatedAccounts[existingIndex] = newAccount;
      } else {
        // Add new account
        updatedAccounts.push(newAccount);
      }
    }
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { linkedAccounts: updatedAccounts },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user linked accounts');
    }

    return {
      success: true,
      linkedAccounts: updatedUser.linkedAccounts
    };
  }

  async deleteAccount(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Account deleted successfully'
    };
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...result } = user.toJSON();
    return result;
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword
    });

    return { success: true, message: 'Password updated successfully' };
  }
}