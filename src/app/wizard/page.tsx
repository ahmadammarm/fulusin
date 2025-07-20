import { CurrencyCombobox } from "@/components/CurrencyCombobox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WizardPage() {

    const session = await auth();
    if (!session || !session.user) {
        redirect("/signin");
    }

    const user = session.user;

    return (
        <div className="container flex max-w-2xl flex-col items-center justify-between gap-4 p-4">
            <div>
                <h1 className="text-center text-3xl">
                    Welcome, <span className="ml-2 font-bold">{user.name}</span>
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
                    <CurrencyCombobox />
                </CardContent>
            </Card>
            <Separator />
            <Button className="w-full" asChild>
                <Link href="/">
                    I &apos;m all set! Take me to the dashboard
                </Link>
            </Button>
            <div className="mt-10">
                <Logo />
            </div>
        </div>
    )
}