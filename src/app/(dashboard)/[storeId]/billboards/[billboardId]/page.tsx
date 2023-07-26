import { prisma } from "@/lib/prisma";
import BillboardForm from "@/components/forms/BillboardForm";
import { BillboardParams } from "@/app/(dashboard)/[storeId]/layout";


const BillboardFormPage = async ({params}: BillboardParams) => {

  const billboard = await prisma.billboard.findUnique({
    where: {
      id: params.billboardId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard}/>
      </div>
    </div>
  )
}

export default BillboardFormPage;