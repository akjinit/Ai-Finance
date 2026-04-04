"use server";
import connectDB from "./db";
import { User } from "../models/User";
import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) return null;

    try {
        await connectDB();

        let loggedInUser = await User.findOne({ clerkUserId: user.id });

        if (!loggedInUser) {
            loggedInUser = await User.create({
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
                name: user.firstName + " " + user.lastName,
            });
        }

        return JSON.parse(JSON.stringify(loggedInUser));
    } catch (error) {
        console.log(error);
        return null;
    }
};