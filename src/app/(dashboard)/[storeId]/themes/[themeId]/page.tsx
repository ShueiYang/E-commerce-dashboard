import { ThemeParams } from "@root/common.type";
import { prisma } from "@/lib/prisma";
import ThemeForm from "@/components/forms/ThemeForm";


 export default async function ThemePage({
  params 
}: ThemeParams
) {
  const theme = await prisma.theme.findUnique({
    where: {
      id: params.themeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ThemeForm initialData={theme} />
      </div>
    </div>
  );
};