import { auth } from "@/lib/auth";
import { GetFormatterForCurrency } from "@/lib/currencyFormatter";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { Prisma, Transaction } from "@/generated/prisma/client";
import { parseWibDate } from "@/lib/dateHelper";
import { addCurrency, roundCurrency, subtractCurrency } from "@/lib/financialMath";

export interface TransactionHistoryItem {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    description: string | null;
    date: Date;
    userId: string;
    type: string;
    category: string;
    categoryIcon: string;
    formattedAmount: string;
}

export type GetTransactionHistoryResponse = TransactionHistoryItem[];

export interface PaginatedTransactionHistoryResponse {
    items: TransactionHistoryItem[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    summary: {
        totalInflow: number;
        totalOutflow: number;
        netBalance: number;
    };
}

export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    try {
        const { searchParams } = new URL(request.url);
        const pageParam = searchParams.get("page");
        const isPaginated = pageParam !== null && pageParam !== undefined;

        const currencySettings = await prisma.currencySettings.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!currencySettings) {
            return NextResponse.json(
                { error: "Currency settings not found. Complete wizard onboarding first." },
                { status: 400 }
            );
        }

        const formatter = GetFormatterForCurrency(currencySettings.currency);

        // Build filtering conditions
        const whereClause: Prisma.TransactionWhereInput = {
            userId: user.id,
        };

        const type = searchParams.get("type");
        if (type && (type === "income" || type === "expense")) {
            whereClause.type = type;
        }

        const category = searchParams.get("category");
        if (category && category !== "all") {
            whereClause.category = category;
        }

        const search = searchParams.get("search");
        if (search && search.trim()) {
            whereClause.OR = [
                { description: { contains: search.trim(), mode: "insensitive" } },
                { category: { contains: search.trim(), mode: "insensitive" } },
            ];
        }

        const from = searchParams.get("from");
        const to = searchParams.get("to");
        if (from || to) {
            whereClause.date = {};
            if (from) {
                const { wibStartOfDay } = parseWibDate(from);
                whereClause.date.gte = wibStartOfDay;
            }
            if (to) {
                const { wibEndOfDay } = parseWibDate(to);
                whereClause.date.lte = wibEndOfDay;
            }
        }

        const sortField = searchParams.get("sortField") === "amount" ? "amount" : "date";
        const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

        // Unpaginated mode (backward compatible with client-side tanstack-table)
        if (!isPaginated) {
            const transactions = await prisma.transaction.findMany({
                where: whereClause,
                orderBy: {
                    [sortField]: sortOrder,
                },
            });

            const formatted: TransactionHistoryItem[] = transactions.map((t: Transaction) => ({
                ...t,
                formattedAmount: formatter.format(t.amount),
            }));

            return NextResponse.json(formatted);
        }

        // Server-side paginated mode
        const page = Math.max(1, parseInt(pageParam || "1", 10));
        const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
        const skip = (page - 1) * pageSize;

        const [totalItems, transactions, aggregatedSums] = await Promise.all([
            prisma.transaction.count({
                where: whereClause,
            }),
            prisma.transaction.findMany({
                where: whereClause,
                skip,
                take: pageSize,
                orderBy: {
                    [sortField]: sortOrder,
                },
            }),
            prisma.transaction.groupBy({
                by: ["type"],
                where: whereClause,
                _sum: {
                    amount: true,
                },
            }),
        ]);

        let totalInflow = 0;
        let totalOutflow = 0;
        for (const item of aggregatedSums) {
            const sum = roundCurrency(item._sum.amount || 0);
            if (item.type === "income") {
                totalInflow = addCurrency(totalInflow, sum);
            } else if (item.type === "expense") {
                totalOutflow = addCurrency(totalOutflow, sum);
            }
        }
        const netBalance = subtractCurrency(totalInflow, totalOutflow);

        const items: TransactionHistoryItem[] = transactions.map((t: Transaction) => ({
            ...t,
            formattedAmount: formatter.format(t.amount),
        }));

        const response: PaginatedTransactionHistoryResponse = {
            items,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize) || 1,
            },
            summary: {
                totalInflow,
                totalOutflow,
                netBalance,
            },
        };

        return NextResponse.json(response);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch transaction history";
        console.error("Error in transaction-history route:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
