import { Project } from '@botaiml-videoflo/entities';
import { UsersService } from '@botaiml-videoflo/users-service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async authenticateApiUser(appId: string, secret: string): Promise<{ accessToken: string }> {
    const project = await this.projectRepo.findOne({
      where: { appId, secretKey: secret }
    });

    if (!project) {
      return null;
    }

    const payload = {
      projectId: project.id,
      projectName: project.name,
      accountId: project.accountId
    };

    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
}
