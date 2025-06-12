import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type XAccessTokenDocument = XAccessToken & Document;

@Schema({ timestamps: true })
export class XAccessToken {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop()
  profilePictureUrl?: string;

  @Prop()
  followersCount?: number;

  @Prop()
  followsCount?: number;

  @Prop()
  postCount?: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const XAccessTokenSchema = SchemaFactory.createForClass(XAccessToken);