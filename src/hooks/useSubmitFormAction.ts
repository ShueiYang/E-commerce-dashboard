import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { pluralize } from "@/utils/utility";

import { SettingFormValue } from "@/components/forms/SettingsForm";
import { BillboardFormValue } from "@/components/forms/BillboardForm";

type FormProps = 
  SettingFormValue |
  BillboardFormValue

type SubmitProps = (
  values: FormProps,
  apiRoute: string,
  httpVerb: string,
) => Promise<void>


function useSubmitFormAction (label: string) {

  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  
  const onSubmit: SubmitProps = useCallback(async ( 
    values,
    apiRoute,
    httpVerb,
  ) => {
    try {
      const response = await fetch(apiRoute, {
        method: httpVerb,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values)
      })
      if(!response.ok) {
        throw new Error("Something went wrong...")
      }
      if(label === "Store") {
        router.refresh();
        toast.success("Store updated successfully")
      } else {
        router.refresh();
        router.push(`/${params.storeId}/${pluralize(label)}`)
        toast.success(
          `${label} successfully ${httpVerb === "PATCH" ? "updated." : "created."}`
        )
      } 
    } catch (err) {
      console.error(err);
      if(err instanceof Error) {
        toast.error(err.message)
      }  
    }
  }, [router, params.storeId, label]);



  const onDelete = useCallback(
    async (apiRoute: string): Promise<void> => {
      try { 
        setLoading(true)
        const response = await fetch(apiRoute, {
          method: "DELETE",
        })
        if(response.ok) {
          router.refresh();
          // check label before redirect
          if(label === "Store") {
            router.push("/")
          } else {
            router.push(`/${params.storeId}/${pluralize(label)}`)
          }       
          toast.success(`${label} successfully deleted.`)
        } else if (response.status === 401) {
          toast.error("You are not authorized to perform this action")
        } else if (response.status === 400) {
          toast.error("Missing parameter")
        }  
      } catch (err) {
        console.error(err);
        toast.error(`Make sure you removed all products using this ${label.toLowerCase()} first`)
      } finally {
        setLoading(false)
      }
    }, [router, params.storeId, label]);
  

  return {
    loading,
    onSubmit,
    onDelete,
  }
}

export default useSubmitFormAction;