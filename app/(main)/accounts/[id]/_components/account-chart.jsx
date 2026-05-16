"use client";

import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// #region Sample data

const DATE_RANGES = {
    "7D": { label: "Last 7 Days", days: 7 },
    "1M": { label: "Last Month", days: 30 },
    "3M": { label: "Last 3 Months", days: 90 },
    "6M": { label: "Last 6 Months", days: 180 },
    ALL: { label: "All Time", days: null },
};




// #endregion
const AccountChart = ({ transactions }) => {

    const [dateRange, setDateRange] = useState("3M");

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange];
        const now = new Date();

        const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

        const filtered = transactions
            .map((t) => ({
                ...t,
                date: new Date(t.date),
            }))
            .filter((t) => t.date >= startDate && t.date <= endOfDay(now));

        const grouped = filtered.reduce((acc, transaction) => {
            const dateKey = format(transaction.date, "yyyy-MM-dd");
            const label = format(transaction.date, "MMM dd");

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    date: label,
                    income: 0,
                    expense: 0,
                    timestamp: transaction.date.getTime(),
                };
            }

            if (transaction.type === "INCOME") {
                acc[dateKey].income += transaction.amount;
            } else {
                acc[dateKey].expense += transaction.amount;
            }

            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
    }, [transactions, dateRange]);

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, day) => ({
                income: acc.income + day.income,
                expense: acc.expense + day.expense,
            }),
            { income: 0, expense: 0 }
        );
    }, [filteredData]);

    return (
        <Card>
            <CardHeader className="flex items-center justify-between pb-7">
                <CardTitle>Transaction Overview</CardTitle>
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.entries(DATE_RANGES).map(([key, { label }]) => {
                                return (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="flex justify-around mb-6 text-sm">
                    <div>
                        <p className="text-muted-foreground">Total Income</p>
                        <p className="text-lg font-bold text-green-500">
                            ${totals.income.toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Total Expense</p>
                        <p className="text-lg font-bold text-red-500">
                            ${totals.expense.toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Net</p>
                        <p
                            className={`text-lg font-bold ${
                                totals.income - totals.expense >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            ${((totals.income - totals.expense) || 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={filteredData}
                            margin={{ top: 10, right: 16, left: 25, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `$${value}`} width={48} />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend verticalAlign="top" height={24} />
                            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountChart;