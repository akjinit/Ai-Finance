'use server';

import { Account } from "@/models/Account";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date;
}

export async function createTransaction(data) {
    let session;

    try {
        await connectDB();
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

        session = await mongoose.startSession();
        session.startTransaction();

        const account = await Account.findOne({
            _id: data.accountId,
            userId: user.id,
        }).session(session);

        if (!account) {
            throw new Error("Account not found");
        }

        const newBalance =
            data.type === "INCOME"
                ? account.balance + data.amount
                : account.balance - data.amount;

        if (newBalance < 0) {
            throw new Error("Insufficient funds");
        }

        const transaction = await Transaction.create(
            [{
                ...data,
                userId: account.userId,
                nextRecurringDate:
                    data.isRecurring && data.recurringInterval
                        ? calculateNextRecurringDate(
                            data.date,
                            data.recurringInterval
                        )
                        : null,
            }],
            { session }
        );

        account.transactions.push(transaction[0]._id);
        account.balance = newBalance;

        await account.save({ session });
        await session.commitTransaction();

        revalidatePath("/dashboard");
        revalidatePath(`/accounts/${account._id}`);

        return {
            success: true,
            transaction: JSON.parse(JSON.stringify(transaction[0])),
        };
    } catch (err) {
        if (session) {
            await session.abortTransaction();
        }
        throw err;
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

export async function getTransaction(id) {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await User.findOne({ clerkUserId: userId });
        if (!user) throw new Error("User not found");

        const transaction = await Transaction.findOne({
            _id: id,
            userId: user.id,
        });

        if (!transaction) throw new Error("Transaction not found");

        return JSON.parse(JSON.stringify(transaction));
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function updateTransaction(id, data) {
    let session;
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await User.findOne({ clerkUserId: userId });
        if (!user) throw new Error("User not found");

        session = await mongoose.startSession();
        session.startTransaction();

        const originalTransaction = await Transaction.findOne({
            _id: id,
            userId: user.id,
        }).session(session);

        if (!originalTransaction) throw new Error("Transaction not found");

        const oldBalanceChange =
            originalTransaction.type === "EXPENSE"
                ? -originalTransaction.amount
                : originalTransaction.amount;

        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        // Update transaction
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, userId: user.id },
            {
                ...data,
                nextRecurringDate:
                    data.isRecurring && data.recurringInterval
                        ? calculateNextRecurringDate(data.date, data.recurringInterval)
                        : null,
            },
            { new: true, session }
        );

        // Update account balance
        const account = await Account.findOne({ _id: data.accountId }).session(session);
        if (!account) throw new Error("Account not found");
        
        account.balance += netBalanceChange;
        await account.save({ session });

        await session.commitTransaction();

        revalidatePath("/dashboard");
        revalidatePath(`/accounts/${data.accountId}`);

        return { success: true, data: JSON.parse(JSON.stringify(updatedTransaction)) };
    } catch (error) {
        if (session) await session.abortTransaction();
        throw new Error(error.message);
    } finally {
        if (session) session.endSession();
    }
}

export async function getUserTransactions(query = {}) {
    try {
        await connectDB();
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await User.findOne({ clerkUserId: userId });
        if (!user) throw new Error("User not found");

        const transactions = await Transaction.find({
            userId: user.id,
            ...query,
        })
        .populate("accountId")
        .sort({ date: -1 });

        return { success: true, data: JSON.parse(JSON.stringify(transactions)) };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function scanReceipt(file) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const prompt = \`
          Analyze this receipt image and extract the following information in JSON format:
          - Total amount (just the number)
          - Date (in ISO format)
          - Description or items purchased (brief summary)
          - Merchant/store name
          - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
          
          Only respond with valid JSON in this exact format:
          {
            "amount": number,
            "date": "ISO date string",
            "description": "string",
            "merchantName": "string",
            "category": "string"
          }

          If its not a recipt, return an empty object
        \`;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            },
            prompt,
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/\`\`\`(?:json)?\\n?/g, "").trim();

        try {
            const data = JSON.parse(cleanedText);
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName,
            };
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid response format from Gemini");
        }
    } catch (error) {
        console.error("Error scanning receipt:", error);
        throw new Error("Failed to scan receipt");
    }
}