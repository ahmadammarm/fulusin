import { ThemeProvider } from 'next-themes';

export default function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute={"class"}
            defaultTheme={"dark"}
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}