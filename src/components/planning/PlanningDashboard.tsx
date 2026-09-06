"use client"

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { GetRecurringTransactionsAction } from "@/actions/recurring";

export default function PlanningDashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { data: recurringTx } = useQuery({
      queryKey: ["recurringTransactions"],
      queryFn: async () => await GetRecurringTransactionsAction(),
  });

  // Mock data for Advanced Analytics
  const analyticsData = [
    { name: 'Housing', value: 1200, color: '#3b82f6' }, // blue-500
    { name: 'Food', value: 500, color: '#10b981' }, // emerald-500
    { name: 'Transport', value: 200, color: '#f59e0b' }, // amber-500
    { name: 'Entertainment', value: 150, color: '#8b5cf6' }, // violet-500
    { name: 'Utilities', value: 250, color: '#ec4899' }, // pink-500
  ];

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="border-b bg-card">
          <div className="container flex flex-wrap items-center justify-between gap-6 py-10 pt-20 md:pt-12 px-5 md:px-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 z-0"></div>
              <div className="relative z-10">
                  <p className="text-4xl font-extrabold ml-5 bg-gradient-to-r from-teal-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                      Financial Planning
                  </p>
                  <p className="text-muted-foreground ml-5 mt-2 font-medium">
                      Manage your budgets, set savings goals, and automate your recurring transactions.
                  </p>
              </div>
          </div>
      </div>

      <div className="container mx-auto p-4 md:px-12 space-y-6 mt-6 flex-1">
        <Tabs defaultValue="recurring" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl bg-muted/60 p-1">
            <TabsTrigger value="budgets" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-teal-500 transition-all">Budgets & Goals</TabsTrigger>
            <TabsTrigger value="recurring" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-teal-500 transition-all">Recurring Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-teal-500 transition-all">Advanced Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budgets</CardTitle>
                <CardDescription>Set spending limits for your categories.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🚧</span>
                      </div>
                      <p className="mb-4 text-lg font-medium">Budget tracking UI is currently under construction.</p>
                      <Button variant="default" className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20">Create New Budget</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Recurring Transactions</CardTitle>
                      <CardDescription className="text-base mt-1">Manage your automated recurring income and expenses.</CardDescription>
                    </div>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 transition-all">Add Recurring</Button>
                </div>
              </CardHeader>
              <CardContent>
                  {recurringTx && recurringTx.length > 0 ? (
                      <div className="rounded-md border">
                          <table className="w-full text-sm">
                              <thead className="bg-muted text-muted-foreground">
                                  <tr>
                                      <th className="p-3 text-left font-medium">Category</th>
                                      <th className="p-3 text-left font-medium">Description</th>
                                      <th className="p-3 text-left font-medium">Amount</th>
                                      <th className="p-3 text-left font-medium">Frequency</th>
                                      <th className="p-3 text-left font-medium">Next Date</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {recurringTx.map(tx => (
                                      <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                          <td className="p-3 flex items-center gap-2">
                                              <span>{tx.categoryIcon}</span>
                                              <span className="capitalize">{tx.category}</span>
                                          </td>
                                          <td className="p-3">{tx.description || "-"}</td>
                                          <td className="p-3 font-medium">
                                              <span className={tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}>
                                                  {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                              </span>
                                          </td>
                                          <td className="p-3 capitalize">{tx.frequency}</td>
                                          <td className="p-3 text-muted-foreground">{new Date(tx.nextDate).toLocaleDateString()}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  ) : (
                      <div className="flex justify-center p-8 text-muted-foreground border-2 border-dashed rounded-lg bg-card/50">
                          <div className="text-center">
                              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-border shadow-sm">
                                  <span className="text-2xl">✨</span>
                              </div>
                              <p className="mb-4 text-lg font-medium">You have no recurring transactions yet.</p>
                              <Button variant="outline" className="hover:text-teal-500 hover:border-teal-500 transition-colors">Add Your First One</Button>
                          </div>
                      </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown by Category</CardTitle>
                <CardDescription>Visualizing exactly where your money is going this month.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[400px]">
                  {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={analyticsData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={80}
                                  outerRadius={120}
                                  paddingAngle={5}
                                  dataKey="value"
                                  stroke="none"
                              >
                                  {analyticsData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                              </Pie>
                              <Tooltip 
                                  formatter={(value) => `$${value}`}
                                  contentStyle={{ borderRadius: '8px', backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', border: '1px solid hsl(var(--border))' }}
                              />
                              <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Loading chart...
                      </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
