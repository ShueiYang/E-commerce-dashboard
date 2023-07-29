import { NextResponse } from "next/server";
import { StoreParams } from "@root/common.type";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { categoryFormSchema } from "@/validator/schemaValidation";


export async function POST(req: Request, {params}: StoreParams) {
  try {
    const { userId } = auth();
    // Zod safe validation on the backend
    const reqBodyValidation = categoryFormSchema.safeParse(await req.json());
  
    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!reqBodyValidation.success || !params.storeId) {
      return new Response("Invalid form or missing params", { status: 400}) 
    }
    const { name, billboardId } = reqBodyValidation.data;

    const userStoreFound = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    })
    if(userStoreFound === null) {
      return new Response("Unauthorize", { status: 403}) 
    }

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId
      }
    })
    
    return NextResponse.json(category, { status: 201})
    
  } catch (err) {
    console.error("[CATEGORIES_POST]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function GET(req: Request, {params}: StoreParams) {
  try {
    if(!params.storeId) {
      return new Response("StoreID is required", { status: 400}) 
    }

    const categoryResults = await prisma.category.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(categoryResults, { status: 200})
    
  } catch (err) {
    console.error("[CATEGORIES_GET]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}