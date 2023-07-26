import { UserButton, auth } from "@clerk/nextjs";
import MainNav from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


const Navbar = async () => {

  const { userId } = auth();

  if(!userId) {
    redirect("/sign-in")
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    }
  })
  
  return (

    <div className="border-b">
      <div className="flex h-16 items-center px-6">
        <StoreSwitcher items={stores}/>
        <div>
          This will be the routes
        </div>
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar;