"use client"

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/useStore"
import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator
} from "@/components/ui/command"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}


export default function StoreSwitcher({
  className,
  items = []
}: StoreSwitcherProps
) {

  const storeModal = useStoreModal();
  const router = useRouter();
  const params = useParams();

  const [ open, setOpen ] = useState(false);

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }))

  const currentStore = formattedItems.find((item) => item.value === params.storeId)

  function onStoreSelect (store: {label: string, value: string}) {
    setOpen(false);
    router.push(`${store.value}`)
  }

  return (
    <Popover open={open}  onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select Store"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="w-4 h-4 mr-2"/>
            {currentStore?.label}
          <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50 ml-auto"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..."/>
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => {
                return (
                  <CommandItem
                    key={store.value}
                    onSelect={()=> onStoreSelect(store)}
                    className="text-sm"
                  >
                    <StoreIcon className="w-4 h-4 mr-2"/>
                    {store.label}
                    <Check 
                      className={cn("w-4 h-4 ml-auto",
                        currentStore?.value === store.value 
                          ? "opacity-100"
                          : "opacity-0" 
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
              >
                <PlusCircle className="w-5 h-5 mr-2"/>
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
