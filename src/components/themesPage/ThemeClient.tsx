"use client"

import { ThemeColumn, columns } from "./Columns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/ui/heading";
import ApiList from "@/components/ui/apiList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/dataTable";


interface ThemeClientProps {
  data: ThemeColumn[]
}


const ThemeClient: React.FC<ThemeClientProps> = ({data}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Themes (${data.length})`}
          description="Manage Themes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/themes/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable 
        searchKey="name"
        columns={columns} 
        data={data}
      />
      <Heading 
        title="API"
        description="API calls for Themes"
      />
      <Separator />
      <ApiList entityName="themes" entityIdName="themeId"/>
    </>
    
  )
}

export default ThemeClient;