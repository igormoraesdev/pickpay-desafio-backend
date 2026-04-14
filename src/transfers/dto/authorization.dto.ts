import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class AuthorizationDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @IsNotEmpty()
  data: {
    authorization: boolean;
  };
}
