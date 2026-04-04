'use client'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
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
import React, { useState } from 'react'
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import useFetch from "@/app/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader, Loader2 } from "lucide-react";

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
    const { data: newAccount, error, fn: createAccountFunction, loading: createAccountLoading } = useFetch(createAccount)
    const onSubmit = async (data) => {
        const res  = await createAccount(data);
        console.log(res)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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

                                <SelectTrigger id="type" className="w-[180px]">
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

                        <div className="space-y-2">
                            <label htmlFor="balance" className="text-sm font-medium">Set as default</label>
                            <p>This account will be selected by defalult for transactions</p>
                            <Switch id="isDefault"
                                onCheckedChange={(checked) => { setValue('isDefault', checked) }}
                                checked={watch('isDefault')}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
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
