import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { StoreParams } from "@/app/(dashboard)/[storeId]/layout";
import { CategorieColumn } from "@/components/categoriesPage/Columns";
import CategoriesClient from "@/components/categoriesPage/CategoriesClient";

type CategoryData = Prisma.CategoryGetPayload<{include: {billboard: true}}>

export async function getCategories(
  storeId: string
): Promise<CategoryData[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        storeId,
      },
      include: {
        billboard: true
      },
      orderBy: {
        createAt: "desc"
      }
    });
    return categories;   
  } catch (err) {
    console.error(err)
    throw err
  }
}


export default async function CategoriesPage({
  params 
}: StoreParams
) {
  const categories = await getCategories(params.storeId);

  const formattedCategories: CategorieColumn[] = categories.map((item) => {
    return {
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createAt: format(item.createAt, "MMMM do, yyyy")
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};