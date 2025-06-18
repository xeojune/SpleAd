import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Types } from 'mongoose';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log('Cookies:', request?.cookies);  
          const token = request?.cookies?.access_token;
          if (!token) {
            console.log('No token found in cookies');  
            return null;
          }
          console.log('Found token in cookies');  
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Validating payload:', payload);  
    return { 
      id: new Types.ObjectId(payload.sub), 
      email: payload.email 
    };
  }
}
