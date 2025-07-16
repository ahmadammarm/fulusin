import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WizardPage() {

    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="container flex max-w-2xl flex-col items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-center text-3xl">
                    Welcome, <span className="ml-2 font-bold">{user.firstName}</span>
                </h1>
                <h2 className="mt-4 text-center text-base text-muted-foreground">
                    Let &apos;s get started by setting up your currency preferences.
                </h2>

                <h3 className="mt-2 text-center text-sm text-muted-foreground">
                    You can always change these later in your account settings.
                </h3>
            </div>
            <Separator />
            <Card className="w-full">
                <CardHeader className="">
                    <CardTitle>
                        Currency Preferences
                    </CardTitle>
                    <CardDescription>
                        Select your preferred currency for transactions and reports.
                    </CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Separator />
            <Link href="/">
                <Button className="w-full" asChild>
                    I &apos;m all set! Take me to the dashboard
                </Button>
            </Link>
        </div>
    )
}