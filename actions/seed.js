"use server";

import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";



const ACCOUNT_ID = "69d3daa599d673e413389644";
const USER_ID = "69d3d3a099d673e4133894c6";

// Categories with their typical amount ranges
const CATEGORIES = {
    INCOME: [
        { name: "salary", range: [5000, 8000] },
        { name: "freelance", range: [1000, 3000] },
        { name: "investments", range: [500, 2000] },
        { name: "other-income", range: [100, 1000] },
    ],
    EXPENSE: [
        { name: "housing", range: [1000, 2000] },
        { name: "transportation", range: [100, 500] },
        { name: "groceries", range: [200, 600] },
        { name: "utilities", range: [100, 300] },
        { name: "entertainment", range: [50, 200] },
        { name: "food", range: [50, 150] },
        { name: "shopping", range: [100, 500] },
        { name: "healthcare", range: [100, 1000] },
        { name: "education", range: [200, 1000] },
        { name: "travel", range: [500, 2000] },
    ],
};

// Helper to generate random amount within a range
function getRandomAmount(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type) {
    const categories = CATEGORIES[type];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = getRandomAmount(category.range[0], category.range[1]);
    return { category: category.name, amount };
}

export async function seedTransactions() {
    try {
        const user = await User.findById(USER_ID);
        if (!user) {
            throw new Error("User not found");
        }
        const account = await Account.findById(ACCOUNT_ID);
        if (!account) {
            throw new Error("Account not found");
        }


        for (let i = 90; i >= 0; i--) {

            // Generate 1-3 transactions per day
            const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < transactionsPerDay; j++) {
                // 40% chance of income, 60% chance of expense
                const transactionType = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
                let { category, amount } = getRandomCategory(transactionType);

                const description = (transactionType === "INCOME" ? "Received for " : "Paid for ") + category;
                const transaction = await Transaction.create({
                    type: transactionType,
                    amount,
                    category,
                    description,
                    userId: USER_ID,
                    accountId: ACCOUNT_ID,
                });

                account.transactions.push(transaction._id);
            }
        }

        await account.save();

        return {
            success: true,
            message: `Created ${account.transactions.length} transactions`,
        };
    } catch (error) {
        console.error("Error seeding transactions:", error);
        return { success: false, error: error.message };
    }
}