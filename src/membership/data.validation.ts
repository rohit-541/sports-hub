import { IsDataURI, IsDate, IsDateString, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class membershipdto{
    @IsNotEmpty()
    membershipCategory:string;

    @IsNotEmpty()
    user:string;

    @IsDateString()
    start:Date;

    @IsDateString()
    end:Date;
}