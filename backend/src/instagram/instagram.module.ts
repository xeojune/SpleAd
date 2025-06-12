import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { InstagramAccessToken, InstagramAccessTokenSchema } from './schema/instagram.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: InstagramAccessToken.name, schema: InstagramAccessTokenSchema },
    ]),
  ],
  controllers: [InstagramController],
  providers: [InstagramService],
  exports: [InstagramService],
})
export class InstagramModule {}