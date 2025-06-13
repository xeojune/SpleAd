import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TikTokDocument = TikTok & Document;

@Schema({ timestamps: true })
export class TikTok {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  tokenType: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ required: true })
  refreshExpiresIn: number;

  @Prop({ required: true })
  scope: string;

  @Prop({ type: Object })
  userInfo: {
    displayName: string;
    avatarUrl: string;
    followerCount: number;
    followingCount: number;
    videoCount: number;
  };

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TikTokSchema = SchemaFactory.createForClass(TikTok);
