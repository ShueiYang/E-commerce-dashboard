import { z } from "zod";

export const storeFormSchema = z.object({
  name: z.string().min(1)
})

export const billboardFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string(),
  publicId: z.string(),
})

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string(),
})

export const updateBillboardSchema = z.object({
  label: z.string().optional(),
  imageUrl: z.string().optional(),
  publicId: z.string().optional()
}).refine((data) => {
  return (data.imageUrl && data.publicId) || (!data.imageUrl && !data.publicId)
},
  { message: "Both imageUrl and publicId are required together"}
)

export const themeFormSchema = z.object({
  name: z.string(),
  value: z.string(),
})