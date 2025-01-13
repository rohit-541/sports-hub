import { Sports } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
export class UpdateIndividualGameDto {
  @IsString()
  @IsNotEmpty()
  name: Sports;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  points: number;

}
