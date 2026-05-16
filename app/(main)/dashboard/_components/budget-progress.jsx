'use client'
import React, { useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';


const BudgetProgress = ({ budget, totalExpenses }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(budget, 0);

    const percentageUsed = budget > 0 ? ((totalExpenses / budget) * 100).toFixed(2) : 0;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Budget (Default Account)</CardTitle>
                <div>
                    {isEditing ? (
                        <>

                            <Input type="number" className={"w-32"} placeholder="Enter amount" autoFocus value={newBudget} onChange={(e) => setNewBudget(parseFloat(e.target.value) || 0)} />
                            <Button><Check className='h-4 w-4 text-green-500' /></Button>
                            <Button><X className='h-4 w-4 text-red-500' /></Button>
                        </>

                    ) : (
                        <>
                            <CardDescription>{budget > 0 ? `Budget: $${budget.toFixed(2)} of $${totalExpenses.toFixed(2)} spent` : 'No budget set'}</CardDescription>
                        </>
                    )}
                </div>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>

        </Card>
    )
}

export default BudgetProgress
