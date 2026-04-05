"use server";

import { auth } from "@clerk/nextjs/server";
import { Account } from "@/models/Account";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { Transaction } from "@/models/Transaction";

export async function createAccount(data) {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await User.findOne({
            clerkUserId: userId,
        });

        if (!user) {
            throw new Error("User not found");
        }

        const balanceFloat = parseFloat(data.balance);

        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        const existingAccounts = await Account.find({
            userId: user.id,
        });

        const shouldBeDefault =
            existingAccounts.length === 0
                ? true
                : data.isDefault;

        if (shouldBeDefault) {
            await Account.updateMany(
                { userId: user.id },
                { $set: { isDefault: false } }
            );
        }

        const account = await Account.create({
            ...data,
            balance: balanceFloat,
            userId: user.id,
            isDefault: shouldBeDefault,
        });

        revalidatePath("/dashboard"); //refetch the apis on this page and rerender
        return { success: true, data: JSON.parse(JSON.stringify(account)) };

    } catch (err) {
        console.log(err);
        throw err;
    }
}


export async function getUserAccounts() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await User.findOne({
        clerkUserId: userId,
    });

    if (!user) {
        throw new Error("User not found");
    }

    const accounts = await Account.find({
        userId: user.id,
    }).sort({ createdAt: -1 });

    const accountsWithTransactions = await Promise.all(
        accounts.map(async (account) => {
            const transactions = await Transaction.find({
                _id: account._id,
            })
                .sort({ createdAt: -1 })
                .limit(5);

            return {
                ...account.toObject(),
                transactions,
            };
        })
    );
    console.log("Accounts with transactions:", accountsWithTransactions); // Debugging line to check the accounts with transactions
    return accountsWithTransactions;
}