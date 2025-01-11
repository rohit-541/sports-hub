import { IsDateString, IsEmpty, IsNotEmpty, IsNumber, Min, MinDate, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

const BadmintonType:String[] = ["Singles","Doubles"];
const AtheleticsTypes:String[] = ["l400","l100"];

@ValidatorConstraint({ name: "IsTypeValid", async: false })
class IsType implements ValidatorConstraintInterface {
  validate(type: String | null, args: ValidationArguments) {
    const {sport}:any = args.object;
    
    console.log(type,sport);
    //Sports is Badmintion
    if(sport == "Badminton"){
      if(BadmintonType.includes(type)){
        return true;
      }else{
        return false;
      }
    }

    if(sport == "Atheletics"){
      if(AtheleticsTypes.includes(type)){
        return true;
      }else{
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return "Team Type is wrong.Please Check it!";
  }
}

export class MatchDto{
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    team1Id:number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    team2Id:number

    @IsNotEmpty()
    @IsDateString()
    dateStart:Date

    @IsNotEmpty()
    @IsDateString()
    dateEnd:Date

    @IsNotEmpty()
    sport:String

    @Validate(IsType)
    sportType:String;

    @IsNotEmpty()
    location:String

    @IsNotEmpty()
    CategeoryID:number

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
export class ScoreDto{

    @IsNotEmpty()
    scoreA:number

    @IsNotEmpty()
    scoreB:number
}