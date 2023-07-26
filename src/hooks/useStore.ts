import { create } from "zustand";

interface UseStoreModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

interface UseStoreImageId {
  publicId: string
  setPublicId: (newPublicId: string) => void
}


export const useStoreModal = create<UseStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}))


export const usePublicIdStore = create<UseStoreImageId>((set) => ({
  publicId: "",
  setPublicId: (newPublicId) => set({publicId: newPublicId})
}))