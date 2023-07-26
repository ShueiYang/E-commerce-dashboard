import { prisma } from "@/lib/prisma";
import { StoreParams } from "./layout";



const DashboardPage: React.FC<StoreParams> = async ({params}) => {

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId
    }
  })

  return (
    <div>Dashboard active Store: {store?.name}</div>
  )
}

export default DashboardPage;