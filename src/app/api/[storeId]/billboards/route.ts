import { NextResponse } from "next/server";
import { StoreParams } from "@/app/(dashboard)/[storeId]/layout";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { billboardFormSchema } from "@/app/api/stores/route";


export async function POST(req: Request, {params}: StoreParams) {
  try {
    const { userId } = auth();
    // Zod safe validation on the backend
    const reqBodyValidation = billboardFormSchema.safeParse(await req.json());
  
    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!reqBodyValidation.success || !params.storeId) {
      return new Response("Invalid form or missing params", { status: 400}) 
    }
    const { label, imageUrl, publicId } = reqBodyValidation.data;

    const userStoreFound = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    })
    if(userStoreFound === null) {
      return new Response("Unauthorize", { status: 403}) 
    }

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        publicId,
        storeId: params.storeId
      }
    })
    
    return NextResponse.json(billboard, { status: 201})
    
  } catch (err) {
    console.error("[BILLBOARD_POST]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function GET(req: Request, {params}: StoreParams) {
  try {
    if(!params.storeId) {
      return new Response("StoreID is required", { status: 400}) 
    }

    const billboardResults = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(billboardResults, { status: 200})
    
  } catch (err) {
    console.error("[BILLBOARDS_GET]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}