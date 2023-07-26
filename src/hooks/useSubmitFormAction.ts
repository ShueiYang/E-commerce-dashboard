import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { SettingFormValue } from "@/components/forms/SettingsForm";
import { BillboardFormValue, formSchema } from "@/components/forms/BillboardForm";

type SubmitProps = (
  values: SettingFormValue | BillboardFormValue,
  apiRoute: string,
  httpVerb: string
) => Promise<void>


function useSubmitFormAction () {

  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  
  const onSubmit: SubmitProps = useCallback(async ( 
    values,
    apiRoute,
    httpVerb,
  ) => {
    try {
      // check billboardForm validation with Zod
      const formValidation = formSchema.safeParse(values);
      const response = await fetch(apiRoute, {
        method: httpVerb,
        headers: {"Content-Type": "application/json"},
        body:  JSON.stringify(values)
      })
      if(!response.ok) {
        throw new Error("Something went wrong...")
      }
      if(formValidation.success) {
        router.refresh();
        router.push(`/${params.storeId}/billboards`)
        toast.success(
          `Billboard successfully ${httpVerb === "PATCH" ? "updated." : "created."}`
        )
      } else {
        router.refresh();
        toast.success("Store updated successfully")
      } 
    } catch (err) {
      console.error(err);
      if(err instanceof Error) {
        toast.error(err.message)
      }  
    }
  }, [router, params.storeId]);



  const onDelete = useCallback(
    async (apiRoute: string, label: string): Promise<void> => {
      try { 
        setLoading(true)
        const response = await fetch(apiRoute, {
          method: "DELETE",
        })
        if(response.ok) {
          router.refresh();
          // check label before redirect or not
          if(label === "Billboard") {
            router.push(`/${params.storeId}/billboards`)
          } else if (label === "Store") {
            router.push("/")
          }       
          toast.success(`${label} successfully deleted`)
        } else if (response.status === 401) {
          toast.error("You are not authorized to perform this action")
        } else if (response.status === 400) {
          toast.error("Missing parameter")
        }  
      } catch (err) {
        console.error(err);
        toast.error("Make sure you removed all products and categories first")
      } finally {
        setLoading(false)
      }
    }, [router, params.storeId]);
  

  return {
    loading,
    onSubmit,
    onDelete,
  }
}

export default useSubmitFormAction;