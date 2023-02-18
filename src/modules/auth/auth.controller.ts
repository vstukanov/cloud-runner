import {
  Body,
  Controller,
  Delete,
  Ip,
  Logger,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AjvValidationPipe } from '../../common';
import {
  LoginWithPasswordRequestDto,
  loginWithPasswordRequestSchema,
} from './dto/login-with-password.request.dto';
import { AuthService } from './auth.service';
import {
  InviteRequestDto,
  inviteRequestDtoSchema,
} from './dto/invite.request.dto';
import {
  InviteCompleteRequestDto,
  inviteCompleteRequestDtoSchema,
} from './dto/invite-complete.request.dto';
import { JwtAuthGuard } from '../../common/jwt.auth.guard';
import { DeviceService } from './device.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly deviceService: DeviceService,
  ) {}

  @Post('/invite')
  async invite(
    @Body(new AjvValidationPipe(inviteRequestDtoSchema))
    request: InviteRequestDto,
  ) {
    return await this.authService.invite(request);
  }

  @Post('/invite-complete')
  async inviteComplete(
    @Body(new AjvValidationPipe(inviteCompleteRequestDtoSchema))
    request: InviteCompleteRequestDto,

    @Ip() ip: string,
  ) {
    return await this.authService.completeInvite(request, ip);
  }

  @Post('/login-with-password')
  async loginWithPassword(
    @Body(new AjvValidationPipe(loginWithPasswordRequestSchema))
    requestDto: LoginWithPasswordRequestDto,

    @Ip()
    ip: string,
  ) {
    return await this.authService.loginWithPassword(requestDto, ip);
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  async deleteSession(@Request() req) {
    this.logger.log(JSON.stringify(req.user));
    await this.deviceService.deactivate(req.user.device.deviceId);
  }
}
