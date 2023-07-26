"use client"

import { BillboardColumn, columns } from "@/components/billboardPage/Columns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/ui/heading";
import ApiList from "@/components/ui/apiList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/dataTable";

interface BillboardClientProps {
  data: BillboardColumn[]
}


const BillboardClient: React.FC<BillboardClientProps> = ({data}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable 
        searchKey="label"
        columns={columns} 
        data={data}
      />
      <Heading 
        title="API"
        description="API calls for Billboards"
      />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId"/>
    </>
    
  )
}

export default BillboardClient;