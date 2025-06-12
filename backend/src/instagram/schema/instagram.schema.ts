import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstagramAccessTokenDocument = InstagramAccessToken & Document;

@Schema({ timestamps: true })
export class InstagramAccessToken {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop()
  profilePictureUrl?: string;

  @Prop()
  followersCount?: number;

  @Prop()
  followsCount?: number;

  @Prop()
  mediaCount?: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const InstagramAccessTokenSchema = SchemaFactory.createForClass(InstagramAccessToken);
