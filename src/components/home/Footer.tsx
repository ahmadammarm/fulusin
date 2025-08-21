import Logo from "../Logo";

export default function Footer() {
    return (
        <footer className="py-12 px-4 bg-card border-t border-border">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Logo />
                </div>
                <p className="text-muted-foreground mb-4">
                    Empowering individuals to make smarter financial decisions, one period at a time.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-accent transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-accent transition-colors">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-accent transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    )
}