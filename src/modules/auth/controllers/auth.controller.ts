import { Controller, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../application/services/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { Public } from 'src/common/decorators/roles.decorator';

// The AuthController handles authentication endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  // This is for users who have already activated their account and want to log in
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );

    req.session.user = {
      userId: user.userId,
      employeeId: user.employeeId,
      role: user.role,
    };

    console.log('🔍 Session after login:', req.session);
    console.log('🔍 Session ID:', req.sessionID);

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
          reject(err);
        } else {
          console.log('✅ Session saved successfully');
          resolve(true);
        }
      });
    });

    return {
      message: 'Login successful',
      user: {
        userId: user.userId,
        employeeId: user.employeeId,
        role: user.role,
      },
    };
  }

  // POST /auth/logout
  // Destroy the session to log the user out
  @Post('logout')
  async logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject({ message: 'Logout failed' });
        } else {
          resolve({ message: 'Logout successful' });
        }
      });
    });
  }
}
