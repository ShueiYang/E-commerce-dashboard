import { NextResponse } from "next/server";
import { StoreParams, ThemeParams } from "@root/common.types";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { themeFormSchema } from "@/validator/schemaValidation";


export async function GET(req: Request, {
  params 
}: {
  params: { themeId: string }
}) {
  try {
    if(!params.themeId) {
      return new Response("Theme ID is required", { status: 400}) 
    }

    const theme = await prisma.theme.findUnique({
      where: {
        id: params.themeId,
      },
    })
    return NextResponse.json(theme, { status: 200})
    
  } catch (err) {
    console.error("[THEME_GET]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function PATCH(
  req: Request, 
  { params }: StoreParams & ThemeParams
) {
  try {
    const { userId } = auth();
    // Zod safe validation on the backend
    const reqBodyValidation = themeFormSchema.safeParse(await req.json())

    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!reqBodyValidation.success || !params.themeId) {
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

    const theme = await prisma.theme.updateMany({
      where: {
        id: params.themeId
      },
      data: {
        name,
        value,
      }
    })
    
    return NextResponse.json(theme, { status: 200})
    
  } catch (err) {
    console.error("[THEME_PATCH]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}


export async function DELETE(
  req: Request,
  { params }: StoreParams & ThemeParams
) {
  try {
    const { userId } = auth();
  
    if(!userId) {
      return new Response("Unauthorize", { status: 401})  
    }
    if(!params.themeId) {
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

    const theme = await prisma.theme.deleteMany({
      where: {
        id: params.themeId,
      },
    })
    return NextResponse.json(theme, { status: 200})
    
  } catch (err) {
    console.error("[THEME_DELETE]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}