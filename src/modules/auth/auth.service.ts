import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities';
import { Repository } from 'typeorm';
import { LoginWithPasswordRequestDto } from './dto/login-with-password.request.dto';
import { ConfigService } from '@nestjs/config';
import { PermissionService, JwtService } from '../../common/services';
import notp from 'notp';
import * as bcrypt from 'bcrypt';
import { TokenPairResponseDto } from './dto/token-pair.response.dto';
import { DeviceService } from './device.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly permissionService: PermissionService,
    private readonly deviceService: DeviceService,
    private readonly jwtService: JwtService,
  ) {}

  checkTOTP(user: UserEntity, totp: string) {
    if (user.totpSecret) {
      if (!totp) {
        throw new ForbiddenException({ reason: 'totp.missing' });
      }

      if (!notp.totp.verify(totp, user.totpSecret)) {
        throw new ForbiddenException({ reason: 'totp.invalid' });
      }
    }
  }

  async loginWithPassword(
    request: LoginWithPasswordRequestDto,
    ip: string,
  ): Promise<TokenPairResponseDto> {
    const hash = await bcrypt.hash(
      request.password,
      this.configService.get('auth.password.salt'),
    );

    const user = await this.userRepository.findOne({
      where: {
        email: request.email,
        password: hash,
      },
      relations: ['roles', 'roles.permissions'],
      relationLoadStrategy: 'query',
    });

    if (!user) {
      throw new UnauthorizedException({ reason: 'user.not_found' });
    }

    this.permissionService.require(user, ['auth.login.password']);

    this.checkTOTP(user, request.totp);

    const device = await this.deviceService.createActive(user, {
      ip,
      name: request.deviceName,
      type: request.deviceType,
    });

    return this.jwtService.createTokenPair(user, device);
  }

  async refreshToken(token: string, ip: string): Promise<TokenPairResponseDto> {
    const device = await this.deviceService.refresh(token, ip);
    return this.jwtService.createTokenPair(device.user, device);
  }
}
