"use server";

import { Account } from "@/models/Account";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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