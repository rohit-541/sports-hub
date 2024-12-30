import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class dto{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(100000)
    amount:number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(20)
    time:number
}