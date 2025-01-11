import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OcmatchService } from './ocmatch.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Controller('ocmatch')
export class OcmatchController {

    constructor(private matchService:OcmatchService){}

    //Create a OC match
    @Post('/')
    async createMatch(@Body() data:any){
        try{
            const startDate = new Date(data.dateStart);
            const endDate = new Date(data.dateEnd);

            if(startDate > endDate){
                throw new BadRequestException("End Date cannot be in Past");
            }
            
            data.dateStart = startDate;
            data.dateEnd = endDate;

            const match = await this.matchService.createOCMatch(data);
            return {
                success:true,
                match:match
            }
        } catch (error) {
            console.log(error);
            if(error instanceof PrismaClientKnownRequestError){
                throw new BadRequestException("Check you Ids")
            }

            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Data format");
            }
        }
    }

    @Delete('/:id')
    //Delete a OC Match
    async deleteMatch(@Param('id') id:number){
        const matchId = Number(id);

        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        try {
            await this.matchService.deleteMatch(matchId);
            return{
                success:true,
                message:"Deleted Successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                throw new BadRequestException("No Match with this Id found");
            }
        }
    }

    //Update a OC match
    @Put('/:id')
    async updateMatch(@Body() data:any,@Param('id') id:number){
        const matchId = Number(id);

        if(!matchId){
            throw new BadRequestException("Invalid match id");
        }

        const startDate = new Date(data.dateStart);
        const endDate = new Date(data.dateEnd);

        if(startDate > endDate){
            throw new BadRequestException("End Date cannot be in Past");
        }

        if(data.dateStart){
            data.dateStart = startDate;
        }

        if(data.dateEnd){
            data.dateEnd = endDate;
        }

        console.log(data);

        try {
            const result = await this.matchService.updateMatch(matchId,data)
            return {
                success:true,
                updatedMatch:result
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2025'){
                    throw new BadRequestException("No Team with following id found");
                }
 
            }

            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid data format");
            }
            throw error;            
        }
    }

    //Get Details of OC Match
    @Get('/:id')
    async matchDetails(@Param('id') id:number){
        const matchId = Number(id);

        if(!matchId){
            throw new BadRequestException("Invalid match id");
        }

        try {
            const result = await this.matchService.matchDetails(matchId);

            if(!result){
                throw new BadRequestException("No Match with this Id found");
            }

            return {
                success:true,
                match:result
            }
        } catch (error) {
            throw error
        }
    }

    //Add a Team to OC Match
    @Post('/team/:id')
    async addTeams(@Param('id') id:number,@Body() data:any){
        const matchId = Number(id);
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        const teamIds:number[] = data.teamIds;
        if(!teamIds){
            throw new BadRequestException("Invalid Data format");
        }
        console.log(teamIds);
        try {
            await this.matchService.addTeam(matchId,teamIds);
            return {
                success:true,
                message:"Teams added successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2025'){
                    throw new BadRequestException("No Team with following id found");
                }
 
            }

            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid data format");
            }
            throw error;  
        }
    }

    //Add Winners of OC Match
    @Post('/winner/:id')
    async winnerTeam(@Param('id') id:number,@Body() data:any){
        const matchId = Number(id);
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        const teamIds:number[] = data.teamIds;
        if(!teamIds){
            throw new BadRequestException("Invalid Data format");
        }

        try {
            await this.matchService.addWinner(matchId,teamIds);
            return {
                success:true,
                message:"Winners added successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2025'){
                    throw new BadRequestException("No Team with following id found");
                }

            }

            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid data format");
            }
            throw error;  
        }
    }

    //Delete a Winner of OC Match
    @Delete('/winner/:id')
    async deleteWinner(@Param('id') id:number,@Body() data:any){
        const matchId = Number(id);
        if(!matchId){
            throw new BadRequestException("Invalid Match Id");
        }

        const winnerId = Number(data.winnerId);
        if(!winnerId){
            throw new BadRequestException("Invalid Data format");
        }

        try {
            await this.matchService.removeWinner(matchId,winnerId);
            return {
                success:true,
                message:"Winners remover successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2025'){
                    throw new BadRequestException("No Team with following id found");
                }

            }

            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid data format");
            }
            throw error;  
        }
    }

    //Get the Winners of OC Match(sorted based on Rank)

    @Get('/winner/:id')
    async winners(@Param('id') id:number){
        const matchId = Number(id);

        if(!matchId){
            throw new BadRequestException("Invalid match id");
        }

        try {
            const result = await this.matchService.winnerMatch(matchId);

            if(!result){
                throw new BadRequestException("No Match with this Id found");
            }

            return {
                success:true,
                teams:result
            }
        } catch (error) {
            throw error
        }
    }



    @Get('/teams/:id')
    async allteams(@Param('id') id:number){
        const matchId = Number(id);

        if(!matchId){
            throw new BadRequestException("Invalid match id");
        }

        try {
            const result = await this.matchService.allTeams(matchId);

            if(!result){
                throw new BadRequestException("No Match with this Id found");
            }

            return {
                success:true,
                teams:result
            }
        } catch (error) {
            throw error
        }
    }
}
