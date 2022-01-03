import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ApiTokenRequestDTO } from '../dto/api-token-request.dto';

@Controller('token')
@ApiTags('token')
export class TokenController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ operationId: 'getToken' })
  @Post('getToken')
  async getToken(@Body() apiTokenRequest: ApiTokenRequestDTO): Promise<{ accessToken: string } | NotFoundException> {
    const token = await this.authService.authenticateApiUser(apiTokenRequest.appId, apiTokenRequest.secretKey);
    if (!token) {
      return new NotFoundException('Invalid AppId or SecretKey');
    }
    return token;
  }
}
