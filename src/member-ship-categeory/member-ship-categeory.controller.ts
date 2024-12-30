import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role, Roles, RolesGuard } from 'src/user/roles.gaurd';
import { MemberShipCategeoryService } from './member-ship-categeory.service';
import { AuthGuard } from 'src/Auth/auth.gaurd';
import { dto } from './dto';

//Membership categeory can only be accessed by admin
@Controller('member-ship-categeory')
@UseGuards(AuthGuard,RolesGuard)
@Roles(Role.Admin)
export class MemberShipCategeoryController {
    
    constructor(private MemberShipCatService:MemberShipCategeoryService){}

    //Create a categeory
    @Post('/create')
    async createMemberShipCat(@Body() data:dto){
        try {
            return await this.MemberShipCatService.createMemberShipCat(data);
        } catch (error) {
            throw error;
        }
    }

    @Delete('/:id')
    async deleteCategeory(@Param() id:string){
        try {
            await this.MemberShipCatService.deleteMemberShipCat(id);
            return {
                success:true,
                message:"Categeory Deleted Successfully"
            }
        } catch (error) {
            throw error;
        }
    }
}
