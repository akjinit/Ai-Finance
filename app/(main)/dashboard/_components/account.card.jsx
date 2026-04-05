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

const AccountCard = ({ account }) => {
    const { name, balance, type, id, isDefault } = account;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
                <p className='text-2xl font-bold'>Balance: ${balance.toFixed(2)}</p>
                <p className='text-xs text-muted-foreground capitalize'>Type: {type} </p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default AccountCard
