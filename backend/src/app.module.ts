import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InstagramModule } from './instagram/instagram.module';
import { XModule } from './X/x.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/SpleAd';
        logger.log(`Connecting to MongoDB at: ${uri}`);
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log('Successfully connected to MongoDB');
            });
            connection.on('error', (error) => {
              logger.error('MongoDB connection error:', error);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    InstagramModule,
    XModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
