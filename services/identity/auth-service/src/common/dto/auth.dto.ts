import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  FARMER = 'FARMER',
  BUYER = 'BUYER'
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
