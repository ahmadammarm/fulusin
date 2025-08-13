import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-6xl text-white mb-4 font-bold">404</h1>
            <h2 className="text-2xl text-white mb-2 font-semibold">Page Not Found</h2>
            <p className="text-zinc-500 mb-8">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link href="/" passHref>
                <Button className="px-6 py-3 bg-white text-black rounded-md text-base font-medium">
                    Back to Homepage
                </Button>
            </Link>
        </div>
    );
}
