import {IsEmpty, IsNotEmpty, IsNumber, Min} from "class-validator";

export class teamDto{
    @IsNotEmpty()
    hostel:string

    @IsNotEmpty()
    sport:string

    @IsEmpty()
    score:number

    players:number[]
}

export class scoreDto{
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    score:number
}

//Do not allow other changes
export class updateDto{
    hostel:string
    sport:string

    @IsEmpty()
    score:number

    @IsEmpty()
    players:number[]
}
