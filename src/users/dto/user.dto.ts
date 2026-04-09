import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserDto {
  @Expose()
  id: number;
  
  @Expose()
  name: string;

  @Expose()
  cpfCnpj: string;

  @Expose()
  email: string;

  @Expose()
  type: string;
}