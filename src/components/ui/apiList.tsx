"use client"

import { useParams } from "next/navigation"
import useOrigin from "@/hooks/useOrigin"
import ApiAlerte from "@/components/ApiAlerte"


interface ApiListProps {
  entityName: string
  entityIdName: string
}

const ApiList: React.FC<ApiListProps> = ({
  entityName,
  entityIdName,
}) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`

  return (
    <>
      <ApiAlerte 
        title="GET"
        description={`${baseUrl}/${entityName}`}
        variant="public"
      />
      <ApiAlerte 
        title="GET"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant="public"
      />    
      <ApiAlerte 
        title="POST"
        description={`${baseUrl}/${entityName}`}
        variant="admin"
      />
      <ApiAlerte 
        title="PATCH"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant="admin"
      />
      <ApiAlerte 
        title="DELETE"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
        variant="admin"
      />
   
    </>
  )
}
export default ApiList;