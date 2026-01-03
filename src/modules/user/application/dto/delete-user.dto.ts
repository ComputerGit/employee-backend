import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUerDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
