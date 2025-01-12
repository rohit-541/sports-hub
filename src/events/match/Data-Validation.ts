import {
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// If you want to keep your custom validator logic, 
// but it's effectively disabled if you pass 'any'.
@ValidatorConstraint({ name: 'IsTypeValid', async: false })
class IsType implements ValidatorConstraintInterface {
  validate(type: any, args: ValidationArguments) {
    const { sport }: any = args.object;
    console.log(type, sport);
    // For demonstration only — logic won't do much if 'type' is any
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Team Type is wrong. Please check it!';
  }
}

export class MatchDto {
  // Instead of @IsNumber(), we use @IsNotEmpty() 
  // or remove the decorators if they no longer apply
  @IsNotEmpty()
  team1Id: any;

  @IsNotEmpty()
  team2Id: any;

  // If you still want to ensure it’s a date string, keep @IsDateString()
  // but you asked for "any," so it’s contradictory to require a date string. 
  // We'll keep the validator for demonstration, but you may remove it.
  @IsNotEmpty()
  @IsDateString()
  dateStart: any;

  @IsNotEmpty()
  @IsDateString()
  dateEnd: any;

  @IsNotEmpty()
  sport: any;

  // Potentially validated by "IsType"
  // but now typed as any
  sportType: any;

  @IsNotEmpty()
  location: any;

  @IsNotEmpty()
  CategeoryID: any;

  @IsNotEmpty()
  type: any;
}

export class updateDto {
  // Procedure of adding winner is different
  @IsEmpty()
  winner: any;

  // If these are wrong, create a New match
  @IsEmpty()
  team1Id: any;

  @IsEmpty()
  team2Id: any;

  dateStart: any;
  dateEnd: any;

  location: any;
  longitude: any;
  latitude: any;
}

export class winnerDto {
  @IsNotEmpty()
  winner: any;

  @IsEmpty()
  status: any;

  @IsEmpty()
  team1: any;

  @IsEmpty()
  team2: any;

  @IsEmpty()
  DateStart: any;

  @IsEmpty()
  DateEnd: any;

  @IsEmpty()
  longitude: any;

  @IsEmpty()
  latitude: any;
}

export class ScoreDto {
  @IsNotEmpty()
  scoreA: any;

  @IsNotEmpty()
  scoreB: any;
}
