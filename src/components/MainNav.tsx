"use client"

import Link from "next/link";
import { cn } from "@/lib/utils"
import { useParams, usePathname } from "next/navigation";


export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  
  const navRoutes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`
    },
    {
      href: `/${params.storeId}/themes`,
      label: "Themes",
      active: pathname === `/${params.storeId}/themes`
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`
    }
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      { navRoutes.map((route)=> {
        return(
          <Link
            key={route.href}
            href={route.href}
            className={cn("text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-black dark:text-white" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}