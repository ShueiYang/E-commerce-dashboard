import { NextResponse } from "next/server";
import { BillboardParams, StoreParams } from "@root/common.types";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { updateBillboardSchema } from "@/validator/schemaValidation";


export async function GET(
  req: Request,
  { params }: BillboardParams
) {
  try {
    if(!params.billboardId) {
      return new Response("Billboard ID is required", { status: 400}) 
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })
    return NextResponse.json(billboard, { status: 200})
    
  } catch (err) {
    console.error("[BILLBOARD_GET]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function PATCH(
  req: Request, 
  { params }: StoreParams & BillboardParams
) {
  try {
    const { userId } = auth();
    // Zod safe validation on the backend
    const reqBodyValidation = updateBillboardSchema.safeParse(await req.json())

    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!reqBodyValidation.success || !params.billboardId) {
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId
      },
      data: {
        label,
        imageUrl,
        publicId,
      }
    })
    
    return NextResponse.json(billboard, { status: 200})
    
  } catch (err) {
    console.error("[BILLBOARD_PATCH]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function DELETE(
  req: Request,
  { params }: StoreParams & BillboardParams
) {
  try {
    const { userId } = auth();
  
    if(!userId) {
      return new Response("Unauthorize", { status: 401})  
    }
    if(!params.billboardId) {
      return new Response("Billboard ID is required", { status: 400}) 
    }

    const userStoreFound = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    })
    if(userStoreFound === null) {
      return new Response("Unauthorize", { status: 403}) 
    }

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    })
    return NextResponse.json(billboard, { status: 200})
    
  } catch (err) {
    console.error("[BILLBOARD_DELETE]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}