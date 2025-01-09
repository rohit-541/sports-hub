import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Auth/auth.gaurd';

@UseGuards(AuthGuard)
@Controller('match')
export class MatchController {
    //Create a Match

    //Delete a match

    //update details of match
    //Date + teams  

    //update score of match

    //mark winner

    //get winner

    //get match details

    //get next 2 matches

    //get live matches

    //get past matches

}
