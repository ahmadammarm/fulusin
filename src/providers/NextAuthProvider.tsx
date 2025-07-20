/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: any;
}) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}