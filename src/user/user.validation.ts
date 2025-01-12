import { IsNotEmpty, Length, Matches } from 'class-validator';

export class userDTO {
  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[^!@#$%^&*()]*$/, {
    message: 'Name cannot contain special characters',
  })
  name: string;

  /**
   * Replaced the type 'string' with 'any' for the ID field
   * so that it can accept any type of value (numeric, string, etc.).
   * The validations below (Length, Matches) will still run,
   * but if the incoming value is not actually a string, 
   * they may throw a runtime validation error.
   */
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[a-z]{2}\d{7}$/, {
    message: 'Kerbros id should be of the form aa000000',
  })
  kerbrosId: any;

  @IsNotEmpty()
  @Length(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password should at least contain one uppercase, one lowercase, one digit, and one special symbol',
  })
  password: string;

  @IsNotEmpty()
  role: string;

  photo: string;
}
