import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities';
import { Repository } from 'typeorm';
import { LoginWithPasswordRequestDto } from './dto/login-with-password.request.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService, PermissionService } from '../../common/services';
import notp from 'notp';
import * as bcrypt from 'bcrypt';
import { TokenPairResponseDto } from './dto/token-pair.response.dto';
import { DeviceService } from './device.service';
import { InviteRequestDto } from './dto/invite.request.dto';
import { UserStatus } from '../../entities/user.entity';
import { nanoid } from 'nanoid';
import { InviteCompleteRequestDto } from './dto/invite-complete.request.dto';

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

  async passwordHash(password: string) {
    const salt = `$2b$10$${this.configService.get('auth.password_salt')}`;
    return bcrypt.hash(password, salt);
  }

  async invite(request: InviteRequestDto) {
    const user = this.userRepository.create({
      fullName: request.name,
      email: request.email,
      status: UserStatus.PENDING,
      invitationCode: nanoid(21),
    });

    await this.userRepository.insert(user);
  }

  async completeInvite(request: InviteCompleteRequestDto, ip: string) {
    const hash = await this.passwordHash(request.password);

    const updated = await this.userRepository.update(
      {
        invitationCode: request.invitationCode,
        status: UserStatus.PENDING,
      },
      {
        status: UserStatus.ACTIVE,
        password: hash,
        joinedAt: () => 'now()',
        lastLoginAt: () => 'now()',
      },
    );

    if (!updated.affected) {
      throw new BadRequestException({
        message: 'Invalid invitation code',
        reason: 'user.invitation_code_invalid',
      });
    }

    const user = await this.userRepository.findOneByOrFail({
      invitationCode: request.invitationCode,
    });

    const device = await this.deviceService.createActive(user, {
      ip,
      name: request.deviceName,
      type: request.deviceType,
    });

    return this.jwtService.createTokenPair(user, device);
  }

  async loginWithPassword(
    request: LoginWithPasswordRequestDto,
    ip: string,
  ): Promise<TokenPairResponseDto> {
    const hash = await this.passwordHash(request.password);

    const user = await this.userRepository.findOne({
      where: {
        email: request.email,
        password: hash,
      },
      relations: ['roles', 'roles.permissions'],
      relationLoadStrategy: 'query',
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'The email or password you entered did not match',
        reason: 'user.invalid_credentials',
      });
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
