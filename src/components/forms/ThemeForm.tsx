"use client"

import { z } from "zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Theme } from "@prisma/client";
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



const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  value: z.string().min(1),
})
export type ThemeFormValue = z.infer<typeof themeSchema>

interface ThemeFormProps {
  initialData: Theme | null
}

const ThemeForm: React.FC<ThemeFormProps> = ({
  initialData
}) => {

  const params = useParams();
  // custom hook
  const { loading, onSubmit, onDelete } = useSubmitFormAction("Theme");

  const [open, setOpen] = useState(false);
 
  const title = initialData ? "Edit theme" : "Create theme" 
  const description = initialData ? "Edit theme" : "Add a new theme" 
  const httpVerb  = initialData ? "PATCH" : "POST"
  const actionBtn = initialData ? "Save changes" : "Create" 
  
  const apiRoute = initialData 
    ? `/api/${params.storeId}/themes/${params.themeId}` 
    : `/api/${params.storeId}/themes`

  const methods = useForm<ThemeFormValue>({
    resolver: zodResolver(themeSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
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
        label={initialData?.name}
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
                      placeholder="Theme name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="value"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="Theme value"
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
          >
            {actionBtn}
          </Button>
        </form>
      </Form>    
    </>
  )
}

export default ThemeForm;