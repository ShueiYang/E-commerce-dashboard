import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { storeFormSchema } from "@/validator/schemaValidation";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const { userId } = auth();
    // Zod safe validation
    const formValidation = storeFormSchema.safeParse(await req.json()) 

    if(!userId) {
      return new Response("Unauthenticated", { status: 401})  
    }
    if(!formValidation.success) {
      return new Response("Name is required", { status: 400}) 
    }

    const { name } = formValidation.data;

    const store = await prisma.store.create({
      data: {
        name,
        userId
      }
    })

    return NextResponse.json(store, { status: 201})
    
  } catch (err) {
    console.error("[STORES_POST]", err);
    return new Response("Internal Error", { status: 500}) 
  }
}