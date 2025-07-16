export default function WizardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center">
            {children}
        </div>
    )
}