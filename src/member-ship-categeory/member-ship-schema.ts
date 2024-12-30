import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

//create a type for type definition
export type MembershipCat = HydratedDocument<MemberShipCategeory>;


@Schema()
export class MemberShipCategeory{
    //name
    @Prop({required:true,unique:[true,"Categeory Already exits"]})
    name:string
    
    //amount
    @Prop({required:true,min:0,max:10000})
    amount:number

    //time in months
    @Prop({required:true,min:0,max:20})
    time:number
}

export const MemberShipCategeorySchema = SchemaFactory.createForClass(MemberShipCategeory);