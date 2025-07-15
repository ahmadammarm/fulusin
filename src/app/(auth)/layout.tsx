import Logo from "@/components/Logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center">
            <Logo />
            <div className="mt-5">
                {children}
            </div>
        </div>
    );
}