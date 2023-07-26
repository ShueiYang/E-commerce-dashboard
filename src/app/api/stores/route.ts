import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

export const storeFormSchema = z.object({
  name: z.string().min(1)
})
export const billboardFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().nonempty("No image uploaded"),
  publicId: z.string().nonempty()
})


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