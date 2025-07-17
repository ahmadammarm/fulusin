"use client"

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function RootProvider({ children }: { children: React.ReactNode }) {

    const queryClient = new QueryClient();

    return (

        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute={"class"}
                defaultTheme={"dark"}
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}