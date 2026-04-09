'use client'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"


import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { categoryColors } from '@/data/categories'
import { Badge } from '@/components/ui/badge'
import { Clock, MoreHorizontal, RefreshCcw, RefreshCcwDot } from 'lucide-react'

const recurringIntervals = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
}

const TransactionsTable = ({ transactions }) => {
    console.log(transactions);
    const filteredAndSortedTransactions = transactions;
    const handleSort = () => {

    }
    return (
        <div>
            {/* Filters */}
            {/* Transactions */}

            <Table className="rounded-md ">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>

                        <TableHead className="cursor-pointer" onClick={
                            () => handleSort("date")
                        }>
                            <div className='flex items-center '>
                                Date
                            </div>
                        </TableHead>

                        <TableHead className="cursor-pointer">Description</TableHead>
                        <TableHead className="cursor-pointer">
                            <div className='flex items-center '>
                                Category
                            </div>
                        </TableHead>

                        <TableHead className="cursor-pointer" onClick={
                            () => handleSort("amount")
                        }>
                            <div className='flex items-center justify-end'>
                                Amount
                            </div>
                        </TableHead>



                        <TableHead>Recurring</TableHead>
                        <TableHead className="w-[50px]"></TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedTransactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (filteredAndSortedTransactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                            <TableCell className="font-medium"> <Checkbox /></TableCell>
                            <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell >
                                <span style={
                                    { background: categoryColors[transaction.category] || "gray" }
                                } className='w-full text-right px-2 py-1 rounded text-white text-sm'>
                                    {transaction.category}
                                </span>
                            </TableCell>
                            <TableCell className="text-right font-medium" style={{ color: transaction.type === "INCOME" ? "green" : "red" }}>
                                {transaction.type === "INCOME" ? "+" : "-"}
                                ${transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>{transaction.isRecurring ? (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant='outline' className="bg-purple-100 text-purple-700 hover:bg-purple-200" >
                                            <RefreshCcw className='h-3 w-3 '></RefreshCcw>
                                            {recurringIntervals[transaction.recurringInterval]}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent >

                                        <div>
                                            <div>Next Date: </div>
                                            <div>{format(new Date(transaction.date), "PP")}</div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>) :
                                <Badge variant='outline'>
                                    <Clock className='h-3 w-3'></Clock>
                                    One Time
                                </Badge>}
                            </TableCell>





                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <MoreHorizontal className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Edit</DropdownMenuLabel>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                    ))}

                </TableBody>
            </Table>
        </div >
    )
}

export default TransactionsTable
