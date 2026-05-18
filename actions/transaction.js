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

function parseReceiptResponse(text) {
    const cleanedText = text
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleanedText);
    } catch {
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Gemini did not return a JSON object");
        }

        return JSON.parse(jsonMatch[0]);
    }
}

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

        const oldAccountId = originalTransaction.accountId.toString();
        const newAccountId = data.accountId.toString();

        if (oldAccountId !== newAccountId) {
            const oldAccountChange =
                originalTransaction.type === "EXPENSE"
                    ? originalTransaction.amount
                    : -originalTransaction.amount;

            await Account.updateOne(
                { _id: oldAccountId, userId: user.id },
                {
                    $inc: { balance: oldAccountChange },
                    $pull: { transactions: originalTransaction._id },
                },
                { session }
            );

            const newAccount = await Account.findOne({
                _id: newAccountId,
                userId: user.id,
            }).session(session);

            if (!newAccount) throw new Error("Account not found");

            const newAccountChange =
                data.type === "EXPENSE" ? -data.amount : data.amount;
            newAccount.balance += newAccountChange;
            newAccount.transactions.addToSet(originalTransaction._id);
            await newAccount.save({ session });
        } else {
            const account = await Account.findOne({
                _id: data.accountId,
                userId: user.id,
            }).session(session);
            if (!account) throw new Error("Account not found");

            account.balance += netBalanceChange;
            await account.save({ session });
        }

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

        await session.commitTransaction();

        revalidatePath("/dashboard");
        revalidatePath(`/accounts/${originalTransaction.accountId}`);
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
        .sort({ date: -1 });

        return { success: true, data: JSON.parse(JSON.stringify(transactions)) };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function scanReceipt(file) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
          Analyze this receipt image and extract the following information in JSON format:
          - Total amount (just the number)
          - Date (in ISO format)
          - Description or items purchased (brief summary)
          - Merchant/store name
          - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
          
          Only respond with valid JSON. Do not include markdown, code fences, or explanatory text.
          Use this exact format:
          {
            "amount": number,
            "date": "ISO date string",
            "description": "string",
            "merchantName": "string",
            "category": "string"
          }

          If it is not a receipt, return {}
        `;

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

        try {
            const data = parseReceiptResponse(text);

            if (!data || Object.keys(data).length === 0) {
                throw new Error("No receipt data found");
            }

            const amount = parseFloat(data.amount);
            const date = data.date ? new Date(data.date) : new Date();

            if (Number.isNaN(amount)) {
                throw new Error("Receipt amount was missing or invalid");
            }

            return {
                amount,
                date: Number.isNaN(date.getTime()) ? new Date() : date,
                description: data.description || data.merchantName || "",
                category: data.category || "other-expense",
                merchantName: data.merchantName || "",
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
