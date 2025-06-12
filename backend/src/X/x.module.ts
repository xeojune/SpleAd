import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { XController } from './x.controller';
import { XService } from './x.service';
import { XAccessToken, XAccessTokenSchema } from './schema/x.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'XAccessToken', schema: XAccessTokenSchema },
    ]),
  ],
  controllers: [XController],
  providers: [XService],
  exports: [XService],
})
export class XModule {}