import Logo from "@/components/Logo";
import { NavbarItemFuntion, NavbarItems } from "./Navbar";
import { UserButton } from "@clerk/nextjs";

export default function DesktopNavbar() {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo />
                    <div className="flex h-full">
                        {NavbarItems.map((item) => (
                            <NavbarItemFuntion
                                key={item.label}
                                label={item.label}
                                link={item.href} />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    )
}