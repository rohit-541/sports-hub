import { Injectable } from "@nestjs/common";
import { IsNotEmpty, Length, Matches } from "class-validator";
import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';

//Create a dto of userdata
export class userDTO{
    @IsNotEmpty()
    @Length(3,50)
    @Matches(/^[^!@#$%^&*()]*$/, { message: "Name cannot contain special characters" })
    name:string;

    @IsNotEmpty()
    @Length(9,9)
    @Matches(/^[a-z]{2}\d{7}$/,{message:'Kerbros id should be of the form aa000000'})
    kerbrosId:string;

    @IsNotEmpty()
    @Length(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
        message:"Password should atleast contain one uppercase,one lowercase,one digit and one special symbol"
    })
    password:string;

    @IsNotEmpty()
    role:string;

    photo:string
}


/*
    for user we require to pass information as 
    {
        name: string,
        kerbrosId:string,
        password:string,
        role:'user' or 'admin'
    }
*/