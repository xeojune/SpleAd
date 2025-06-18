import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface SocialAccount {
  platform: string;
  username: string;
  profilePictureUrl: string;
  isConnected: boolean;
  followersCount: number;
  followsCount: number;
  mediaCount?: number;
  tweetCount?: number;
  videoCount?: number;
  lastUpdated: Date;
}

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  postCode: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  detailAddress?: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ type: Boolean, default: false })
  hasCompletedSnsSetup: boolean;

  @Prop({ type: [{ 
    platform: String,
    username: String,
    profilePictureUrl: String,
    isConnected: Boolean,
    followersCount: Number,
    followsCount: Number,
    mediaCount: Number,
    tweetCount: Number,
    videoCount: Number,
    lastUpdated: Date
  }], default: [] })
  linkedAccounts: SocialAccount[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
