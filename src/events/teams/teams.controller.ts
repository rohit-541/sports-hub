import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Auth/auth.gaurd';
import {scoreDto, teamDto, updateDto } from './data-validation';
import { TeamsService } from './teams.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@UseGuards(AuthGuard)
@Controller('teams')
export class TeamsController {
    
    constructor(private teamsService:TeamsService){}

    @Post('/create')
    //Create a team
    async createTeam(@Body() data:teamDto){
        try {
            const newTeam = await this.teamsService.createTeam(data);
            return newTeam;
        } catch (error) {
            console.log(error);
             if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2003"){
                    throw new BadRequestException("Hostel Does not exists");
                }
                throw new BadRequestException("Can not add duplicate Team");
             }
             if(error instanceof PrismaClientValidationError){
                console.log(error);
                throw new BadRequestException("Invalid Team data");
             }
        }
    }

    //delete a team
    @Delete('/:id')
    async deleteTeam(@Param() data:any){
        const teamId = Number(data.id);

        if(!teamId){
            throw new BadRequestException("Invalid Team Id");
        }

        const result = await this.teamsService.deleteTeam(teamId);

        if(result){
            return {
                success:true,
                message:"Team deleted Successfully"
            }
        }
    }

    //update details of team
    @Put('/update/:id')
    async updateTeam(@Param() params:any,@Body() data:updateDto){
        const teamId:number = Number(params.id);
        if(!teamId){
            throw new BadRequestException("Invalid Team Id");
        } 

        try {
            const updatedTeam = await this.teamsService.updateTeamDetails(teamId,data);
            return {
                success:true,
                message:"Updated Successfully",
                updatedTeam:updatedTeam
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2002"){
                    throw new BadRequestException("Can not add duplicate Team");
                }else if(error.code =="P2025"){
                    throw new BadRequestException("Team with this id not found");
                }else if(error.code == "P2003"){
                    throw new BadRequestException("Hostel with this id not found");
                }
            }
            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Team data")
            }
            console.log(error.code);
            throw error;
        }

    }
    //Get details of team
    @Get('/:id')
    async teamDetail(@Param() param:any){
        const teamId:number = Number(param.id);

        //Invalid Team id
        if(!teamId){
            throw new BadRequestException("Invalid Team Id")
        }

        try {
            const team = await this.teamsService.teamDetail(teamId);
            
            if(!team){
                throw new BadRequestException("Team with this id not found");
            }

            return {
                success:true,
                team:team
            }
        } catch (error) {
            throw error;
        }
    }

    @Get('/')
    async allTeams(){
        try {
            const result = await this.teamsService.allTeams();
            return {
                success:true,
                Teams:result
            }
        } catch (error) {
            throw error            
        }
    }

    @Put('/score/:id')
    async updateScore(@Body() data:any,@Param('id') id:number){
        const score = Number(data.score);

        if(!score){
            throw new BadRequestException("Invalid Scores");
        }

        const teamId = Number(id);
        if(!teamId){
            throw new BadRequestException("Invalid Team Id");
        }

        try {
            const result = await this.teamsService.updateScore(teamId,score);

            return {
                success:true,
                "message":"Score Updated Successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("The Team not found");
                }
            }
        }
    }




    //Players
    @Post('/addPlayer/:id')
    async addPlayer(@Body() data:any,@Param() params:any){
        const playerId:number = Number(data.id);
        const teamId:number = Number(params.id);

        if(!playerId){
            throw new BadRequestException("Invalid Player Id");
        }

        if(!teamId){
            throw new BadRequestException("Invalid Team Id");
        }
        
        try {
            const updatedTeam = await this.teamsService.addPlayer(teamId,playerId);
            return updatedTeam;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("Player with this ID not found");
                }
                if(error.code == "P2016"){
                    throw new BadRequestException("Team with this ID not found");
                }
            }
        }
    }

    @Delete('/removePlayer/:id')
    async deletePlayer(@Body() data:any,@Param() params:any){
        const playerId:number = Number(data.id);
        const teamId:number = Number(params.id);

        if(!playerId){
            throw new BadRequestException("Invalid Player Id");
        }

        if(!teamId){
            throw new BadRequestException("Invalid Team Id");
        }
        
        try {
            const updatedTeam = await this.teamsService.removePlayer(teamId,playerId);
            return updatedTeam;
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("Player with this ID not found");
                }
                if(error.code == "P2016"){
                    throw new BadRequestException("Team with this ID not found");
                }
            }
        }
    }

    @Get('/players/:id')
    async allPlayers(@Param() data:any){
        const teamId:number = Number(data.id);  
        if(!teamId){
            throw new BadRequestException("Invalid Team Id");
        }

        const result = await this.teamsService.allPlayers(teamId);
        if(!result){
            throw new BadRequestException("Team with this ID not found");
        }
        return{
            success:true,
            players:result.players
        }
    }

}
