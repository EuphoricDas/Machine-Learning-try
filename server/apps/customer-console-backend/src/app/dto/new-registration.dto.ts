import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsBoolean, Equals, IsNotEmpty } from 'class-validator';

export class NewRegistrationDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  mobileNo: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty()
  @IsBoolean()
  acceptTerms?: boolean;
}
