"use client"

import { useEffect } from "react"
import { useStoreModal } from "@/hooks/useStore"


export default function AdminPage() {

  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)


  useEffect(() => {
    if(!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return null;
}