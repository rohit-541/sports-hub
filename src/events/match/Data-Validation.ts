import { IsDateString, IsEmpty, IsNotEmpty, IsNumber, Min, MinDate } from "class-validator";

export class MatchDto{
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    team1:number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    team2:number

    @IsNotEmpty()
    @IsDateString()
    DateStart:Date

    @IsNotEmpty()
    @IsDateString()
    DateEnd:Date

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    latitude:number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    longitude:number

}


export class updateDto{
    @IsEmpty()
    winner:number

    @IsEmpty()
    status:number

    @IsEmpty()
    team1:number

    @IsEmpty()
    team2:number

    DateStart:Date
    DateEnd:Date

    longitude:number
    latitude:number
}

export class winnerDto{
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    winner:number

    @IsEmpty()
    status:number

    @IsEmpty()
    team1:number

    @IsEmpty()
    team2:number

    @IsEmpty()
    DateStart:Date
    
    @IsEmpty()
    DateEnd:Date
    
    @IsEmpty()
    longitude:number
    
    @IsEmpty()
    latitude:number
}