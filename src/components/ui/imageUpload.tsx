"use client"

import Image from "next/image"
import { ImagePlus, Trash } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { useState, useEffect } from "react"
import { Button } from "./button"
import { usePublicIdStore } from "@/hooks/useStore"

interface ImageUploadProps {
  disable?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}


const ImageUpload: React.FC<ImageUploadProps> = ({
  disable,
  onChange,
  onRemove,
  value
}) => {
  // hook from zustand store
  const { setPublicId } = usePublicIdStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, []);  

  function onUpload(result: any) {

    setPublicId(result.info.public_id)
    onChange(result.info.secure_url)
  }

  return isMounted ? (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {value.map((url) => {
          return (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="absolute top-2 right-2 z-10">
                <Button 
                  type="button"
                  onClick={()=> onRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="w-4 h-4"/>
                </Button>
              </div>
              <Image 
                className="object-cover"
                src={url}
                fill
                sizes="(max-width: 200px) 100vw"
                alt="Image preview"
              />
            </div>
          )
        })}
      </div> 
      <CldUploadWidget 
        onUpload={onUpload} 
        uploadPreset="wtnscm0c"
      >
        {({open}) => {
          const onClick = () => {
            open();
          }
          return (
            <Button
              type="button"
              disabled={disable}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="w-4 h-4 mr-2"/>
              Upload an image
            </Button>
          )
        }}
      </CldUploadWidget>   
    </div>

  ) : <div />
}

export default ImageUpload;