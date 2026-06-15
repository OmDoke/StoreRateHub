import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password cannot be longer than 16 characters' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least 1 uppercase letter' })
  @Matches(/(?=.*[!@#$%^&*()_+|~=`{}\[\]:";\'<>?,.\/])/, { message: 'Password must contain at least 1 special character' })
  newPassword: string;
}
