//Custom Validator
import { IsInt, IsOptional, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

const BadmintionTypes:String[] = ["Singles","Doubles"];
const AtheleticsTypes:String[] = ["l400","l100"];


@ValidatorConstraint({ name: "IsTypeValid", async: false })
class IsType implements ValidatorConstraintInterface {
  validate(type: String | null, args: ValidationArguments) {
    const {sport}:any = args.object;
    
    console.log(type,sport);
    //Sports is Badmintion
    if(sport == "Badminton"){
      if(BadmintionTypes.includes(type)){
        return true;
      }
    }

    if(sport == "Atheletics"){
      if(AtheleticsTypes.includes(type)){
        return true;
      }
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return "Team Type is wrong.Please Check it!";
  }
}

import {IsEmpty, IsNotEmpty, IsNumber, Min} from "class-validator";

export class teamDto{
    @IsNotEmpty()
    hostelId:number

    @IsNotEmpty()
    sport:string

    @IsEmpty()
    score:number

    @IsNotEmpty()
    poolId:number

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
    sportsType:string
    @IsEmpty()
    score:number

    @IsEmpty()
    players:number[]
}


