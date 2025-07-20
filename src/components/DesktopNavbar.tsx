"use client"

import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
// import { UserButton } from "@clerk/nextjs";

const NavbarItems = [
    { label: "Dashboard", href: "/" },
    { label: "Transactions", href: "/transactions" },
    { label: "Manage", href: "/manage" },
    { label: "AI Assistant", href: "/ai-assistant" },
]

const NavbarItemFuntion = ({ label, link }: { label: string; link: string }) => {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link href={link} className={cn(
                buttonVariants({ variant: "ghost" }), "w-full justify-start text-lg text-muted-foreground hover:text-foreground", isActive && "text-foreground font-semibold",
            )}>
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
            )}
        </div>
    )
}

export default function DesktopNavbar() {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo />
                    <div className="flex h-full md:ml-10">
                        {NavbarItems.map((item) => (
                            <NavbarItemFuntion
                                key={item.label}
                                label={item.label}
                                link={item.href} />
                        ))}
                    </div>
                </div>
                <div className="flex items-center">
                    {/* <UserButton afterSignOutUrl="/sign-in" /> */}
                </div>
            </nav>
        </div>
    )
}