import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategeoryService {

    constructor(private prisma:PrismaService){}

    //Create a Categeory
    async createCategeory(data:any){
        const newCat = await this.prisma.categeory.create({
            data:data
        });

        return newCat;
    }

    //Delete a Categeory
    async deleteCategeory(catId:number){
        const result = await this.prisma.categeory.delete({
            where:{
                id:catId
            }
        });

        return result;
    }

    //Update a Categeory
    async updateCategeory(catId:number,data:any){
        const result = await this.prisma.categeory.update({
            where:{
                id:catId
            },
            data:data
        });

        return result
    }

    //Get a Categeory Details
    async categeoryDetail(catId:number){
        const result = await this.prisma.categeory.findUnique({
            where:{
                id:catId
            },
            select:{
                name:true,
                sport:true,
                matches:true,
                winners:true
            }
        });

        return result;
    }

    //Create/Update a Winner of Categeory
    async createWinner(catId:number,winners:number[]){
        const result = await this.prisma.categeory.update({
            where:{
                id:catId
            },
            data:{
                winners:{
                    set:winners.map((id)=>({id}))
                }
            }
        });

        return result;
    }

    //Get the Winner of Categeory
    async winner(catId:number){
        const result = await this.prisma.categeory.findUnique({
            where:{
                id:catId
            },
            select:{
                name:true,
                sport:true,
                winners:true,
            }
        });

        return result;
    }
}
