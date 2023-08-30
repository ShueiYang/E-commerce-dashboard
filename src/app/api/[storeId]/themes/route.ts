import { NextResponse } from "next/server";
import { StoreParams } from "@root/common.types";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { themeFormSchema } from "@/validator/schemaValidation";


export async function POST(req: Request, {params}: StoreParams) {
  try {
    const { userId } = auth();
    // Zod safe validation on the backend
    const reqBodyValidation = themeFormSchema.safeParse(await req.json());
  
    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!reqBodyValidation.success || !params.storeId) {
      return new Response("Invalid form or missing params", { status: 400}) 
    }
    const { name, value } = reqBodyValidation.data;

    const userStoreFound = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    })
    if(userStoreFound === null) {
      return new Response("Unauthorize", { status: 403}) 
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    })
    
    return NextResponse.json(theme, { status: 201})
    
  } catch (err) {
    console.error("[THEMES_POST]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function GET(req: Request, {params}: StoreParams) {
  try {
    if(!params.storeId) {
      return new Response("StoreID is required", { status: 400}) 
    }

    const themeResults = await prisma.theme.findMany({
      where: {
        storeId: params.storeId
      }
    })

    return NextResponse.json(themeResults, { status: 200})
    
  } catch (err) {
    console.error("[THEMES_GET]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}