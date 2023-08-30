import { create } from "zustand";

interface StoreModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

interface ImageIdStore {
  publicId: string
  setPublicId: (newPublicId: string) => void
}


export const useStoreModal = create<StoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}))

export const usePublicIdStore = create<ImageIdStore>((set) => ({
  publicId: "",
  setPublicId: (newPublicId) => set({publicId: newPublicId})
}))