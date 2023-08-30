import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

import { Billboard } from "@prisma/client";
import { StoreParams } from "@root/common.types";
import { BillboardColumn } from "@/components/billboardPage/Columns";
import BillboardClient from "@/components/billboardPage/BillboardClient";


export async function getBillboards(
  storeId: string
): Promise<Billboard[]> {
  try {
    const billboards = await prisma.billboard.findMany({
      where: {
        storeId,
      },
      orderBy: {
        createAt: "desc"
      }
    })
    return billboards 
  } catch (err) {
    console.error(err)
    throw err
  }
};


export default async function BillboardsPage ({
  params
}: StoreParams
) {
  const billboards = await getBillboards(params.storeId);

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
};