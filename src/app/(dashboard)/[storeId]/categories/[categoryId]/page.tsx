import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/forms/CategoryForm";
import { CategoryParams } from "@/app/(dashboard)/[storeId]/layout";
import { getBillboards } from "@/app/(dashboard)/[storeId]/billboards/page";


const CategoryPage = async ({params}: CategoryParams) => {

  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId
    }
  });

  const billboards = await getBillboards(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm 
          initialData={category}
          billboards={billboards}
        />
      </div>
    </div>
  )
}

export default CategoryPage;