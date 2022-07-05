import { ConfigService } from '@nestjs/config';
import { UserEntity, DeviceEntity } from '../../entities';
import jwt from 'jsonwebtoken';

export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  getSecret() {
    return this.configService.get('auth.jwt_secret');
  }

  createAccessToken(user: UserEntity) {
    const expiresIn = this.configService.get(
      'auth.access_expires_in_minutes',
      15,
    );

    return jwt.sign({ sub: user.id }, this.getSecret(), {
      expiresIn: expiresIn * 60,
    });
  }

  createRefreshToken(device: DeviceEntity) {
    const expiresIn = this.configService.get(
      'auth.refresh_expires_in_days',
      30,
    );

    return jwt.sign({ sub: device.deviceId }, this.getSecret(), {
      expiresIn: expiresIn * 24 * 60 * 60,
    });
  }

  createTokenPair(user: UserEntity, device: DeviceEntity) {
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(device),
    };
  }
}
