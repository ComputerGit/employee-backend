import { Controller, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '../application/services/user.service';
import { ActivateUserDto } from '../application/dto/activate-user.dto';
import { Public } from 'src/common/decorators/roles.decorator';

// The UserController handles user-related HTTP endpoints
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /user/activate
  // This is the endpoint employees hit when they're activating their account for the first time
  // It must be public because they don't have a session yet
  @Public()
  @Post('activate')
  async activate(@Body() dto: ActivateUserDto, @Req() req: Request) {
    console.log('🔍 Session before setting user:', req.session);
    console.log('🔍 Checking the dto:', dto.employeeId);

    const user = await this.userService.activateUser({
      employeeId: dto.employeeId,
      password: dto.password,
    });

    req.session.user = {
      userId: user.id.getValue(),
      employeeId: user.employeeId,
      role: 'EMPLOYEE',
    };

    console.log('🔍 Session after setting user:', req.session);
    console.log('🔍 Session ID:', req.sessionID);

    // Manually save the session to Redis
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
      message: 'Account activated successfully. You are now logged in.',
      userId: user.id.getValue(),
      employeeId: user.employeeId,
    };
  }
}
