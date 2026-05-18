'use client'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import useFetch from "@/app/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: "",
            isDefault: false,
        }
    })
    const {
        data: newAccount,
        fn: createAccountFunction,
        loading: createAccountLoading
    } = useFetch(createAccount)

    useEffect(() => {
        if (newAccount) {
            toast.success("Account created successfully")
            reset();
            setOpen(false);
        }
    }, [newAccount])
    const onSubmit = async (data) => {
        await createAccountFunction(data);
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="mx-auto max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>Create Account</DrawerTitle>
                    <DrawerDescription>Add a place to track your balance and transactions.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Account Name</label>
                            <Input
                                id="name"
                                placeholder="e.g. , Main "
                                {...register('name')}
                            ></Input>
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium">Account Type</label>
                            <Select onValueChange={(value) => setValue('type', value)}
                                defaultValue={watch('type')}>

                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="CURRENT">Current</SelectItem>
                                        <SelectItem value="SAVINGS">Savings</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="balance" className="text-sm font-medium">Initial Balance</label>
                            <Input
                                id="balance"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('balance')}
                            ></Input>
                            {errors.balance && (
                                <p className="text-sm text-red-500">{errors.balance.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-lg border bg-slate-50 p-4">
                            <div>
                            <label htmlFor="isDefault" className="text-sm font-medium">Set as default</label>
                            <p className="text-sm text-muted-foreground">This account will be selected by default for transactions.</p>
                            </div>
                            <Switch id="isDefault"
                                onCheckedChange={(checked) => { setValue('isDefault', checked) }}
                                checked={watch('isDefault')}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                            <DrawerClose asChild className={'flex-1'}>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                            <Button disabled={createAccountLoading} className={'flex-1'} type="submit">{createAccountLoading ? <><Loader2 className="h-4 w-4 animate-spin" />
                                Creating...</> : `Create Account`}</Button>
                        </div>
                    </form>
                </div>

            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer
