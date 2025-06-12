import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramAccessToken, InstagramAccessTokenDocument } from './schema/instagram.schema';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);

  constructor(
    @InjectModel(InstagramAccessToken.name)
    private instagramAccessTokenModel: Model<InstagramAccessTokenDocument>,
  ) {}

  async saveAccessToken(tokenData: {
    userId: string;
    username: string;
    accessToken: string;
    expiresIn: number;
    profilePictureUrl?: string;
    followersCount?: number;
    followsCount?: number;
    mediaCount?: number;
  }): Promise<InstagramAccessTokenDocument> {
    try {
      this.logger.log(`Attempting to save/update token for user: ${tokenData.userId}`);
      
      // Check if token already exists for this user
      const existingToken = await this.instagramAccessTokenModel.findOne({
        userId: tokenData.userId,
      });

      this.logger.log(`Existing token found: ${!!existingToken}`);

      if (existingToken) {
        // Update existing token
        this.logger.log('Updating existing token...');
        const updatedToken = await this.instagramAccessTokenModel.findOneAndUpdate(
          { userId: tokenData.userId },
          {
            $set: {
              ...tokenData,
              updatedAt: new Date(),
            },
          },
          { new: true, runValidators: true }
        );

        if (!updatedToken) {
          this.logger.warn('Update failed, creating new token...');
          const newToken = new this.instagramAccessTokenModel(tokenData);
          return newToken.save();
        }

        this.logger.log('Token updated successfully');
        return updatedToken;
      }

      // Create new token
      this.logger.log('Creating new token...');
      const newToken = new this.instagramAccessTokenModel({
        ...tokenData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedToken = await newToken.save();
      this.logger.log('New token created successfully');
      return savedToken;
    } catch (error) {
      this.logger.error('Error saving access token:', error);
      throw error;
    }
  }

  async getAccessToken(userId: string): Promise<InstagramAccessTokenDocument | null> {
    try {
      console.log('🔍 Service - Attempting to find token for userId:', userId);
      const token = await this.instagramAccessTokenModel.findOne({ userId });
      console.log('🔑 Service - Database query result:', {
        userId,
        tokenFound: !!token,
        tokenPreview: token?.accessToken ? `${token.accessToken.substring(0, 10)}...` : 'none',
        timestamp: new Date().toISOString()
      });
      return token;
    } catch (error) {
      console.error('❌ Service - Error fetching access token:', error);
      throw error;
    }
  }

  async deleteAccessToken(userId: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting token for user: ${userId}`);
      const result = await this.instagramAccessTokenModel.deleteOne({ userId });
      this.logger.log(`Delete result: ${result.deletedCount} documents deleted`);
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error('Error deleting access token:', error);
      throw error;
    }
  }

  async getAllAccessTokens(): Promise<InstagramAccessTokenDocument[]> {
    try {
      this.logger.log('Fetching all access tokens');
      const tokens = await this.instagramAccessTokenModel.find().exec();
      this.logger.log(`Found ${tokens.length} tokens`);
      return tokens;
    } catch (error) {
      this.logger.error('Error fetching all access tokens:', error);
      throw error;
    }
  }
}