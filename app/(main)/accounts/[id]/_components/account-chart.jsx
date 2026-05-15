"use client";

import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
        
        const filtered = transactions.filter((t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now));
        
        const grouped = filtered.reduce((acc, transaction) => {
            const date = format(transaction.date, "MMM dd");

            if (!acc[date]) {
                acc[date] = { date , income: 0, expense: 0 };
            }

            if (transaction.type == "INCOME") {
                acc[date].income += transaction.amount;
            } else {
                acc[date].expense += transaction.amount;
            }

            return acc;
        }, {});

        return Object.values(grouped).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

    }, [transactions, dateRange]);

    console.log(filteredData);

    return (
        <div>

            {/* <BarChart
                style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} />
                <Bar dataKey="uv" fill="#82ca9d" activeBar={{ fill: 'gold', stroke: 'purple' }} radius={[10, 10, 0, 0]} />
            </BarChart> */}
        </div>
    );
};

export default AccountChart;