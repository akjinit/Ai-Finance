'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCcw, RefreshCcwDot, Search, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import useFetch from '@/app/hooks/use-fetch'
import { bulkDeleteTransactions } from '@/actions/accounts'
import { toast } from 'sonner'
import { BarLoader } from 'react-spinners'

const recurringIntervals = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
}

const TransactionsTable = ({ transactions }) => {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc"
    });


    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [recurringFilter, setRecurringFilter] = useState('');
    const [page, setPage] = useState(1);


    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted
    } = useFetch(bulkDeleteTransactions);

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
            return;
        }

        deleteFn(selectedIds);
    }

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully");
            handleClearFilter();
        }
    }, [deleted, deleteLoading])

    const handleSort = (field) => {
        setSortConfig((current) => ({
            field,
            direction:
                (current.field === field && current.direction === "asc" ? "desc" : "asc")
        }))
    }


    const handleSelect = (id) => {
        setSelectedIds((current) => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    }

    const handleSelectAll = () => {
        if (selectedIds.length === transactions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(transactions.map(t => t._id));
        }
    }


    const handleClearFilter = () => {
        setSearchTerm('');
        setRecurringFilter('');
        setSelectedIds([]);
        setTypeFilter('');
    }

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions]


        //applying the search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) => {
                return transaction.description?.toLowerCase().includes(searchLower)
            })
        }


        //recurring filter
        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === "recurring") return transaction.isRecurring
                return !transaction.isRecurring
            })
        }

        //apply type filter
        if (typeFilter) {
            result = result.filter((transaction) => {
                return transaction.type === typeFilter
            })
        }

        "sefw".localCompare
        result.sort((a, b) => {
            let comparision = 0;

            switch (sortConfig.field) {
                case "date":
                    comparision = new Date(a.date) - new Date(b.date)
                    break
                case "amount":
                    comparision = a.amount - b.amount
                    break

                case "category":
                    comparision = a.category.localCompare(b.category)
                    break
                default:
                    break
            }

            return sortConfig.direction === "asc" ? comparision : -comparision;
        })

        return result
    }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig])

    // pagination
    const lastPage = Math.max(1, Math.ceil(filteredAndSortedTransactions.length / 15));

  


    return (
        <div>
            {/* Filters */}
            {deleteLoading && (<BarLoader className='mt-4' width={"100%"}></BarLoader>)}

            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-2 top-2 h-4 w-4 text-gray-500' />
                    <Input placeholder='Search transactions...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pl-8' />
                </div>

                <div className='flex gap-2'>
                    <Select value={typeFilter} onValueChange={(value) => {
                        setTypeFilter(value)
                    }
                    }>
                        <SelectTrigger >
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                    <Select value={recurringFilter} onValueChange={(value) => {
                        setRecurringFilter(value)
                    }}>
                        <SelectTrigger >
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="recurring">Recurring Only</SelectItem>
                                <SelectItem value="non-recurring">Non Recurring Only</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                    {selectedIds.length > 0 &&
                        <Button variant='destructive' onClick={handleBulkDelete}
                        >
                            <Trash className='h-4 w-4 mr-1'></Trash>
                            Delete Selected ({selectedIds.length})
                        </Button>
                    }


                    {(searchTerm || typeFilter || recurringFilter) && (
                        <Button variant='outline' size='icon' onClick={handleClearFilter} title='clear filters'>
                            <X className='h-4 w-4'></X>
                        </Button>
                    )
                    }
                </div>
            </div>
            {/* Transactions */}

            <Table className="rounded-md ">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox onCheckedChange={handleSelectAll} checked={selectedIds.length === transactions.length} />
                        </TableHead>

                        <TableHead className="cursor-pointer" onClick={
                            () => handleSort("date")
                        }>
                            <div className='flex items-center '>
                                Date
                                {sortConfig.field === "date" && (
                                    sortConfig.direction === "asc" ? (
                                        <ChevronUp className='h-3 w-3 ml-1'></ChevronUp>
                                    ) : (
                                        <ChevronDown className='h-3 w-3 ml-1'></ChevronDown>
                                    )
                                )}
                            </div>
                        </TableHead>

                        <TableHead className="cursor-pointer">Description</TableHead>
                        <TableHead className="cursor-pointer">
                            <div className='flex items-center '>
                                Category
                                {sortConfig.field === "category" && (
                                    sortConfig.direction === "asc" ? (
                                        <ChevronUp className='h-3 w-3 ml-1'></ChevronUp>
                                    ) : (
                                        <ChevronDown className='h-3 w-3 ml-1'></ChevronDown>
                                    )
                                )}
                            </div>
                        </TableHead>

                        <TableHead className="cursor-pointer" onClick={
                            () => handleSort("amount")
                        }>
                            <div className='flex items-center justify-end'>
                                Amount
                                {sortConfig.field === "amount" && (
                                    sortConfig.direction === "asc" ? (
                                        <ChevronUp className='h-3 w-3 ml-1'></ChevronUp>
                                    ) : (
                                        <ChevronDown className='h-3 w-3 ml-1'></ChevronDown>
                                    )
                                )}
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
                    ) : (filteredAndSortedTransactions.slice((page - 1) * 15, page * 15).map((transaction) => (
                        <TableRow key={transaction._id}>
                            <TableCell className="font-medium"> <Checkbox onCheckedChange={() => handleSelect(transaction._id)} checked={selectedIds.includes(transaction._id)} /></TableCell>
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
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => {
                                                router.push(`/accounts/transactions/${transaction._id}`)
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive"
                                                onClick={() => {
                                                    deleteFn(transaction._id);
                                                }}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                    ))}

                </TableBody>
            </Table>
            {/* Pagination controls */}
            {filteredAndSortedTransactions.length > 0 && (
                <div className='w-full mb-10 flex '>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            <Button size='sm' disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                            <div>Page {page} / {lastPage}</div>
                            <Button size='sm' disabled={page >= lastPage} onClick={() => setPage((p) => Math.min(lastPage, p + 1))}>Next</Button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default TransactionsTable
