import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategeoryService } from './categeory.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Controller('categeory')
export class CategeoryController {

    constructor(private catService:CategeoryService){}

    //Create a Categeory
    @Post('/')
    async createCategeory(@Body() data:any){
        try {
            const newCat = await this.catService.createCategeory(data);
            return {
                success:true,
                Categeory:newCat
            }
        } catch (error) {
             if(error instanceof PrismaClientKnownRequestError){
                throw new BadRequestException("Can not add duplicate Categeory");
             }
             if(error instanceof PrismaClientValidationError){
                console.log(error);
                throw new BadRequestException("Invalid Categeory data");
             }
        }
    }

    //delete a Categeory
    @Delete('/:id')
    async deleteCategeory(@Param('id') id:number){
        const catId = Number(id);
        if(!catId){
            throw new BadRequestException("Invalid Categeory Id");
        }

        try {
            const result = await this.catService.deleteCategeory(catId);
            return {
                success:true,
                message:"Deleted Successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("No Categeory with this Id found");
                }
            }
        }
    }

    //update a Categeory
    @Put('/:id')
    async updateCategeory(@Body() data:any,@Param('id') id:number){
        const catId = Number(id);

        if(!catId){
            throw new BadRequestException("Invalid Categeory Id");
        }

        try {
           const result = await this.catService.updateCategeory(catId,data);
           return {
            success:true,
            updatedCategeory:result
           } 
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("Categeory with this id not found");
                }
            }
            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Structure of Data");
            }
            throw error;
        }
    }

    //CategeoryDetails
    @Get('/:id')
    async categeoryDetails(@Param('id') id:number){
        const catId = Number(id);
        if(!catId){
            throw new BadRequestException("Invalid Categeory Id");
        }

        try {
            const result = await this.catService.categeoryDetail(catId);
            return {
                success:true,
                Categeory:result
            }
        } catch (error) {
            throw error;
        }
    }

    @Post('/addTeam/:id')
    async addTeam(@Param('id') id:number,@Body() data:any){
        const CatId:number = Number(id);
        const teamId:number = Number(data.id);

        if(!CatId || !teamId){
            throw new BadRequestException("Invalid Ids")
        }

        try {
            await this.catService.addTeam(CatId,teamId);
            return {
                success:true,
                message:"Team added successfully to Categeory"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("Categeory with this id not found");
                }
            }
            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Structure of Data");
            }
            throw error;
        }
    }   

    //Create Winner
    @Post('/winner/:id')
    async createWinner(@Body() data:any,@Param('id') id:number){
        const winners = data.winner;  
        if(!winners){
            throw new BadRequestException("Please provide valid data");
        }  
        const catId = Number(id);

        if(!catId){
            throw new BadRequestException("Invalid Categeory Id");
        }

        try {
            const result = await this.catService.createWinner(catId,winners);
            return {
                success:true,
                winners:result
            }
        } catch (error) {
            console.log(error);
        }
    }
    //winner
    @Get('/winner/:id')
    async winner(@Param('id') id:number){
        const catId = Number(id);
        if(!catId){
            throw new BadRequestException("Invalid Categeory Id");
        }

        try {
            const result = await this.catService.winner(catId);
            return {
                success:true,
                response:result
            }
        } catch (error) {
            throw error;
        }
    }

    @Get('/allMatches/:id')
    async allMatches(@Param('id') id:number){ 
        const catId:number = Number(id);

        if(!catId){
            throw new BadRequestException("Invalid Id");
        }
    }   

    @Get('/allMatch/BySport')
    async allMatchBySport(@Body() data:any){
        const sport = data.sport;
        console.log(sport);
        try {
            const result = await this.catService.CategeoryBySport(sport);
            return {
                success:true,
                Categeory:result
            }
        } catch (error) {
            throw error;
        }
    }

    @Get('/Cat/all')
    async allCategeories(){
        try {
            const result = await this.catService.allCat();
            return{
                success:true,
                response:result
            }
        } catch (error) {
            throw error;
        }
    }
}
