import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

//create a type for this userSchema
export type userDoc = HydratedDocument<User>

@Schema()
export class User{
    @Prop({required:true})
    name:string

    @Prop({required:true, unique:[true,"User already exists"]})
    kerbrosId:string
    
    @Prop({required:true})
    password:string

    @Prop({required:true,enum:['admin','user','staff']})
    role:string

    @Prop([{type:mongoose.Types.ObjectId,ref:'Membership'}])
    membership:mongoose.Types.ObjectId[]

    @Prop({required:true})
    photo:string
    //TO-DO
    //couse start date
    //course end date
}

export const userSchema = SchemaFactory.createForClass(User);