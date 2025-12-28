import { IsString, IsNotEmpty, MinLength } from 'class-validator';

// DTO for user activation - now simplified to just employee ID and password
// The employee ID will serve as both the identifier and the username
export class ActivateUserDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string; // The employee ID from the employee collection

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string; // The password they want to set for their account
}
