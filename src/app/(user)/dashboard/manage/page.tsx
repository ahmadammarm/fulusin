"use client"

import CategoryList from "@/components/CategoryList"
import { CurrencyCombobox } from "@/components/CurrencyCombobox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManagePage() {
    return (
        <>
            <div className="border bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div className="px-5">
                        <p className="text-3xl font-bold">
                            Manage
                        </p>
                        <p className="text-muted-foreground">
                            Manage your currency or transaction categories
                        </p>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Currency
                        </CardTitle>
                        <CardDescription>
                            Set your default currency for the transactions. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CurrencyCombobox />
                    </CardContent>
                </Card>
                <CategoryList type="income" />
                <CategoryList type="expense" />
            </div>
        </>
    )
}