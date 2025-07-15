import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import DesktopNavbar from "./DesktopNavbar";

export const NavbarItems = [
    { label: "Dashboard", href: "/" },
    { label: "Transactions", href: "/transactions" },
    { label: "Manage", href: "/manage" },
    { label: "AI Assistant", href: "/ai-assistant" },
]

export function NavbarItemFuntion({ label, link }: { label: string; link: string }) {
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

export default function Navbar() {
    return (
        <>
            <DesktopNavbar />
        </>
    )
}