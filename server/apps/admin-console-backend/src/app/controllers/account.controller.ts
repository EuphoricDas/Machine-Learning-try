import { Controller } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('account')
export class AccountController {
  constructor(private authService: AuthService) {}

  // @Post('signup')
  // async createAccount(@Req() req: Request) {
  //   const createdData = await this.accountService.createAdmin(req.body, UserRole.administrator);
  //   if (!createdData) {
  //     return {
  //       error: true,
  //       message: 'User already exists'
  //     };
  //   }
  //   return createdData;
  // }

  // @Post('login')
  // async login(@Req() req: Request) {
  //   const body = { ...req.body };

  //   const userBody = await this.accountService.login(body);

  //   if (!userBody) {
  //     return {
  //       error: true,
  //       message: 'No such user exists'
  //     };
  //   }
  //   return this.authService.login(userBody);
  // }
}
