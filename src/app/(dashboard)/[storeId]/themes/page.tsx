import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

import { Theme } from "@prisma/client";
import { StoreParams } from "@root/common.type";
import { ThemeColumn } from "@/components/themesPage/Columns";
import ThemeClient from "@/components/themesPage/ThemeClient";


export async function getThemes(
  storeId: string
): Promise<Theme[]> {
  try {
    const themes = await prisma.theme.findMany({
      where: {
        storeId,
      },
      orderBy: {
        createAt: "desc"
      }
    });
    return themes;   
  } catch (err) {
    console.error(err)
    throw err
  }
}


export default async function ThemesPage({
  params 
}: StoreParams
) {
  const themes = await getThemes(params.storeId);

  const formattedThemes: ThemeColumn[] = themes.map((item) => {
    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createAt: format(item.createAt, "MMMM do, yyyy")
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ThemeClient data={formattedThemes} />
      </div>
    </div>
  );
};