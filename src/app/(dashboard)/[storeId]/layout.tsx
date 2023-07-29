import { StoreParams } from "@root/common.type";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";


export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode,
} & StoreParams
) {
  const { userId } = auth();

  if(!userId) {
    redirect("/sign-in")
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    }
  })

  if(!store) {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}