'use client'
import React, { useEffect, useState } from 'react'
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
import { Check, Pencil, X } from 'lucide-react';
import useFetch from '@/app/hooks/use-fetch';
import { updateBudget } from '@/actions/budget';
import { toast } from 'sonner';
import {ProgressBar} from './ProgressBar';

const BudgetProgress = ({ budget, totalExpenses }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(budget);

    const percentageUsed = budget > 0 ? ((totalExpenses / budget) * 100).toFixed(2) : 0;

    const handleCancel = () => {
        setIsEditing(false);
        setNewBudget(budget);
    }


    const {
        loading: isLoading,
        error,
        fn: updateBudgetFn
    } = useFetch(updateBudget);

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);
        if (isNaN(amount) || amount < 0) {
            toast.error("Please enter a valid non-negative number for the budget.");
            return;
        } 
        const result = await updateBudgetFn(amount);

        if (result?.success) {
            toast.success("Budget updated successfully");
            setNewBudget(result.budget);
            setIsEditing(false);
        }
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Something went wrong while updating budget");
        }
    }, [error]);

    return (
        <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-col justify-between gap-3 pb-2 sm:flex-row sm:items-center">
                <CardTitle>Monthly Budget</CardTitle>
                <div >
                    {isEditing ? (


                        <div className='flex flex-wrap items-center gap-2'>
                            <Input type="number" className={"w-32"} placeholder="Enter amount" autoFocus value={newBudget} disabled={isLoading} onChange={(e) => setNewBudget(parseFloat(e.target.value))} />
                            <Button onClick={handleUpdateBudget} disabled={isLoading}>
                                <Check className='h-4 w-4 text-green-500' />
                            </Button>
                            <Button onClick={handleCancel} disabled={isLoading}>
                                <X className='h-4 w-4 text-red-500' />
                            </Button>
                        </div>


                    ) : (

                        <div className='flex flex-wrap items-center gap-2'>
                            <CardDescription>{budget > 0 ? `Budget: $${budget.toFixed(2)} of $${totalExpenses.toFixed(2)} spent` : 'No budget set'}</CardDescription>
                            <Button size="icon" variant="outline" onClick={() => setIsEditing(true)} disabled={isLoading}>
                                <Pencil className='h-3 w-3' />
                            </Button>
                        </div>

                    )}
                </div>
            </CardHeader>
            <CardContent>
                {budget > 0 && <ProgressBar percentageUsed={parseFloat(percentageUsed)} />}
            </CardContent>
            <p className='text-xs text-muted-foreground px-4 text-right'>{percentageUsed}% used</p>

        </Card>
    )
}

export default BudgetProgress
