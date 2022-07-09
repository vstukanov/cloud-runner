import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/login-with-password')
  loginWithPassword() {
    return 'Hello, World!';
  }
}
