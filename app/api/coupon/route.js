import prisma from "@/lib/prisma";
import { useAuth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(request) {
    try{
        const {userId,has}=useAuth(request)
        const {code}=await request.json()
        const coupon=await prisma.coupon.findUnique({
            where:{code:code.toUppercase(),
                expiresAt:{gt:new Date()}
            }
        })
        if(!coupon){
            return NextResponse.json({error:"Coupon not found"},{status:404})
        }
        if(coupon.forNewUser){
            const userorders=await prisma.order.findMany({where:{userId}})
            if(userorders.length>0){
                return NextResponse.json({error:"Coupon valid for new users"},{status:400})
            }
        }
        if(coupon.forMember){
            const userorders=await prisma.order.findMany({where:{userId}})
            if(userorders.length>0){
                return NextResponse.json({error:"Coupon valid for Members"},{status:400})
            }
        }
    }catch(error){
        console.error(error);
        return NextResponse.json({error:error.code || error.message},{status:400})


    }
}