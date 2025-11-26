"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button, buttonVariants } from "./ui/button"
import { Menu } from "lucide-react"
import Logo, { LogoMobile } from "./Logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import SignoutButton from "./auth/SignoutButton"

const NavbarItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Transactions", href: "/dashboard/transactions" },
    { label: "Manage", href: "/dashboard/manage" },
    // { label: "Education", href: "/dashboard/education" },
]

const NavbarItemFuntion = ({ label, link, clickCallback }: { label: string; link: string; clickCallback: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className=" flex items-center">
            <Link href={link} className={cn(
                buttonVariants({ variant: "ghost" }), "w-full justify-start text-lg text-muted-foreground hover:text-foreground", isActive && "text-foreground font-semibold",
            )}
                onClick={() => {
                    if (clickCallback) {
                        clickCallback();
                    }
                }}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
            )}
        </div>
    )
}

export default function MobileNavbar() {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div className="block bg-background md:hidden w-full fixed top-0 left-0 z-50">
            <nav className="flex items-center justify-between px-4 w-full h-16 shadow-md">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[80%] sm:w-[400px]" side="left">
                        <Logo />
                        <div className="flex flex-col gap-1 pt-4">
                            {NavbarItems.map((item) => (
                                <NavbarItemFuntion
                                    key={item.label}
                                    label={item.label}
                                    link={item.href}
                                    clickCallback={() => setIsOpen(false)}
                                />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-x-4">
                    <LogoMobile />
                </div>
                <div className="flex items-center gap-2">
                    <SignoutButton />
                </div>
            </nav>
        </div>

    )
}