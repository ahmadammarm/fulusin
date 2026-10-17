"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock data for Advanced Analytics
  const analyticsData = [
    { name: 'Housing', value: 1200, color: '#3b82f6' }, // blue-500
    { name: 'Food', value: 500, color: '#10b981' }, // emerald-500
    { name: 'Transport', value: 200, color: '#f59e0b' }, // amber-500
    { name: 'Entertainment', value: 150, color: '#8b5cf6' }, // violet-500
    { name: 'Utilities', value: 250, color: '#ec4899' }, // pink-500
  ];

  return (
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
  );
}
