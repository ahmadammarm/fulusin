import { HandCoins } from "lucide-react";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0">
                <HandCoins className="h-5 w-5 stroke-[1.75]" />
            </div>
            <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-xl font-bold leading-tight tracking-tight text-transparent group-data-[collapsible=icon]:hidden">
                Fulusin
            </span>
        </Link>
    );
}

export function LogoMobile() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0">
                <HandCoins className="h-4 w-4 stroke-[1.75]" />
            </div>
            <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-lg font-bold leading-tight tracking-tight text-transparent">
                Fulusin
            </span>
        </Link>
    );
}
