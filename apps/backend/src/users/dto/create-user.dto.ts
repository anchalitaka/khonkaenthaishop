import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  // ข้อมูลส่วนตัว (Personal Information)
  @IsString()
  @IsOptional()
  employeeType?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  titleTh?: string;

  @IsString()
  @IsOptional()
  firstNameTh?: string;

  @IsString()
  @IsOptional()
  lastNameTh?: string;

  @IsString()
  @IsOptional()
  firstNameEn?: string;

  @IsString()
  @IsOptional()
  lastNameEn?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsString()
  @IsOptional()
  ethnicity?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  // ข้อมูลการทำงาน (Employment Information)
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  positionLevel?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  employmentStatus?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  // Legacy field
  @IsString()
  @IsOptional()
  name?: string;
}
