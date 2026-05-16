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
        data: updatedBudget,
        fn: updateBudgetFn
    } = useFetch(updateBudget);

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);
        if (isNaN(amount) || amount < 0) {
            toast.error("Please enter a valid non-negative number for the budget.");
            return;
        } 
        await updateBudgetFn(amount);
    }

    useEffect(()=>{
        if(updatedBudget?.success) {
            toast.success("Budget updated successfully");
            setIsEditing(false);
        }
    },[updatedBudget]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Something went wrong while updating budget");
        }
    }, [error]);

    return (
        <Card>
            <CardHeader className="flex flex-col  justify-between space-y-2 pb-2">
                <CardTitle>Monthly Budget (Default Account)</CardTitle>
                <div >
                    {isEditing ? (


                        <div className='flex gap-2 items-center '>
                            <Input type="number" className={"w-32"} placeholder="Enter amount" autoFocus value={newBudget} disabled={isLoading} onChange={(e) => setNewBudget(parseFloat(e.target.value))} />
                            <Button onClick={handleUpdateBudget} disabled={isLoading}>
                                <Check className='h-4 w-4 text-green-500' />
                            </Button>
                            <Button onClick={handleCancel} disabled={isLoading}>
                                <X className='h-4 w-4 text-red-500' />
                            </Button>
                        </div>


                    ) : (

                        <div className='flex gap-2 items-center '>
                            <CardDescription>{budget > 0 ? `Budget: $${budget.toFixed(2)} of $${totalExpenses.toFixed(2)} spent` : 'No budget set'}</CardDescription>
                            <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
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
