import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TiktokController } from './tiktok.controller';
import { TikTokService } from './tiktok.service';
import { TikTok, TikTokSchema } from './schemas/tiktok.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: TikTok.name, schema: TikTokSchema }
    ])
  ],
  controllers: [TiktokController],
  providers: [TikTokService],
  exports: [TikTokService]
})
export class TikTokModule {}