"use client"

import { z } from "zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/imageUpload";
import useSubmitFormAction from "@/hooks/useSubmitFormAction";
import { usePublicIdStore } from "@/hooks/useStore";


const billboardSchema = z.object({
  label: z.string().min(1, "Label name is required"),
  imageUrl: z.string().nonempty("No image uploaded"),
  publicId: z.string().nonempty()
})
export type BillboardFormValue = z.infer<typeof billboardSchema>

interface BillboardFormProps {
  initialData: Billboard | null
}

const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {

  const params = useParams();
  // custom hook
  const { publicId } = usePublicIdStore();
  const { loading, onSubmit, onDelete } = useSubmitFormAction("Billboard");

  const [open, setOpen] = useState(false);
 
  const title = initialData ? "Edit billboard" : "Create billboard" 
  const description = initialData ? "Edit the billboard" : "Add a new billboard" 
  const httpVerb  = initialData ? "PATCH" : "POST"
  const actionBtn = initialData ? "Save changes" : "Create" 
  
  const apiRoute = initialData 
    ? `/api/${params.storeId}/billboards/${params.billboardId}` 
    : `/api/${params.storeId}/billboards`

  const methods = useForm<BillboardFormValue>({
    resolver: zodResolver(billboardSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
      publicId: "",
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
        onConfirm={()=> {onDelete(apiRoute)}}
        loading={loading}
        label={initialData?.label}
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
          <FormField
            control={methods.control}
            name="imageUrl"
            render={({field}) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ? [field.value] : []}
                    disable={isSubmitting}
                    onChange={(url)=> field.onChange(url)}
                    onRemove={()=> field.onChange("")  }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={methods.control}
              name="label"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>  
          <Button 
            type="submit"
            disabled={isSubmitting}
            // set the publicId to save on the DB 
            onClick={()=> {
              setValue("publicId", initialData ? initialData.publicId : publicId)
            }}
          >
            {actionBtn}
          </Button>
        </form>
      </Form>    
    </>
  )
}

export default BillboardForm;