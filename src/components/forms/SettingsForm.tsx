"use client"

import { z } from "zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Store } from "@prisma/client";
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
import ApiAlerte from "@/components/ApiAlerte";
import useOrigin from "@/hooks/useOrigin";
import useSubmitFormAction from "@/hooks/useSubmitFormAction";
import { storeSchema } from "@/components/modals/storeModal";

export type SettingFormValue = z.infer<typeof storeSchema>

interface SettingsFormProps {
  initialData: Store
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {
  
  const params = useParams();
  // custom hook
  const origin = useOrigin();
  const { loading, onSubmit, onDelete } = useSubmitFormAction("Store");

  const [open, setOpen] = useState(false);

  const apiRoute = `/api/stores/${params.storeId}`

  const methods = useForm<SettingFormValue>({
    resolver: zodResolver(storeSchema),
    defaultValues: initialData
  })
  // destructure useForm to retrieve methods from ReactHookForm api
  const { handleSubmit, formState: {isSubmitting} } = methods;


  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={()=> {setOpen(false)}}
        onConfirm={()=> {onDelete(apiRoute)}}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage store preferences"
        />
        <Button
          disabled={isSubmitting}
          variant="destructive"
          size="icon"
          onClick={()=> {setOpen(true)}}
        >
          <Trash className="w-4 h-4"/>
        </Button>
      </div>
      <Separator />
      <Form {...methods}>
        <form 
          onSubmit={handleSubmit((data) => onSubmit(data, apiRoute, "PATCH"))}
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>  
          <Button disabled={isSubmitting} type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlerte 
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}

export default SettingsForm;