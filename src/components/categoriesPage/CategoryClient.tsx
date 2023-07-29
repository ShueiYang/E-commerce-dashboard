"use client"

import { CategorieColumn, columns } from "./Columns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/ui/heading";
import ApiList from "@/components/ui/apiList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/dataTable";

interface CategoriesClientProps {
  data: CategorieColumn[]
}


const CategoryClient: React.FC<CategoriesClientProps> = ({data}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Categories (${data.length})`}
          description="Manage Categories for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
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
        description="API calls for Categories"
      />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId"/>
    </>
    
  )
}

export default CategoryClient;