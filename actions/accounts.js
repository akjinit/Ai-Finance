"use server";

import { Account } from "@/models/Account";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function updateDefaultAccount(accountId) {
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

        await Account.updateMany(
            { userId: user.id },
            { $set: { isDefault: false } }
        );
        await Account.findByIdAndUpdate(accountId, { isDefault: true });

        revalidatePath("/dashboard");
        return { success: true };

    } catch (err) {
        return { success: false, message: err.message };
    }
}


export async function getAccountWithTransactions(accountId) {
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


        const account = await Account.findOne({
            _id: accountId,
            userId: user.id,
        }).populate({
            path: "transactions",
            options: { sort: { createdAt: -1 } }
        });


        if (!account) {
            return null;
        }


        return JSON.parse(JSON.stringify(account));
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export async function bulkDeleteTransactions(transactionIds) {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

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

        const transactions = await Transaction.find({
            _id: { $in: transactionIds },
            userId: user._id
        }).session(session);

        // calculate balance changes per account
        const accountBalanceChanges = transactions.reduce((acc, transaction) => {

            const change =
                transaction.type === "EXPENSE"
                    ? transaction.amount
                    : -transaction.amount;

            const accountId = transaction.accountId.toString();

            acc[accountId] = (acc[accountId] || 0) + change;

            return acc;

        }, {});

        // delete transactions
        await Transaction.deleteMany({
            _id: { $in: transactionIds },
            userId: user._id
        }).session(session);

        // update account balances
        for (const accountId in accountBalanceChanges) {

            await Account.updateOne(
                { _id: accountId },
                {
                    $inc: {
                        balance: accountBalanceChanges[accountId]
                    }
                },

            ).session(session);
        }

        await session.commitTransaction();

        return {
            success: true
        };

    } catch (error) {

        await session.abortTransaction();

        return {
            success: false,
            error: error.message
        };


    } finally {

        session.endSession();
        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");

    }
}