import { IsString, IsNotEmpty } from 'class-validator';

// The LoginDto defines what data users must provide when logging in
// This validates that both username and password are present and are strings
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
