import { Account } from "@/models/Account";
import { User } from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

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
        toast.success("Default account updated successfully!");

        revalidatePath("/dashboard");

    } catch (err) {
        toast.error("Failed to update default account. Please try again.");
    }
}