import { StoreParams } from "@root/common.type";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { storeFormSchema } from "@/validator/schemaValidation";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, {params}: StoreParams) {
  try {
    const { userId } = auth();
    const formValidation = storeFormSchema.safeParse(await req.json()) 

    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!formValidation.success || !params.storeId) {
      return new Response("Missing Parameter", { status: 400}) 
    }
    const { name } = formValidation.data;

    const store = await prisma.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      }
    })
    return NextResponse.json(store, { status: 200})
    
  } catch (err) {
    console.error("[STORES_PATCH]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function DELETE(req: Request, {params}: StoreParams) {
  try {
    const { userId } = auth();
  
    if(!userId) {
      return new Response("Unauthorize", { status: 401})  
    }
    if(!params.storeId) {
      return new Response("Missing Parameter", { status: 400}) 
    }

    const store = await prisma.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    })
    return NextResponse.json(store, { status: 200})
    
  } catch (err) {
    console.error("[STORES_DELETE]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}