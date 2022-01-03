import { User } from '@botaiml-videoflo/entities';
import { UsersService } from '@botaiml-videoflo/users-service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: User) {
    const payload = { email: user.email, role: user.userRole };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
}
