import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

import { StoreParams } from "@/app/(dashboard)/[storeId]/layout";
import { BillboardColumn } from "@/components/billboardPage/Columns";
import BillboardClient from "@/components/billboardPage/BillboardClient";


const BillboardsPage = async (
  {params}: StoreParams
) => {
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createAt: "desc"
    }
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => {
    return {
      id: item.id,
      label: item.label,
      createAt: format(item.createAt, "MMMM do, yyyy")
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage;