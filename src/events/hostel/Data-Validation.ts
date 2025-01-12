import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHostelDto {
  @IsString()
  @IsNotEmpty()
  name: any;
}


export class UpdateHostelDto {
  @IsString()
  @IsOptional()
  name?: any;

  @IsNumber()
  @IsOptional()
  points?: number;
}
