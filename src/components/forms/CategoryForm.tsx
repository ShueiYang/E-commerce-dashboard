"use client"

import { z } from "zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Billboard, Category } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form,
  FormControl,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alertModal";
import useSubmitFormAction from "@/hooks/useSubmitFormAction";
import { usePublicIdStore } from "@/hooks/useStore";
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";


export const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  billboardId: z.string().min(1),
})
export type CategoryFormValue = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {

  const params = useParams();
  // custom hook
  const { publicId } = usePublicIdStore();
  const { loading, onSubmit, onDelete } = useSubmitFormAction();

  const [open, setOpen] = useState(false);
 
  const title = initialData ? "Edit category" : "Create category" 
  const description = initialData ? "Edit the category" : "Add a new category" 
  const httpVerb  = initialData ? "PATCH" : "POST"
  const actionBtn = initialData ? "Save changes" : "Create" 
  
  const apiRoute = initialData 
    ? `/api/${params.storeId}/billboards/${params.billboardId}` 
    : `/api/${params.storeId}/billboards`

  const methods = useForm<CategoryFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    }
  })
  // destructure useForm to retrieve methods from ReactHookForm api
  const { 
    handleSubmit, 
    setValue, 
    formState: {
      isSubmitting
    }
  } = methods;


  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={()=> {setOpen(false)}}
        onConfirm={()=> {onDelete(apiRoute, "Billboard")}}
        loading={loading}
        // label={initialData?.label}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        { initialData && 
          <Button
            disabled={isSubmitting}
            variant="destructive"
            size="icon"
            onClick={()=> {setOpen(true)}}
          > 
            <Trash className="w-4 h-4"/>
          </Button>
        }
      </div>
      <Separator />
      <Form {...methods}>
        <form 
          onSubmit={handleSubmit((data) => onSubmit(data, apiRoute, httpVerb))}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={methods.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="billboardId"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}   
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>  
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {actionBtn}
          </Button>
        </form>
      </Form>    
    </>
  )
}

export default CategoryForm;