import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

const AccountCard = ({ account }) => {
    console.log(account);
    const { name, balance, type, _id, isDefault } = account;
    return (
        <Card className={"hover:shadow-md transition-shadow"}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>{name}</CardTitle>
                <Switch checked={isDefault} />
            </CardHeader>
            <Link href={`/accounts/${_id}`} className='' >

                <CardContent className="pb-4">
                    <p className='text-2xl font-bold'>${balance.toFixed(2)}</p>
                    <p className='text-xs text-muted-foreground capitalize'> {type.toLowerCase()} Account </p>
                </CardContent>
                <CardFooter  className="flex justify-between text-sm text-muted-foreground">
                    <div className='flex items-center'>
                        <ArrowUpRight className='w-4 h-4 text-green-500' />
                        Income
                    </div>
                    <div className='flex items-center'>
                        <ArrowDownRight className='w-4 h-4 text-red-500' />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard
