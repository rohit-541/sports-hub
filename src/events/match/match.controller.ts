import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Auth/auth.gaurd';
import { MatchDto, ScoreDto, updateDto, winnerDto } from './Data-Validation';
import { MatchService } from './match.service';
import { format } from 'path';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { truncate } from 'fs';


@UseGuards(AuthGuard)
@Controller('match')
export class MatchController {

    constructor(private matchService:MatchService){}

    //Create a Match
    @Post('/')
    async createMatch(@Body() data:MatchDto){
        try {
            const startDate = new Date(data.dateStart);
            const endDate = new Date(data.dateEnd);

            if(startDate > endDate){
                throw new BadRequestException("End Date cannot be in Past");
            }
            
            data.dateStart = startDate;
            data.dateEnd = endDate;
            const newMatch = await this.matchService.createMatch(data);
            return newMatch;
        } catch (error) {
            console.log(error);
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2003"){
                    throw new BadRequestException("Please Check Ids");
                }
            }

            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Structure of Data");
            }

            throw error;
        }

    }
    //Delete a match
    @Delete('/:id')
    async deleteMatch(@Param() params:any){
        const matchId:number = Number(params.id);

        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        try {
            await this.matchService.deleteMatch(matchId);
            return {
                success:true,
                "message":"Match deleted Successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("No Match with this Match Id found");
                }
            }
        }
    }

    //update details of match
    @Put('/:id')
    async updateMatchDetails(@Body() data:updateDto,@Param() params:any){
        const matchId:number = Number(params.id);
        
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        if(data.dateStart){
            data.dateStart = new Date(data.dateStart);
        }
        if(data.dateEnd){
            data.dateEnd = new Date(data.dateEnd);
        }

        if(data.dateStart && data.dateEnd && data.dateStart > data.dateEnd){
            throw new BadRequestException("End Date cannot be in Past");
        }


        try {
            const updatedMatch = await this.matchService.updateMatch(matchId,data);
            return {
                success:true,
                updatedMatch:updatedMatch
            }
        } catch (error) {
            console.log(error);
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("Match with this id not found");
                }
            }
            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Structure of Data");
            }
            return error;
        }
        

    }

    //mark winner
    @Put('/winner/:id')
    async createWinner(@Body() data:winnerDto,@Param() params:any){
        const matchId = Number(params.id);
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        const winnerId = Number(data.winner);
        if(!winnerId){
            throw new BadRequestException("Invalid Winner Id");
        }

        try {
            const result = await this.matchService.createWinner(matchId,winnerId);
            return {
                success:true,
                winner:result  
            }
        } catch (error) {
            throw error
        }

    }

    //get winner
    @Get('/winner/:id')
    async winnerMatch(@Param() params:any){
        const matchId:number = Number(params.id);
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        const result = await this.matchService.winnerMatch(matchId);
        if(!result){
            throw new BadRequestException("No Completed Match with this Id found!");
        }

        return{
            success:true,
            winner:result.winner
        }
    }

    //get match details
    @Get('/:id')
    async matchDetails(@Param() params:any){
        const matchId:number = Number(params.id);

        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        try {
            const result = await this.matchService.matchDetails(matchId);

            if(!result){
                throw new BadRequestException("No Match with this Id found!");
            }

            return {
                success:true,
                Match:result
            }
        } catch (error) {
            throw error;
        }
        
    }
    //get next 2 matches
    @Get('/matches/upcomming')
    async upcommingMatch(@Body() data:any){
        const n:number = Number(data.n) || 2;
        console.log(n);
        const result = await this.matchService.upcommingMatches(n);
        return {
            success:true,
            matches:result
        }
    }
    //get live matches
    @Get('/matches/live')
    async liveMatch(@Body() data:any){
        const n:number = Number(data.n) || 2;
        const result = await this.matchService.liveMatches();
        return {
            success:true,
            matches:result
        }
    }
    //get past matches
    @Get('/matches/past')
    async pastMatch(@Body() data:any){
        const n:number = Number(data.n) || 2;
        const result = await this.matchService.pastMatch(n);
        return {
            success:true,
            matches:result
        }
    }

    @Get('/location/:id')
    async matchLocation(@Param() params:any){
        const matchId:number = Number(params.id);
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        const result:any = await this.matchService.location(matchId);
        if(!result){
            throw new BadRequestException("No Match with following Id is found!");
        }

        return {
            success:true,
            location:result
        };
    }

    @Put('/score/:id')
    async updateScore(@Body() data:ScoreDto,@Param('id') id:number){
        const matchId:number = Number(id);

        if(!matchId){
        throw new BadRequestException("Invalid Match Id");
        }

        try {
            const updatedScore = await this.matchService.updateScore(matchId,data);
            return {
                success:true,
                "Message":"Score Updated Successfully"
            }
        } catch (error) {
           if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("No Match with this Id found");
                }
           }
        }


    }


    //Rounds

    //Create a round
    @Post('/round/')
    async createRound(@Body() data:any){
        try {
            const result = await this.matchService.createRound(data);

            return {
                success:true,
                round:result
            }
        } catch (error) {
            throw error;
        }
    }

    @Delete('/round/:id')
    //delete a round
    async deleteRound(@Param('id') id:number){
        const roundId = Number(id);
        
        if(!roundId){
            throw new BadRequestException("Invlaid Round Id");
        }

        try {
            const result = await this.matchService.deleteRound(roundId);

            return {
                success:true,
                message:"Rounded Deleted Successfully"
            }
        } catch (error) {
            throw error;
        }
    }

    //Update a round
    @Put('/round/:id')
    async updateRound(@Body() data:any,@Param('id') id:number){
        const roundId = Number(id);

        if(!roundId){
            throw new BadRequestException("Invalid Round Id");
        }

        try {
            const result = await this.matchService.updateRound(roundId,data);

            return {
                success:true,
                message:"Updated Successfully"
            }
        } catch (error) {
            throw error;
        }
    }

    //Get details of a round
    @Get('/round/:id')
    async roundDetails(@Param('id') id:number){
        const roundId = Number(id);

        if(!roundId){
            throw new BadRequestException("Invalid Round Id");
        }

        try {
            const result = await this.matchService.roundDetails(roundId);
            return{
                success:true,
                Round:result
            }
        } catch (error) {
            throw error;            
        }
    }
    //Set the winner of round
    @Put('/round/winner/:id')
    async setWinner(@Param('id') id:number,@Body() data:any){
        const roundId = Number(id);

        if(!roundId){
            throw new BadRequestException("Invalid Round Id");
        }
        
        const winnerId = Number(data.winnerId);

        if(!roundId){
            throw new BadRequestException("Invalid winner Id");
        }

        try {
            const result = await this.matchService.createRoundWinner(roundId,winnerId);
        } catch (error) {
            throw error;
        }
    }
    //Update the score of the round
    @Put('/round/score/:id')
    async setScore(@Param('id') id:number,@Body() data:any){
        const roundId = Number(id);

        if(!roundId){
            throw new BadRequestException("Invalid Round Id");
        }

        try {
            const result = await this.matchService.updateRoundScore(roundId,data);
            return{
                success:true,
                winner:result
            }
        } catch (error) {
            throw error
        }
    }
    //Get the winner of round
    @Get('/round/winner/:id')
    async roundWinner(@Param('id') id:number){
        const roundId = Number(id);

        if(!roundId){
            throw new BadRequestException("Invalid Round Id");
        }

        try {
            const result = await this.matchService.winnerRound(roundId);
            return{
                success:true,
                winner:result
            }
        } catch (error) {
            throw error
        }
    }
}
