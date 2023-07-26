"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast";
import { Store } from "@prisma/client";
// import { useRouter } from "next/navigation";

import { useStoreModal } from "@/hooks/useStore"
import { Modal } from "./modal"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const storeSchema = z.object({
  name: z.string().min(1, "Name is required")
})

type StoreModalForm = z.infer<typeof storeSchema>


export const StoreModal = () => {
  // const router = useRouter();
  const storeModal = useStoreModal();

  const methods = useForm<StoreModalForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
    }
  })
  const { handleSubmit, formState: {isSubmitting} } = methods;

  
  async function onSubmit(values: StoreModalForm) {
    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:  JSON.stringify(values)
      })
      const data = await response.json() as Store;
      if(response.status === 201) {
        // router.refresh();
        window.location.assign(`/${data.id}`)
      } else {
        throw new Error("Something went wrong...")
      }   
    } catch (err: unknown) {
      console.error(err);
      if(err instanceof Error) {
        toast.error(err.message)
      }  
    }
  }

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={methods.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isSubmitting}
                        placeholder="E-commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end w-full pt-6 space-x-2">
                <Button 
                  type="button"
                  disabled={isSubmitting}
                  variant="outline" 
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}