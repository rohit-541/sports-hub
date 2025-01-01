import {IsDateString, IsNotEmpty, Length, Matches } from "class-validator";


export class membershipdto{
    
    //User details
    @IsNotEmpty()
    @Length(3,50)
    @Matches(/^[^!@#$%^&*()]*$/, { message: "Name cannot contain special characters" })
    userName:string;
    
    @IsNotEmpty()
    @Length(9,9)
    @Matches(/^[a-z]{2}\d{7}$/,{message:'Kerbros id should be of the form aa000000'})
    kerbrosId:string;
    
    
    @IsNotEmpty()
    @Length(3,50)
    @Matches(/^[^!@#$%^&*()]*$/, { message: "Name cannot contain special characters" })
    name:string;
    
    @IsDateString()
    start:Date;

    @IsDateString()
    end:Date;
}


/*
    We expect Membership request with following details
    {
        userName: string,
        kerbrosId:string,
        membershipName:string->field as name
        start:DateString
        end:DateString
    }

    userId->set later
    photo->set later

    isActive->false ->any login 
    token->assigned when someone login with this id
*/