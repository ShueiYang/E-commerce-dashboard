"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { CategorieColumn } from "./Columns";
import AlertModal from "@/components/modals/alertModal";
import useSubmitFormAction from "@/hooks/useSubmitFormAction";

interface CellActionProps {
  data: CategorieColumn
}

const CellAction: React.FC<CellActionProps> = ({data}) => {
  const router = useRouter();
  const params = useParams();

  const { loading, onDelete } = useSubmitFormAction("Category");
  const [ open, setOpen ] = useState(false);

  const apiRoute = `/api/${params.storeId}/categories/${data.id}` 

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Category Id copied to the clipboard")
  }
  const handleDelete = async () => {
    await onDelete(apiRoute)
    setOpen(false)
  }

  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={()=> {setOpen(false)}}
        onConfirm={handleDelete}
        loading={loading}
        label={data.name} 
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            className="w-8 h-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={()=> onCopy(data.id)}> 
            <Copy className="w-4 h-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=> setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent> 
      </DropdownMenu>
    </>
  )
}

export default CellAction;