import { prisma } from "@/lib/prisma";
import { StoreParams } from "@root/common.type";


export default async function DashboardPage({
  params 
}: StoreParams
) {
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId
    }
  });

  return (
    <div>Dashboard active Store: {store?.name}</div>
  );
};