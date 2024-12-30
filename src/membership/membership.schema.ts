import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class MemberShip{
    
    //user
    @Prop({type:mongoose.Types.ObjectId,ref:'User',required:true})
    user:mongoose.Types.ObjectId
    
    //membership
    @Prop({type:mongoose.Types.ObjectId,ref:'membershipcategeory',required:true})
    memberShip:mongoose.Types.ObjectId

    //start
    @Prop({type:Date,required:true})
    start:Date
    
    //end
    @Prop({type:Date,required:true})
    end:Date
    
    //status -> active or inactive to avoid entry of two person from id of one user.
    @Prop({type:String,enum:['active','inactive']})
    status:string
}

export const MemberShipSchema = SchemaFactory.createForClass(MemberShip);