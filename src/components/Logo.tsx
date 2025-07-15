import { HandCoins } from 'lucide-react'
import Link from 'next/link'

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <HandCoins className="stroke h-11 w-11 stroke-teal-500 stroke-[1.5]" />
            <p className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent">
                Finscopease
            </p>
        </Link>
    )
}