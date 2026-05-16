"use server"

import { Budget } from "@/models/Budget";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { success } from "zod";

export async function getCurrentBudget(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorised");

        const user = await User.findOne({
            clerkUserId: userId,
        });

        if (!user) {
            throw new Error("User not found");
        }


        const budget = await Budget.findOne({
            userId: user._id
        })

        const currentDate = new Date();
        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const expenses = await Transaction.aggregate([
            {
                $match: {
                    userId: user._id,
                    accountId: accountId,
                    type: "EXPENSE",
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        const totalExpenses = expenses.length > 0 ? expenses[0].totalExpenses : 0;

        return {
            budget: budget ? budget.amount : 0,
            totalExpenses,
        }
    } catch (error) {
        console.error("Error fetching current budget:", error);
        throw error;
    }

}




export async function updateBudget(amount) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorised");
        const user = await User.findOne({
            clerkUserId: userId,
        });

        if (!user) {
            throw new Error("User not found");
        }


        const budget = await Budget.findOne({
            userId: user._id
        });


        if (budget == null) {
            await Budget.create({
                userId: user._id,
                amount: amount,
            })
        } else {
            budget.amount = amount;
            await budget.save();
        }


        revalidatePath("/dashboard");
        return {
            success: true,
            ...budget
        }
    }
    catch (error) {
        console.error("Error updating budget:", error);
        return { success: false, message: error.message };
    }

}
