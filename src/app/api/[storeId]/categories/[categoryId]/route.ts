import { NextResponse } from "next/server";
import { CategoryParams } from "@root/common.types";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { categoryFormSchema } from "@/validator/schemaValidation";


export async function GET(req: Request, {
  params 
}: {
  params: { categoryId: string }
}) {
  try {
    if(!params.categoryId) {
      return new Response("Category ID is required", { status: 400}) 
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    })
    return NextResponse.json(category, { status: 200})
    
  } catch (err) {
    console.error("[CATEGORY_GET]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function PATCH(
  req: Request, 
  { params }: CategoryParams
) {
  try {
    const { userId } = auth();
    // Zod safe validation on the backend
    const reqBodyValidation = categoryFormSchema.safeParse(await req.json())

    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!reqBodyValidation.success || !params.categoryId) {
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

    const category = await prisma.category.updateMany({
      where: {
        id: params.categoryId
      },
      data: {
        name,
        billboardId,
      }
    })
    
    return NextResponse.json(category, { status: 200})
    
  } catch (err) {
    console.error("[CATEGORY_PATCH]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function DELETE(
  req: Request,
  { params }: CategoryParams
) {
  try {
    const { userId } = auth();
  
    if(!userId) {
      return new Response("Unauthorize", { status: 401})  
    }
    if(!params.categoryId) {
      return new Response("Category ID is required", { status: 400}) 
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

    const category = await prisma.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    })
    return NextResponse.json(category, { status: 200})
    
  } catch (err) {
    console.error("[CATEGORY_DELETE]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}