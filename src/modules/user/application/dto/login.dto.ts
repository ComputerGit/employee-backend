import { IsString, IsNotEmpty } from 'class-validator';

// DTO for the login endpoint
// This is what users provide when they're logging into an already-activated account
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string; // Could be employeeId or a separate username depending on your business rules

  @IsString()
  @IsNotEmpty()
  password: string; // The password they set during activation
}
