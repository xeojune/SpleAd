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

  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ default: '' })
  firstNameKana: string;

  @Prop({ default: '' })
  lastNameKana: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: '' })
  postCode: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  lineId: string;

  @Prop({ default: '' })
  accountHolderLastKana: string;

  @Prop({ default: '' })
  accountHolderFirstKana: string;

  @Prop({ default: '' })
  bankName: string;

  @Prop({ default: '' })
  branchCode: string;

  @Prop({ default: '' })
  accountNumber: string;

  @Prop({ default: '' })
  accountType: string;

  @Prop({ default: '' })
  accountPostalCode: string;

  @Prop({ default: '' })
  accountAddress: string;

  @Prop({ default: '' })
  accountPhone: string;

  @Prop({ default: '' })
  paypalEmail: string;

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
