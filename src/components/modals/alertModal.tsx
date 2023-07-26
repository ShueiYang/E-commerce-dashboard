"use client"

import { useEffect, useState } from "react"
import { Modal } from "./modal"
import { Button } from "@/components/ui/button"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  label?: string
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  label
}) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[])

  if(!isMounted) {
    return null;
  }

  return (
    <Modal
      title={`Are you sure you want to delete ${label ? label : "this store"} ?`}
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full flex items-center justify-end pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose} >
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}

export default AlertModal;